import { createClient } from '@supabase/supabase-js';
import type { Express, RequestHandler } from "express";
import session from "express-session";
import MemoryStore from 'memorystore';
import connectPgSimple from 'connect-pg-simple';

const MemorySessionStore = MemoryStore(session);
const PgSession = connectPgSimple(session);

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase environment variables not provided - authentication will be disabled for local development");
}

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week

  // Use memory store for local development, postgres for production
  const sessionStore = process.env.DATABASE_URL
    ? new PgSession({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
      })
    : new MemorySessionStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      });

  return session({
    secret: process.env.SESSION_SECRET || 'default-session-secret-for-local-dev',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Skip auth setup if Supabase isn't configured
  if (!supabase) {
    console.warn("Supabase not configured - skipping authentication setup for local development");
    return;
  }

  // Login route
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return res.status(401).json({ message: error.message });
      }

      // Store session info
      (req.session as any).user = {
        id: data.user.id,
        email: data.user.email,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      };

      res.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.user.user_metadata?.role || 'provider'
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Register route
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, full_name, role = 'provider' } = req.body;

      if (!email || !password || !full_name) {
        return res.status(400).json({ message: 'Email, password, and full name are required' });
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            role
          }
        }
      });

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      res.json({
        success: true,
        message: 'Registration successful. Please check your email to confirm your account.',
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          role: data.user.user_metadata?.role || role
        } : null
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Logout route
  app.post('/api/auth/logout', async (req, res) => {
    try {
      const sessionUser = (req.session as any).user;

      if (sessionUser?.access_token && supabase) {
        // Sign out from Supabase
        await supabase.auth.signOut();
      }

      // Clear session
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
        }
        res.clearCookie('connect.sid'); // Default session cookie name
        res.json({ success: true, message: 'Logged out successfully' });
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get current user route
  app.get('/api/auth/user', async (req, res) => {
    try {
      const sessionUser = (req.session as any).user;

      if (!sessionUser) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      // Check if token is still valid
      if (sessionUser.expires_at && Date.now() / 1000 > sessionUser.expires_at) {
        return res.status(401).json({ message: 'Session expired' });
      }

      res.json({
        id: sessionUser.id,
        email: sessionUser.email,
        role: sessionUser.role || 'provider'
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  try {
    const sessionUser = (req.session as any).user;

    if (!sessionUser) {
      return res.status(401).json({ message: "Unauthorized - No session" });
    }

    // Check if token is expired
    if (sessionUser.expires_at && Date.now() / 1000 > sessionUser.expires_at) {
      // Try to refresh the token if we have a refresh token
      if (sessionUser.refresh_token && supabase) {
        try {
          const { data, error } = await supabase.auth.refreshSession({
            refresh_token: sessionUser.refresh_token
          });

          if (error || !data.session) {
            return res.status(401).json({ message: "Unauthorized - Session expired" });
          }

          // Update session with new tokens
          sessionUser.access_token = data.session.access_token;
          sessionUser.refresh_token = data.session.refresh_token;
          sessionUser.expires_at = data.session.expires_at;
        } catch (refreshError) {
          return res.status(401).json({ message: "Unauthorized - Token refresh failed" });
        }
      } else {
        return res.status(401).json({ message: "Unauthorized - Session expired" });
      }
    }

    // Add user info to request for route handlers
    (req as any).user = {
      id: sessionUser.id,
      email: sessionUser.email,
      role: sessionUser.role || 'provider',
      claims: { sub: sessionUser.id } // For compatibility with existing routes
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};
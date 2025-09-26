# Rayshine Provider Portal - Standalone

A mobile-first React application for cleaning service providers. This is a standalone version exported from the main Rayshine marketplace monorepo.

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: Drizzle ORM (SQLite for development, PostgreSQL ready)
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: TanStack Query + React Context
- **Authentication**: Configurable (Supabase ready)
- **Build Tools**: Vite + ESBuild

## 📱 Features

- **Mobile-First Design**: Optimized for provider mobile usage
- **Job Management**: View, accept, and track cleaning jobs
- **Real-Time Updates**: Live job status and notifications
- **Quality Control**: Photo documentation and checklists
- **Earnings Dashboard**: Track payments and earnings
- **Provider Profile**: Manage skills, availability, and service area
- **Dark/Light Mode**: Theme switching support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 8+

### Installation

1. **Clone or extract the project**
   ```bash
   cd rayshine-provider-portal-standalone
   ```

2. **Install dependencies**
   ```bash
   npm run setup
   # This runs: npm install --legacy-peer-deps
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3009`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Run TypeScript checks
- `npm run setup` - Install dependencies with legacy peer deps
- `npm run clean` - Clean build artifacts and node_modules

## 🗄️ Database Setup

### Development (SQLite)
The app uses SQLite by default for local development. No additional setup required.

### Production (PostgreSQL)
1. Set up a PostgreSQL database
2. Update `DATABASE_URL` in your `.env` file
3. Run migrations: `npm run db:push`

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port (default: 3009) | Yes |
| `DATABASE_URL` | Database connection string | No (SQLite default) |
| `SESSION_SECRET` | Session encryption key | Yes |
| `SUPABASE_URL` | Supabase project URL | No |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | No |
| `STRIPE_SECRET_KEY` | Stripe secret key | No |

### Features Configuration

- **Authentication**: Configure Supabase credentials to enable auth
- **Payments**: Add Stripe keys for payment processing
- **Maps**: Add Google Maps API key for location features

## 🏢 Project Structure

```
rayshine-provider-portal-standalone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and API clients
│   │   └── styles/         # CSS and styling
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes/            # API routes
│   └── middleware/        # Express middleware
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and types
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind CSS config
└── tsconfig.json          # TypeScript configuration
```

## 🎨 UI Components

The app uses a modern component library built on:

- **Radix UI**: Accessible, unstyled components
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Modern icon set
- **Framer Motion**: Smooth animations

### Key Components

- `BookingOverview` - Job statistics dashboard
- `QualityControlDocumentation` - Photo and checklist system
- `EarningsCard` - Financial tracking
- `BottomNavigation` - Mobile navigation
- `MobileFrame` - Responsive container

## 🔌 API Integration

The backend provides REST endpoints for:

- Job management (`/api/jobs`)
- User authentication (`/api/auth`)
- Payment processing (`/api/payments`)
- File uploads (`/api/uploads`)

### Adding New Endpoints

1. Create route file in `server/routes/`
2. Add to `server/index.ts`
3. Update frontend API client in `client/src/lib/`

## 🚢 Deployment

### Production Build

```bash
npm run build
```

This creates:
- `dist/public/` - Frontend build
- `dist/index.js` - Backend bundle

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure `SESSION_SECRET`
4. Configure CORS origins in `ALLOWED_ORIGINS`

### Deploy Options

- **Vercel/Netlify**: Frontend only (configure serverless functions)
- **Railway/Render**: Full-stack deployment
- **Docker**: Use provided Dockerfile
- **Traditional VPS**: Run with PM2 or similar

## 🧪 Development

### Adding New Features

1. **Database Changes**: Update `shared/schema.ts`
2. **API Endpoints**: Add to `server/routes/`
3. **Frontend Components**: Create in `client/src/components/`
4. **Pages**: Add to `client/src/pages/`

### Code Style

- TypeScript strict mode enabled
- ESLint + Prettier configured
- Component naming: PascalCase
- File naming: kebab-case

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Change PORT in .env or kill existing process
   ```

2. **Dependency Conflicts**
   ```bash
   npm run clean
   npm run setup
   ```

3. **TypeScript Errors**
   ```bash
   npm run check
   # Fix any type issues in the output
   ```

4. **Build Failures**
   - Check Node.js version (18+)
   - Clear cache: `npm run clean`
   - Reinstall: `npm run setup`

### Getting Help

- Check the console for error messages
- Verify environment configuration
- Ensure all required dependencies are installed

## 📄 License

MIT License - see original Rayshine project for full license details.

## 🚀 Next Steps

1. **Configure Environment**: Set up your `.env` file
2. **Customize Branding**: Update colors, logos, and text
3. **Add Features**: Extend with your specific requirements
4. **Deploy**: Choose your preferred hosting platform
5. **Iterate**: Add new features based on user feedback

Happy coding! 🎉
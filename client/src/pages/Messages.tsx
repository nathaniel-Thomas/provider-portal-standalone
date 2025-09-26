import { ArrowLeft, Phone, Send, Camera, AlertTriangle, Navigation, Clock, CheckCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';

interface MessagesProps {
  onBack?: () => void;
}

export default function Messages({ onBack }: MessagesProps) {
  const [message, setMessage] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [providerStatus, setProviderStatus] = useState<'assigned' | 'en_route' | 'arrived' | 'in_progress' | 'completed'>('en_route');
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'connecting'>('online');
  const [unreadCount, setUnreadCount] = useState(0);

  // Enhanced message types with automated notifications
  const mockMessages = [
    {
      id: 1,
      type: 'system',
      content: 'Today 10:25 AM',
      timestamp: '10:25 AM'
    },
    {
      id: 2,
      type: 'notification',
      content: '🔔 Service provider assigned to your request',
      timestamp: '10:15 AM',
      automated: true,
      category: 'assignment'
    },
    {
      id: 3,
      type: 'notification',
      content: '🚗 Provider is en route to your location (ETA: 10 min)',
      timestamp: '10:20 AM',
      automated: true,
      category: 'location'
    },
    {
      id: 4,
      type: 'received',
      content: "Hi there! Just wanted to confirm you're still on for 10:30 AM?",
      timestamp: '10:25 AM'
    },
    {
      id: 5,
      type: 'sent',
      content: "Yes, absolutely! I'm on my way now and should be there right on time.",
      timestamp: '10:26 AM'
    },
    {
      id: 6,
      type: 'notification',
      content: '📍 Provider has arrived at your location',
      timestamp: '10:28 AM',
      automated: true,
      category: 'arrival'
    },
    {
      id: 7,
      type: 'received',
      content: 'Photo of area',
      timestamp: '10:28 AM',
      isImage: true
    },
    {
      id: 8,
      type: 'notification',
      content: '🔄 Service has started - estimated completion: 12:30 PM',
      timestamp: '10:30 AM',
      automated: true,
      category: 'service_start'
    },
    {
      id: 9,
      type: 'typing',
      content: 'typing...',
      timestamp: 'now'
    }
  ];

  // Smart quick replies based on job status
  const getQuickReplies = () => {
    switch (providerStatus) {
      case 'assigned':
        return ['On my way', 'Running 5 min late', 'Need to reschedule'];
      case 'en_route':
        return ['Almost there', 'Running late - 10 min', 'At your location'];
      case 'arrived':
        return ['At front door', 'Ready to start', 'Unable to access'];
      case 'in_progress':
        return ['Work going well', 'Found additional issue', 'Almost finished'];
      case 'completed':
        return ['Service complete', 'Please review work', 'Thank you!'];
      default:
        return ['On my way', 'Running late', 'Service complete'];
    }
  };

  const quickReplies = getQuickReplies();

  // Real-time connection status simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate connection status changes
      if (Math.random() < 0.05) { // 5% chance to change status
        const statuses: typeof connectionStatus[] = ['online', 'connecting', 'offline'];
        const currentIndex = statuses.indexOf(connectionStatus);
        const newIndex = (currentIndex + 1) % statuses.length;
        setConnectionStatus(statuses[newIndex]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [connectionStatus]);

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      // Simulate message delivery
      setTimeout(() => {
        console.log('Message delivered');
      }, 1000);
      setMessage('');
    }
  };

  const handleQuickReply = (reply: string) => {
    console.log('Quick reply:', reply);
    // Auto-update provider status based on quick reply
    if (reply.includes('arrived') || reply.includes('location')) {
      setProviderStatus('arrived');
    } else if (reply.includes('complete') || reply.includes('finished')) {
      setProviderStatus('completed');
    }
  };

  const handleEmergencyContact = () => {
    setIsEmergency(true);
    console.log('Emergency contact initiated');
    // In production, this would trigger emergency protocols
  };

  const sendLocationUpdate = () => {
    console.log('Sending location update to customer');
    // In production, this would send real GPS coordinates
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'online': return 'text-success-green';
      case 'connecting': return 'text-warning-orange';
      case 'offline': return 'text-destructive';
    }
  };

  const getStatusBadgeColor = () => {
    switch (providerStatus) {
      case 'assigned': return 'bg-primary';
      case 'en_route': return 'bg-blue-500';
      case 'arrived': return 'bg-warning-orange';
      case 'in_progress': return 'bg-success-green';
      case 'completed': return 'bg-gray-500';
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-muted z-30 flex flex-col" data-testid="screen-messages">
      {/* Enhanced Header */}
      <header className="bg-card border-b border-border shrink-0">
        <div className="flex items-center justify-between px-5 pt-10 pb-3">
          <Button
            variant="ghost"
            size="icon"
            className="p-2 -ml-2 hover-elevate"
            onClick={() => {
              onBack?.();
              console.log('Back to home');
            }}
            data-testid="button-back"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>

          <div className="text-center flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://i.pravatar.cc/32?img=1" />
                <AvatarFallback className="bg-primary text-white text-xs">SJ</AvatarFallback>
              </Avatar>
              {connectionStatus === 'online' && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success-green rounded-full border-2 border-bg-dark"></div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold" data-testid="text-contact-name">Sarah Johnson</p>
                <Badge className={`${getStatusBadgeColor()} text-white text-xs`}>
                  {providerStatus.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">Deep Clean - Oct 20</p>
                <p className={`text-xs ${getConnectionStatusColor()}`}>
                  {connectionStatus}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="p-2 hover-elevate"
              onClick={() => console.log('Call customer')}
              data-testid="button-call"
            >
              <Phone className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={`p-2 hover-elevate ${isEmergency ? 'text-destructive' : ''}`}
              onClick={handleEmergencyContact}
              data-testid="button-emergency"
            >
              <Shield className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Emergency Banner */}
        {isEmergency && (
          <Card className="mx-5 mb-3 bg-destructive/20 border-destructive/50">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-destructive">Emergency Support Activated</p>
                  <p className="text-xs text-destructive/80">Support team has been notified</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEmergency(false)}
                  className="text-destructive border-destructive/30"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Provider Actions Bar */}
        <div className="px-5 pb-3">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={sendLocationUpdate}
              className="flex-1 text-xs"
            >
              <Navigation className="h-3 w-3 mr-1" />
              Share Location
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setProviderStatus(
                providerStatus === 'en_route' ? 'arrived' :
                providerStatus === 'arrived' ? 'in_progress' :
                providerStatus === 'in_progress' ? 'completed' : 'assigned'
              )}
              className="flex-1 text-xs"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Update Status
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => console.log('Send appointment reminder')}
              className="flex-1 text-xs"
            >
              <Clock className="h-3 w-3 mr-1" />
              Send Reminder
            </Button>
          </div>
        </div>
      </header>
      
      {/* Messages */}
      <div className="flex-grow overflow-y-auto no-scrollbar p-4 space-y-4" data-testid="messages-container">
        {mockMessages.map((msg: any) => {
          if (msg.type === 'system') {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="bg-card text-xs text-muted-foreground px-3 py-1 rounded-full">
                  {msg.content}
                </span>
              </div>
            );
          }

          if (msg.type === 'notification') {
            const getCategoryColor = (category: string) => {
              switch (category) {
                case 'assignment': return 'border-primary/30 bg-primary/10';
                case 'location': return 'border-blue-500/30 bg-blue-500/10';
                case 'arrival': return 'border-warning-orange/30 bg-warning-orange/10';
                case 'service_start': return 'border-success-green/30 bg-success-green/10';
                default: return 'border-text-secondary/30 bg-text-secondary/10';
              }
            };

            return (
              <div key={msg.id} className="flex justify-center">
                <Card className={`max-w-[300px] border ${getCategoryColor(msg.category)}`}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="text-xs font-medium">{msg.content}</div>
                      <Badge variant="outline" className="text-xs">
                        Auto
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {msg.timestamp}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          }

          if (msg.type === 'typing') {
            return (
              <div key={msg.id} className="flex justify-start">
                <div className="bg-card p-2 rounded-lg max-w-[280px] message-bubble-received inline-flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[280px] p-3 rounded-lg ${
                msg.type === 'sent'
                  ? 'gradient-purple message-bubble-sent'
                  : 'bg-card message-bubble-received'
              }`} data-testid={`message-${msg.id}`}>
                {msg.isImage ? (
                  <div>
                    <div className="w-48 h-32 bg-primary/20 rounded-lg flex items-center justify-center mb-2">
                      <Camera className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
                <p className={`text-xs mt-1 ${
                  msg.type === 'sent'
                    ? 'text-white/70 text-right'
                    : 'text-muted-foreground text-left'
                }`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Message Input */}
      <div className="shrink-0 bg-card p-4 border-t border-border space-y-3">
        {/* Quick Replies */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {quickReplies.map((reply, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="text-xs bg-border-dark hover:bg-border-dark/80 px-3 py-1.5 rounded-lg whitespace-nowrap"
              onClick={() => handleQuickReply(reply)}
              data-testid={`quick-reply-${index}`}
            >
              {reply}
            </Button>
          ))}
        </div>
        
        {/* Input Row */}
        <div className="flex items-center gap-2 h-10">
          <input 
            type="text" 
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-grow bg-muted h-full rounded-2xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-white"
            data-testid="input-message"
          />
          
          <Button 
            variant="ghost" 
            size="icon"
            className="w-7 h-7 bg-border-dark hover:bg-border-dark/80 rounded-lg"
            onClick={() => console.log('Attach photo')}
            data-testid="button-camera"
          >
            <Camera className="h-4 w-4 text-white" />
          </Button>
          
          <Button 
            size="icon"
            className="w-7 h-7 bg-primary hover:bg-primary/90 rounded-lg"
            onClick={handleSendMessage}
            data-testid="button-send"
          >
            <Send className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
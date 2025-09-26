import { Home, Calendar, DollarSign, User } from 'lucide-react';
import { Link, useLocation } from "wouter";

const navItems = [
  { icon: Home, label: 'Jobs', href: '/' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: DollarSign, label: 'Earnings', href: '/earnings' },
  { icon: User, label: 'Profile', href: '/profile' },
];

const BottomNavigation = () => {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-[414px] bg-[rgba(15,15,35,0.95)] border-t border-[rgba(255,255,255,0.1)] backdrop-blur-2xl z-50">
      <div className="flex justify-around items-center px-6 pt-4 pb-8">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link href={item.href} key={item.label} className="flex flex-col items-center gap-1 text-xs transition-colors duration-300">
              <div className={`p-2 rounded-lg ${isActive ? 'bg-[rgba(102,126,234,0.2)]' : ''}`}>
                <item.icon size={24} className={isActive ? 'text-purple' : 'text-text-secondary'} />
              </div>
              <span className={isActive ? 'text-purple font-semibold' : 'text-text-secondary'}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
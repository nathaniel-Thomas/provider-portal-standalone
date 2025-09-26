import { Link } from 'wouter';
import { userProfile } from '../utils/seedData';
import { ChevronRight, User, Calendar, CreditCard, Shield, HelpCircle, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  }

  const settings = [
    { icon: User, label: 'Personal Information', description: 'Update your personal details.', href: '/profile/personal-information' },
    { icon: Calendar, label: 'Availability', description: 'Set your working hours.', href: '#' },
    { icon: CreditCard, label: 'Banking & Payouts', description: 'Manage your bank accounts.', href: '/profile/banking-payouts' },
    { icon: Shield, label: 'Account Security', description: 'Manage your password.', href: '#' },
    { icon: HelpCircle, label: 'Help & Support', description: 'Get help and support.', href: '/profile/help-support' },
    { icon: LogOut, label: 'Logout', description: 'Sign out of your account.', href: '#' },
  ];

  return (
    <div className="content-area">
      {/* Profile Hero */}
      <div className="bg-[#1e293b] rounded-xl p-6 m-6 relative">
        <div className="absolute inset-0 bg-purple opacity-10 rounded-xl"></div>
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-purple flex items-center justify-center text-white font-bold text-2xl">
              {userProfile.avatarInitials}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{userProfile.name}</h1>
              <p className="text-sm text-text-secondary">{userProfile.title}</p>
            </div>
          </div>
          {userProfile.verified && (
            <div className="bg-[rgba(16,185,129,0.2)] border border-[rgba(16,185,129,0.3)] text-[#34d399] text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
              Verified
            </div>
          )}
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-white">{userProfile.jobsCompleted}</p>
              <p className="text-xs text-text-secondary">Jobs</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">{userProfile.rating}</p>
              <p className="text-xs text-text-secondary">Rating</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">{userProfile.memberSince}</p>
              <p className="text-xs text-text-secondary">Since</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">{formatCurrency(userProfile.monthlyEarnings)}</p>
              <p className="text-xs text-text-secondary">Earnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="px-6">
        <div className="glass-card rounded-xl">
          {settings.map((item, index) => (
            <Link href={item.href} key={item.label}>
              <a className={`flex items-center justify-between p-4 ${index < settings.length - 1 ? 'border-b border-card-border' : ''}`}>
                <div className="flex items-center gap-4">
                  <item.icon size={20} className="text-text-secondary" />
                  <div>
                    <p className="font-semibold text-white">{item.label}</p>
                    <p className="text-xs text-text-secondary">{item.description}</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-text-tertiary" />
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
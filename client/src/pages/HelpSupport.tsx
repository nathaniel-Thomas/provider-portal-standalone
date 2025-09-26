
import React from 'react';
import SettingsPage from '../components/SettingsPage';
import { Search, LifeBuoy, BookOpen, Shield, MessageSquare } from 'lucide-react';

const HelpSupport: React.FC = () => {

  const faqCategories = [
    { icon: BookOpen, label: 'Getting Started' },
    { icon: Shield, label: 'Account & Security' },
    { icon: LifeBuoy, label: 'Payments & Earnings' },
    { icon: MessageSquare, label: 'Using the App' },
  ];

  return (
    <SettingsPage title="Help & Support">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search for help..." 
            className="w-full bg-[rgba(255,255,255,0.05)] border border-card-border rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:ring-purple focus:border-purple"
          />
        </div>

        {/* FAQ Categories */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">FAQ Categories</h3>
          <div className="grid grid-cols-2 gap-4">
            {faqCategories.map(cat => (
              <div key={cat.label} className="bg-[rgba(255,255,255,0.05)] rounded-lg p-4 text-center hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer">
                <cat.icon size={24} className="mx-auto text-purple mb-2" />
                <p className="text-sm font-semibold text-white">{cat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="glass-card rounded-xl p-6 text-center">
          <h3 className="font-bold text-white mb-2">Need more help?</h3>
          <p className="text-sm text-text-secondary mb-4">Our support team is here for you 24/7.</p>
          <button className="w-full bg-purple text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow-purple-glow">
            Contact Support
          </button>
        </div>

      </div>
    </SettingsPage>
  );
};

export default HelpSupport;

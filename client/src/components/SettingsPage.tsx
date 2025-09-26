
import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

interface SettingsPageProps {
  title: string;
  children: React.ReactNode;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ title, children }) => {
  return (
    <div className="content-area">
      <header className="header-padding flex items-center gap-4">
        <Link href="/profile">
          <a className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-text-secondary hover:bg-[rgba(255,255,255,0.15)] transition-colors">
            <ArrowLeft size={20} />
          </a>
        </Link>
        <h1 className="text-xl font-bold text-white">{title}</h1>
      </header>
      <div className="px-6">
        {children}
      </div>
    </div>
  );
};

export default SettingsPage;

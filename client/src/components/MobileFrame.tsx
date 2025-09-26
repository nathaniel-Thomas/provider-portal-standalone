
import React from 'react';
import BottomNavigation from './BottomNavigation';

interface MobileFrameProps {
  children: React.ReactNode;
}

const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="max-w-[414px] mx-auto bg-background min-h-screen font-sans">
      <main className="pb-[120px]">{children}</main>
      <BottomNavigation />
    </div>
  );
};

export default MobileFrame;


interface HeaderProps {
  userName?: string;
  avatarInitials?: string;
}

const Header = ({ userName = 'Alex Farr', avatarInitials = 'AF' }: HeaderProps) => {
  return (
    <header className="relative header-padding">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-11 h-11 rounded-full bg-purple flex items-center justify-center text-white font-semibold text-base">
          {avatarInitials}
        </div>
        <div>
          <p className="text-sm text-text-secondary mb-1">Good morning,</p>
          <h1 className="text-lg font-bold text-text-primary">{userName}</h1>
        </div>
      </div>
      <div className="absolute top-[64px] right-[24px] w-2 h-2 bg-green rounded-full animate-pulse"></div>
    </header>
  );
};

export default Header;

import { useEffect, useRef } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onMyLocationClick: () => void;
  onFavoritesClick: () => void;
  onSettingsClick: () => void;
}

export default function MobileMenu({
  isOpen,
  onMyLocationClick,
  onFavoritesClick,
  onSettingsClick,
}: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuRef.current) {
      menuRef.current.style.maxHeight = isOpen ? '300px' : '0';
    }
  }, [isOpen]);

  return (
    <div 
      ref={menuRef}
      className="md:hidden bg-white shadow-md transition-all duration-300 overflow-hidden"
      style={{ maxHeight: 0 }}
    >
      <nav className="px-6 py-4 flex flex-col space-y-4">
        <button 
          className="flex items-center text-neutral-darkest py-2 border-b border-neutral-light"
          onClick={onMyLocationClick}
        >
          <span className="material-icons mr-2">my_location</span>
          <span>My Location</span>
        </button>
        <button 
          className="flex items-center text-neutral-darkest py-2 border-b border-neutral-light"
          onClick={onFavoritesClick}
        >
          <span className="material-icons mr-2">favorite</span>
          <span>Favorites</span>
        </button>
        <button 
          className="flex items-center text-neutral-darkest py-2 border-b border-neutral-light"
          onClick={onSettingsClick}
        >
          <span className="material-icons mr-2">settings</span>
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, BedDouble, UtensilsCrossed, Presentation, PartyPopper, Home, LogIn, Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BedDouble, label: 'Rooms', path: '/guest/rooms' },
    { icon: UtensilsCrossed, label: 'Dining', path: '/guest/restaurant' },
    { icon: Presentation, label: 'Conference', path: '/guest/conference' },
    { icon: PartyPopper, label: 'Events', path: '/guest/events' },
  ];

  return (
    <>
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-stone-100">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-amber-700 p-2 rounded-xl">
            <Hotel className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-stone-800 hidden sm:block">Grand Horizon</h1>
          <h1 className="text-xl font-bold text-stone-800 sm:hidden">GH</h1>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-stone-500 hover:text-amber-700 text-sm transition">
            <Home className="w-4 h-4" /> Home
          </button>
          <button onClick={() => navigate('/guest/rooms')} className="flex items-center gap-2 text-stone-500 hover:text-amber-700 text-sm transition">
            <BedDouble className="w-4 h-4" /> Rooms
          </button>
          <button onClick={() => navigate('/guest/restaurant')} className="flex items-center gap-2 text-stone-500 hover:text-amber-700 text-sm transition">
            <UtensilsCrossed className="w-4 h-4" /> Dining
          </button>
          <button onClick={() => navigate('/guest/conference')} className="flex items-center gap-2 text-stone-500 hover:text-amber-700 text-sm transition">
            <Presentation className="w-4 h-4" /> Conference
          </button>
          <button onClick={() => navigate('/guest/events')} className="flex items-center gap-2 text-stone-500 hover:text-amber-700 text-sm transition">
            <PartyPopper className="w-4 h-4" /> Events
          </button>
        </div>

        {/* Desktop Sign In */}
        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="flex items-center gap-2 px-5 py-2.5 bg-amber-700 text-white rounded-xl text-sm font-medium hover:bg-amber-800 transition shadow-lg shadow-amber-200">
            <LogIn className="w-4 h-4" /> Sign In
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button 
            onClick={() => navigate('/login')} 
            className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-xl text-sm font-medium hover:bg-amber-800 transition"
          >
            <LogIn className="w-4 h-4" />
          </button>
          <button 
            onClick={toggleMenu} 
            className="p-2 text-stone-600 hover:text-amber-700 transition"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div 
        className={`md:hidden fixed top-[73px] left-0 right-0 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-lg z-40 transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-[400px] opacity-100 visible' : 'max-h-0 opacity-0 invisible overflow-hidden'
        }`}
      >
        <div className="flex flex-col py-4 px-6">
          {navLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  navigate(link.path);
                  closeMenu();
                }}
                className="flex items-center gap-3 py-3 text-stone-600 hover:text-amber-700 hover:bg-amber-50 px-4 rounded-xl transition text-sm font-medium border-b border-stone-50 last:border-0"
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;
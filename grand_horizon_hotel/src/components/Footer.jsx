import { Hotel } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12 px-8 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Hotel className="w-5 h-5 text-amber-500" />
        <span className="text-white font-bold text-lg">Grand Horizon Hotel</span>
      </div>
      <p className="text-sm">© 2026 Grand Horizon Hotel. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
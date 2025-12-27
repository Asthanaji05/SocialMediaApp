import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-gray-500 text-sm font-sans">
          © {new Date().getFullYear()} Moscownpur Circles. All rights reserved.
        </div>

        <div className="flex gap-8 text-sm font-medium">
          <Link to="/lexicon" className="text-gray-400 hover:text-[var(--primary-color)] transition-colors">
            The Lexicon
          </Link>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
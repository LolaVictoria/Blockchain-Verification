import { Menu, Shield, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-blue-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              VerifyChain
            </span>
          </button>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/">
              <button 
                className={`transition-colors ${location.pathname === '/' ? 'text-blue-400' : 'text-slate-300 hover:text-blue-400'}`}
              >
                Home
              </button>
            </Link>
            <Link to="/how-it-works">
              <button
                className={`transition-colors ${location.pathname === '/how-it-works' ? 'text-blue-400' : 'text-slate-300 hover:text-blue-400'}`}
              >
                How It Works
              </button>
            </Link>
            <Link to="/about">
              <button 
                className={`transition-colors ${location.pathname === '/about' ? 'text-blue-400' : 'text-slate-300 hover:text-blue-400'}`}
              >
                About
              </button>
            </Link>
            <Link to="/contact">
              <button 
                className={`transition-colors ${location.pathname === '/contact' ? 'text-blue-400' : 'text-slate-300 hover:text-blue-400'}`}
              >
                Contact
              </button>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <button 
                  className="text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-slate-800/50"
                >
                  Sign In
                </button>
              </Link>
              <Link to="/signup">
                <button 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105"
                >
                  Sign Up
                </button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800/95 backdrop-blur-md rounded-lg mt-2 p-4 space-y-3">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <button className="block w-full text-left text-slate-300 hover:text-blue-400 transition-colors py-2">
                Home
              </button>
            </Link>
            <Link to="/how-it-works" onClick={() => setIsMenuOpen(false)}>
              <button className="block w-full text-left text-slate-300 hover:text-blue-400 transition-colors py-2">
                How It Works
              </button>
            </Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>
              <button className="block w-full text-left text-slate-300 hover:text-blue-400 transition-colors py-2">
                About
              </button>
            </Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
              <button className="block w-full text-left text-slate-300 hover:text-blue-400 transition-colors py-2">
                Contact
              </button>
            </Link>
            <div className="pt-4 border-t border-slate-700 space-y-3">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full text-left text-slate-300 hover:text-white transition-colors py-2">
                  Sign In
                </button>
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
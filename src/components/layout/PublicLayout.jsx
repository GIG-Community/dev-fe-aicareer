import React from 'react';
import { Link } from 'react-router-dom';
import { Globe2, Menu, X } from 'lucide-react';

const PublicLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Globe2 className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-800">AI Career</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-slate-600 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link to="/features" className="text-slate-600 hover:text-blue-600 transition-colors">
                Features
              </Link>
              <Link to="/pricing" className="text-slate-600 hover:text-blue-600 transition-colors">
                Pricing
              </Link>
              <Link to="/about" className="text-slate-600 hover:text-blue-600 transition-colors">
                About
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <div className="flex flex-col space-y-4">
                <Link to="/" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <Link to="/features" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Features
                </Link>
                <Link to="/pricing" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Pricing
                </Link>
                <Link to="/about" className="text-slate-600 hover:text-blue-600 transition-colors">
                  About
                </Link>
                <div className="flex flex-col space-y-2 pt-4 border-t border-slate-200">
                  <Link
                    to="/login"
                    className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Globe2 className="w-8 h-8 text-blue-400" />
                <span className="text-xl font-bold">AI Career</span>
              </div>
              <p className="text-slate-300 mb-4">
                Platform AI-powered untuk mengembangkan kemampuan dan mempercepat pertumbuhan karir digital Anda.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-slate-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/features" className="text-slate-300 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/about" className="text-slate-300 hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-slate-300 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="text-slate-300 hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="text-slate-300 hover:text-white transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="text-slate-300 hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-slate-400">© 2024 AI Career. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;

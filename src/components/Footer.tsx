import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-security-blue rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">VeriTrace</span>
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              Securing product authenticity through blockchain technology. 
              Protecting consumers and brands from counterfeit products.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
            <div className="space-y-2">
              <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900 block">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900 block">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="text-sm text-gray-600 hover:text-gray-900 block">
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Connect</h3>
            <div className="space-y-2">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 block">
                LinkedIn
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 block">
                Twitter
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 block">
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © 2024 VeriTrace. All rights reserved. Built with blockchain security.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

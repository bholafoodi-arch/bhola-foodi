import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UtensilsCrossed, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  ArrowUpRight 
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="main-footer" className="bg-gray-900 text-gray-300">
      
      {/* Upper Area */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 sm:grid-cols-2">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Bhola <span className="text-orange-500">Online</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Serving the authentic taste of Bhola directly to your doorstep. Fresh rice, royal biryani, local legendary sweets, and fast food from top chefs.
            </p>
            {/* Social handles */}
            <div className="flex items-center gap-3 mt-2">
              <a href="#" className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-orange-500 hover:text-white transition-all text-gray-400">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-orange-500 hover:text-white transition-all text-gray-400">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-orange-500 hover:text-white transition-all text-gray-400">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-orange-500 hover:text-white transition-all text-gray-400">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-orange-500 pl-2">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-orange-400 transition-colors flex items-center gap-1 group">
                  Home <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-orange-400 transition-colors flex items-center gap-1 group">
                  Order Food <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-400 transition-colors flex items-center gap-1 group">
                  About Us <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition-colors flex items-center gap-1 group">
                  Contact <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Categories */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-orange-500 pl-2">Food Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop?category=biryani" className="hover:text-orange-400 transition-colors">Biryani & Dum Pulao</Link>
              </li>
              <li>
                <Link to="/shop?category=sweets" className="hover:text-orange-400 transition-colors">Bhola Famous Sweets</Link>
              </li>
              <li>
                <Link to="/shop?category=fastfood" className="hover:text-orange-400 transition-colors">Burgers & Loaded Pizza</Link>
              </li>
              <li>
                <Link to="/shop?category=rice-curry" className="hover:text-orange-400 transition-colors">Traditional Bengali Meals</Link>
              </li>
            </ul>
          </div>

          {/* Address & Contact Info */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-orange-500 pl-2">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  Level 3, Karim Mansion, Sadar Road, Bhola Sadar, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-500 shrink-0" />
                <span className="text-gray-400">+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-500 shrink-0" />
                <span className="text-gray-400">info@bholaonline.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-800" />

        {/* Bottom Panel */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} Bhola Online Delivery. All rights reserved.
          </div>
          
          {/* Payment Badges */}
          <div className="flex items-center gap-2 text-gray-400">
            <span className="mr-2">We Accept:</span>
            <span className="bg-gray-800 px-2 py-1 rounded font-bold text-orange-400 tracking-tight">bKash</span>
            <span className="bg-gray-800 px-2 py-1 rounded font-bold text-red-400 tracking-tight">Nagad</span>
            <span className="bg-gray-800 px-2 py-1 rounded font-bold text-emerald-400 tracking-tight">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

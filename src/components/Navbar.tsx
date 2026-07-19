import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Search, 
  LogOut, 
  ChevronDown, 
  UtensilsCrossed,
  Heart
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, logout, getCartCount, setCartDrawerOpen, wishlist } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!userDropdownOpen) return;
    const handleClose = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#user-menu-btn') && !target.closest('#user-dropdown-menu')) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClose);
    return () => document.removeEventListener('click', handleClose);
  }, [userDropdownOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header id="main-header" className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Logo */}
          <Link id="nav-logo-link" to="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
            <div className="flex h-8.5 w-8.5 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-orange-600 text-white group-hover:bg-orange-700 transition-colors shadow-xs">
              <UtensilsCrossed className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-lg font-black tracking-tight text-gray-900 leading-tight">
                Bhola<span className="text-orange-600">Online</span>
              </span>
              <span className="hidden sm:inline text-[9px] font-extrabold text-gray-400 -mt-1 tracking-widest uppercase">Local Delivery</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden md:flex items-center gap-6">
            <Link 
              id="nav-home" 
              to="/" 
              className={`text-xs font-extrabold uppercase tracking-wider transition-colors ${isActive('/') ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
            >
              Home
            </Link>
            <Link 
              id="nav-shop" 
              to="/shop" 
              className={`text-xs font-extrabold uppercase tracking-wider transition-colors ${isActive('/shop') ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
            >
              Order Food
            </Link>
            <Link 
              id="nav-about" 
              to="/about" 
              className={`text-xs font-extrabold uppercase tracking-wider transition-colors ${isActive('/about') ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
            >
              About Us
            </Link>
            <Link 
              id="nav-contact" 
              to="/contact" 
              className={`text-xs font-extrabold uppercase tracking-wider transition-colors ${isActive('/contact') ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
            >
              Contact
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <form id="desktop-search-form" onSubmit={handleSearchSubmit} className="hidden lg:flex relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search local dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-[#F9FAFB] py-1.5 pl-4 pr-10 text-xs font-medium text-gray-900 focus:border-orange-500 focus:outline-none"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-orange-600 cursor-pointer">
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* User Controls & Cart */}
          <div id="nav-controls" className="flex items-center gap-1 sm:gap-3 md:gap-4">
            
            {/* Search Toggle for Tablet/Mobile */}
            <button 
              onClick={() => navigate('/shop')} 
              className="lg:hidden text-gray-600 hover:text-orange-600 p-1.5 sm:p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              title="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist Link */}
            <Link 
              to="/dashboard?tab=wishlist" 
              className="relative p-1.5 sm:p-2 text-gray-600 hover:text-red-500 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
              title="My Wishlist (পছন্দের তালিকা)"
            >
              <Heart className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-500 text-[8px] sm:text-[9px] font-black text-white ring-2 ring-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <button 
              id="nav-cart-btn" 
              onClick={() => setCartDrawerOpen(true)} 
              className="relative p-1.5 sm:p-2 text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer focus:outline-none"
              title="Shopping Cart Drawer"
            >
              <ShoppingBag className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
              {getCartCount() > 0 && (
                <span id="cart-badge" className="absolute -top-1 -right-1 flex h-4.5 w-4.5 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-orange-600 text-[8px] sm:text-[9px] font-black text-white ring-2 ring-white animate-pulse">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* User Profile Dropdown / Sign In */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1 sm:gap-1.5 focus:outline-none hover:text-orange-600 py-0.5 px-1 sm:py-1 sm:px-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-orange-50 text-orange-700 font-extrabold text-[10px] sm:text-xs uppercase border border-orange-100">
                    {(currentUser.name || currentUser.email || 'U').charAt(0)}
                  </div>
                  <span className="hidden sm:inline text-xs font-extrabold text-gray-700 truncate max-w-[90px]">
                    {(currentUser.name || currentUser.email || 'User').split(' ')[0]}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>

                {userDropdownOpen && (
                  <div id="user-dropdown-menu" className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl bg-white p-1 shadow-lg ring-1 ring-black/5 border border-gray-100 focus:outline-none z-50">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      My Dashboard
                    </Link>
                    <Link
                      to="/dashboard?tab=orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      Track Orders
                    </Link>
                    <hr className="my-1 border-gray-50" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-left text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-3">
                <Link
                  id="nav-signin"
                  to="/signin"
                  className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-gray-700 hover:text-orange-600 transition-colors px-1 sm:px-0"
                >
                  Sign In
                </Link>
                <Link
                  id="nav-signup"
                  to="/signup"
                  className="rounded-full bg-orange-600 px-3 py-1.5 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-white shadow-xs hover:bg-orange-700 hover:shadow transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5.5 w-5.5 sm:h-6 sm:w-6" /> : <Menu className="h-5.5 w-5.5 sm:h-6 sm:w-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-drawer" className="md:hidden bg-white border-b border-gray-200 py-4 px-4 shadow-inner">
          <form id="mobile-search-form" onSubmit={handleSearchSubmit} className="relative mb-4">
            <input
              type="text"
              placeholder="Search local dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-2 pl-4 pr-10 text-xs font-medium text-gray-900 focus:border-orange-500 focus:outline-none"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-orange-600">
              <Search className="h-4.5 w-4.5" />
            </button>
          </form>

          <div className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors ${isActive('/') ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors ${isActive('/shop') ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Order Food
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors ${isActive('/about') ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors ${isActive('/contact') ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Contact
            </Link>

            {currentUser ? (
              <div className="flex flex-col gap-1 pt-2 border-t border-gray-100 mt-2">
                <div className="px-3 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Logged in as: <span className="text-orange-600 font-extrabold">{currentUser.name || currentUser.email || 'User'}</span>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-extrabold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  My Dashboard
                </Link>
                <Link
                  to="/dashboard?tab=orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-extrabold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Track Orders
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 mt-2">
                <Link
                  to="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-gray-200 py-2.5 text-xs font-black uppercase tracking-wider text-gray-700 hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-orange-600 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-xs hover:bg-orange-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

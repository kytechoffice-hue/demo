'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLang, Language } from '@/context/LangContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  ShoppingCart, 
  Heart, 
  Search, 
  User, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  Sparkles,
  LayoutDashboard,
  HelpCircle
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLang();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/product?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLangChange = (selectedLang: Language) => {
    setLang(selectedLang);
    setLangDropdownOpen(false);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { label: t('navHome'), path: '/' },
    { label: t('navShop'), path: '/product' },
    { label: t('navAbout'), path: '/about' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'glass shadow-md py-2' 
        : 'bg-white/90 dark:bg-slate-900/90 py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg">
              <Image 
                src="/logo-icon.png" 
                alt="KY Logo" 
                fill 
                className="object-contain"
                sizes="40px"
                priority
              />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary-blue-500 to-accent-orange-500 bg-clip-text text-transparent hidden sm:block">
              {t('logoText')}
            </span>
          </Link>

          {/* Search Bar Section */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg hidden md:block">
            <div className="relative group">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-20 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-blue-500/50 dark:focus:ring-primary-blue-500 transition-all duration-200"
              />
              <Search className="absolute left-3.5 top-2.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
              
              <button 
                type="submit" 
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-primary-blue-500 hover:bg-primary-blue-600 text-white rounded-full text-xs font-semibold flex items-center gap-1 transition-colors duration-150"
              >
                <Sparkles className="h-3 w-3 text-orange-300" />
                {t('searchBtn')}
              </button>
            </div>
          </form>

          {/* Nav Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-blue-500 dark:hover:text-primary-blue-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {user?.role === 'admin' && (
              <Link 
                href="/admin" 
                className="text-sm font-semibold text-accent-orange-500 dark:text-accent-orange-500 hover:text-accent-orange-600 flex items-center gap-1 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                {t('adminPanel')}
              </Link>
            )}
          </nav>

          {/* Action Icons Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <span className="uppercase">{lang}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 py-1 z-50">
                  <button onClick={() => handleLangChange('en')} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 font-medium">English</button>
                  <button onClick={() => handleLangChange('hi')} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 font-medium">हिंदी (Hindi)</button>
                  <button onClick={() => handleLangChange('es')} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 font-medium">Español</button>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link 
              href={user ? "/dashboard?tab=wishlist" : "/login"} 
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              <Heart className="h-5 w-5" />
              {user && user.wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-orange-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-between text-center pl-1.5 pr-1.5 shadow-sm">
                  {user.wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link 
              href="/cart" 
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-blue-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-between text-center pl-1.5 pr-1.5 shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            <div className="relative">
              {user ? (
                <>
                  <button 
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-primary-blue-500 to-accent-orange-500 text-white flex items-center justify-center text-xs font-bold uppercase">
                      {user.name.charAt(0)}
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 py-1 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Logged in as</p>
                        <p className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">{user.name}</p>
                      </div>
                      
                      <Link 
                        href="/dashboard" 
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <User className="h-4 w-4" />
                        {t('navDashboard')}
                      </Link>

                      {user.role === 'admin' && (
                        <Link 
                          href="/admin" 
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-accent-orange-500 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          {t('adminPanel')}
                        </Link>
                      )}

                      <button 
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          router.push('/');
                        }} 
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700 border-t border-slate-100 dark:border-slate-700"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="flex items-center gap-1 px-4 py-1.5 rounded-full border border-primary-blue-500 text-primary-blue-500 hover:bg-primary-blue-50 dark:hover:bg-primary-blue-950/20 text-sm font-semibold transition-colors duration-150"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Open Trigger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Search - Visible under logo on small screens */}
      <div className="px-4 py-2 md:hidden">
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-16 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-blue-500/50 dark:focus:ring-primary-blue-500 text-sm"
            />
            <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-slate-400" />
            <button 
              type="submit" 
              className="absolute right-1 top-1 bottom-1 px-3 bg-primary-blue-500 hover:bg-primary-blue-600 text-white rounded-full text-xs font-semibold flex items-center"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 shadow-lg animate-fadeIn">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary-blue-500"
              >
                {link.label}
              </Link>
            ))}
            
            {user?.role === 'admin' && (
              <Link 
                href="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-semibold text-accent-orange-500 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <LayoutDashboard className="h-5 w-5" />
                {t('adminPanel')}
              </Link>
            )}

            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <User className="h-5 w-5" />
                  {t('navDashboard')}
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    router.push('/');
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-slate-100 dark:border-slate-800 mt-2"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-base font-semibold bg-primary-blue-500 hover:bg-primary-blue-600 text-white mt-2"
              >
                <User className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

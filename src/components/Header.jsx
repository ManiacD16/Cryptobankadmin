import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Zap, Shield, TrendingUp } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    // { 
    //   to: '/', 
    //   label: 'Dashboard', 
    //   icon: <TrendingUp className="w-4 h-4" />,
    //   description: 'Overview & Analytics'
    // },
    // { 
    //   to: '/payment', 
    //   label: 'Payment Interface', 
    //   icon: <Zap className="w-4 h-4" />,
    //   description: 'Process Transactions'
    // },
    { 
      to: '/admin', 
      label: 'Admin Panel', 
      icon: <Shield className="w-4 h-4" />,
      description: 'System Management'
    }
  ];

  return (
    <header className="relative bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 backdrop-blur-lg border-b border-slate-200/50">
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-indigo-100/30 to-purple-100/30 animate-pulse"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105">
                <Zap className="w-6 h-6 md:w-7 md:h-7 text-white animate-pulse" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Crypto Payment Gateway
              </h1>
              <span className="text-xs text-slate-500 font-medium tracking-wider">
                SECURE PAYMENTS
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                 key={item.to}
                to={item.to}
                className="group relative px-4 py-2 rounded-xl text-slate-600 hover:text-slate-800 transition-all duration-300 hover:bg-slate-100/70 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500 group-hover:text-blue-600 transition-colors duration-300">
                    {item.icon}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors duration-300">
                      {item.description}
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-100/50 to-indigo-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100/70 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="w-6 h-6 relative">
                <Menu 
                  className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
                  }`} 
                />
                <X 
                  className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
                  }`} 
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-96 opacity-100 translate-y-0' 
            : 'max-h-0 opacity-0 -translate-y-4'
        } overflow-hidden`}>
          <nav className="py-4 space-y-2">
            {navItems.map((item, index) => (
              <Link
                 key={item.to}
                to={item.to}
                className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:text-slate-800 transition-all duration-300 hover:bg-slate-100/70 backdrop-blur-sm transform ${
                  isMenuOpen 
                    ? 'translate-x-0 opacity-100' 
                    : 'translate-x-4 opacity-0'
                }`}
                style={{
                  transitionDelay: isMenuOpen ? `${index * 100}ms` : '0ms'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100/60 to-indigo-100/60 rounded-lg flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-blue-200/60 group-hover:to-indigo-200/60 transition-all duration-300">
                  <span className="text-blue-500 group-hover:text-blue-600 transition-colors duration-300">
                    {item.icon}
                  </span>
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-base font-medium">{item.label}</span>
                  <span className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-300">
                    {item.description}
                  </span>
                </div>
                <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom border gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
    </header>
  );
};

export default Header;
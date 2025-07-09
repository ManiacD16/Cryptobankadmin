import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, Shield, User, LogOut, KeyRound } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api/v1/auth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changePwdLoading, setChangePwdLoading] = useState(false);
  const [changePwdMsg, setChangePwdMsg] = useState('');
  const [changePwdErr, setChangePwdErr] = useState('');
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Profile dropdown click-outside logic
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        // setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isProfileOpen]);

  // Logout logic
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      // setIsProfileOpen(false);
      navigate('/');
    } catch (err) {
      alert('Logout failed!');
    }
  };

  // Change password logic
  const handleChangePassword = async (e) => {
  e.preventDefault();
  setChangePwdLoading(true);
  setChangePwdErr('');
  setChangePwdMsg('');
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/change-password`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setChangePwdErr(data.message || 'Failed to change password');
    } else {
      setChangePwdMsg('Password changed successfully! Logging out...');
      setCurrentPassword('');
      setNewPassword('');
      // Auto logout after 1.2s
      setTimeout(async () => {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          credentials: 'include',
        });
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setShowChangePassword(false);
        navigate('/');
      }, 1200);
    }
  } catch {
    setChangePwdErr('Network error');
  } finally {
    setChangePwdLoading(false);
  }
};


  const navItems = [
    {
      to: '/admin',
      label: 'Admin Panel',
      icon: <Shield className="w-4 h-4" />,
      description: 'System Management'
    }
  ];

  return (
    <header className="relative bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 backdrop-blur-lg border-b border-slate-200/50 z-50">
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
            {/* Profile Section (Always Visible) */}
            <div className="relative ml-3" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen((v) => !v)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white shadow-md hover:bg-slate-100 transition-all duration-200"
              >
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-slate-700">Profile</span>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                  <button
  className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center space-x-2"
  onClick={() => {
    setIsProfileOpen(false);
    setTimeout(() => setShowChangePassword(true), 100);
  }}
>
  <KeyRound className="w-4 h-4 text-blue-600" />
  <span>Change Password</span>
</button>
                  <button
  className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center space-x-2 text-red-600"
  onClick={() => {
    // setIsProfileOpen(false);
    setTimeout(handleLogout, 100);
  }}
>
  <LogOut className="w-4 h-4" />
  <span>Logout</span>
</button>

                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            {/* Profile for mobile (Always Visible) */}
            <div className="relative mr-3" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen((v) => !v)}
                className="flex items-center space-x-1 px-2 py-2 rounded-xl bg-white shadow-md hover:bg-slate-100 transition-all duration-200"
              >
                <User className="w-5 h-5 text-blue-600" />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-100">
                  <button
  className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center space-x-2"
  onClick={() => {
    setIsProfileOpen(false);
    setTimeout(() => setShowChangePassword(true), 100);
  }}
>
  <KeyRound className="w-4 h-4 text-blue-600" />
  <span>Change Password</span>
</button>

                  <button
  className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center space-x-2 text-red-600"
  onClick={() => {
    // setIsProfileOpen(false);
    setTimeout(handleLogout, 100);
  }}
>
  <LogOut className="w-4 h-4" />
  <span>Logout</span>
</button>

                </div>
              )}
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="absolute min-h-screen w-full z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowChangePassword(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {changePwdErr && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded">{changePwdErr}</div>
              )}
              {changePwdMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-2 rounded">{changePwdMsg}</div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700"
                disabled={changePwdLoading}
              >
                {changePwdLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom border gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
    </header>
  );
};

export default Header;

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Bell, 
  LogOut, 
  User, 
  Menu, 
  X, 
  Smartphone, 
  Check, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import InstallAppModal from './InstallAppModal';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = (notif) => {
    if (!notif.is_read) {
      markAsRead(notif.id);
    }
    setShowNotifs(false);
    if (user.role === 'admin') {
      navigate(`/admin/issues/${notif.issue_id}`);
    } else {
      navigate(`/student/issues/${notif.issue_id}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Brand & Mobile Toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Toggle Navigation"
              >
                <Menu size={22} />
              </button>

              <Link 
                to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-800 text-white flex items-center justify-center shadow-md shadow-blue-800/20 group-hover:scale-105 transition-transform">
                  <GraduationCap size={24} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base tracking-tight text-slate-900">
                      UniSolve
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      user?.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {user?.role === 'admin' ? 'Admin Portal' : 'Student Portal'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 hidden sm:block">
                    Issue & Requirement Management System
                  </p>
                </div>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">

              {/* Install on Mobile App Button */}
              <button
                type="button"
                onClick={() => setShowInstallModal(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-xs"
                title="Install or build APK for mobile"
              >
                <Smartphone size={15} />
                <span>Mobile App / APK</span>
              </button>

              {/* Notifications Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-[11px] bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                          <Check size={14} />
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.slice(0, 6).map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleNotificationClick(item)}
                            className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors text-left flex items-start gap-2.5 ${
                              !item.is_read ? 'bg-blue-50/40' : ''
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!item.is_read ? 'bg-blue-600' : 'bg-transparent'}`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs ${!item.is_read ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                                {item.message}
                              </p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(item.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="px-4 py-2 border-t border-slate-100 text-center bg-slate-50/50 rounded-b-2xl">
                      <Link
                        to="/notifications"
                        onClick={() => setShowNotifs(false)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        View All Notifications →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User Pill & Profile */}
              {user && (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <Link
                    to={user.role === 'admin' ? '/admin/profile' : '/student/profile'}
                    className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                      user.role === 'admin' ? 'bg-purple-700' : 'bg-blue-700'
                    }`}>
                      {user.name.charAt(0)}
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {user.id}
                      </div>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </header>

      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </>
  );
}

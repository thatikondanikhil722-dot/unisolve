import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  ShieldCheck, 
  User, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Smartphone,
  CheckCircle,
  Sparkles,
  Settings,
  Wifi,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import InstallAppModal from '../components/InstallAppModal';
import { getApiBase } from '../utils/api';

export default function Login() {
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'admin'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showServerModal, setShowServerModal] = useState(false);
  const [customServerUrl, setCustomServerUrl] = useState(
    localStorage.getItem('uni_custom_server_url') || 'http://192.168.1.35:5000'
  );

  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (role) => {
    setActiveTab(role);
    setError('');
    setUsername('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(username.trim(), password, activeTab);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role, demoUser, demoPass) => {
    setError('');
    setLoading(true);
    try {
      const user = await quickLogin(demoUser, demoPass, role);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const saveServerUrl = () => {
    if (customServerUrl.trim()) {
      localStorage.setItem('uni_custom_server_url', customServerUrl.trim());
    } else {
      localStorage.removeItem('uni_custom_server_url');
    }
    setShowServerModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative ambient background */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight">UniSolve</h1>
            <p className="text-xs text-blue-200/80">University Student Issue Management</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowServerModal(true)}
            className="p-2 rounded-lg text-xs font-semibold text-blue-200 bg-blue-900/50 hover:bg-blue-800/60 border border-blue-700/50 transition-colors"
            title="Configure Server Connection"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={() => setShowInstallModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-200 bg-blue-900/50 hover:bg-blue-800/60 border border-blue-700/50 transition-colors"
          >
            <Smartphone size={14} />
            <span className="hidden sm:inline">Mobile App</span>
          </button>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto z-10 my-6">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100/10 p-6 sm:p-8 backdrop-blur-xl">
          
          {/* Role Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 mb-6">
            <button
              type="button"
              onClick={() => handleTabChange('student')}
              className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === 'student'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <User size={16} />
              <span>Student Portal</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === 'admin'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldCheck size={16} />
              <span>Admin Portal</span>
            </button>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              {activeTab === 'student' ? 'Student Sign In' : 'Administrator Sign In'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === 'student'
                ? 'Enter your Student ID and password to access your portal'
                : 'Enter your administrator credentials to manage student issues'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 animate-shake">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {activeTab === 'student' ? 'Student ID / Username' : 'Admin ID / Username'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={activeTab === 'student' ? 'e.g. student1 or STU-2024-001' : 'e.g. admin or ADM-2024-001'}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                activeTab === 'student'
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                  : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30'
              } disabled:opacity-50`}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* One-Click Quick Logins */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              <Sparkles size={14} className="text-amber-500" />
              <span>One-Click Quick Login</span>
            </div>

            {activeTab === 'student' ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('student', 'student1', 'student123')}
                  className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 flex items-center justify-between text-left transition-colors group"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                      Rahul Kumar (CS, Year 3)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      STU-2024-001 • Has active tickets
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-600 bg-blue-100/60 px-2.5 py-1 rounded-lg">
                    Log In
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('student', 'student2', 'student123')}
                  className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 flex items-center justify-between text-left transition-colors group"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                      Priya Sharma (EE, Year 2)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      STU-2024-002 • Classroom issue
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-600 bg-blue-100/60 px-2.5 py-1 rounded-lg">
                    Log In
                  </span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleDemoLogin('admin', 'admin', 'admin123')}
                className="w-full p-2.5 rounded-xl border border-purple-200 hover:border-purple-400 hover:bg-purple-50/50 flex items-center justify-between text-left transition-colors group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                    Dr. Sarah Jenkins (Dean)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    ADM-2024-001 • Full Administration
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-lg">
                  Log In
                </span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto text-center text-xs text-slate-400 z-10">
        <p>© 2026 UniSolve. All rights reserved.</p>
        <p className="text-[11px] text-slate-500 mt-1">Centralized University Student Issue & Requirement Management Portal</p>
      </div>

      {/* Server Settings Modal */}
      {showServerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 relative">
            <button
              onClick={() => setShowServerModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
            
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Wifi size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Backend Server Connection</h3>
                <p className="text-[11px] text-slate-500">Configure connection to your server</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Server URL</label>
                <input
                  type="text"
                  value={customServerUrl}
                  onChange={(e) => setCustomServerUrl(e.target.value)}
                  placeholder="e.g. http://192.168.1.35:5000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  Standalone & Cloud Ready
                </p>
                <p>
                  If your computer server is not reachable, UniSolve automatically runs with full local data so you can test all features offline anywhere!
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowServerModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveServerUrl}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save URL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
}

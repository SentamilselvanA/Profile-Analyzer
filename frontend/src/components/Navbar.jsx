import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { CodeBracketIcon, UserIcon, ArrowRightOnRectangleIcon, Bars3Icon } from '@heroicons/react/24/outline';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const isDashboardPage = ['/dashboard', '/connect', '/analysis', '/goals', '/settings'].includes(location.pathname);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            {isDashboardPage && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 mr-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200"
                aria-label="Open menu"
              >
                <Bars3Icon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            )}

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg group-hover:scale-105 transition-transform duration-200">
                <CodeBracketIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                CodeNova
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {token ? (
              <>
                {/* <Link
                  to="/dashboard"
                  className="text-slate-300 hover:text-cyan-300 font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/connect"
                  className="text-slate-300 hover:text-cyan-300 font-medium transition-colors duration-200"
                >
                  Connect
                </Link> */}
              </>
            ) : (
              !isAuthPage && (
                <>
                  <Link
                    to="/login"
                    className="text-slate-300 hover:text-cyan-300 font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-slate-300 hover:text-cyan-300 font-medium transition-colors duration-200"
                  >
                    Signup
                  </Link>
                </>
              )
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {token && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
                <button
                  onClick={logout}
                  className="hidden sm:flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors duration-200"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  LinkIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CalendarDaysIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  AcademicCapIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: HomeIcon
    },
    {
      name: 'Connect Profiles',
      path: '/connect',
      icon: LinkIcon
    },
    {
      name: 'Analysis',
      path: '/analysis',
      icon: ChartBarIcon
    },
    {
      name: 'Goals',
      path: '/goals',
      icon: CalendarDaysIcon
    },
    {
      name: 'History',
      path: '/history',
      icon: ArrowTrendingUpIcon
    },
    {
      name: 'Comparison',
      path: '/compare',
      icon: UsersIcon
    },
    {
      name: 'Topic Analysis',
      path: '/topics',
      icon: AcademicCapIcon
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: DocumentChartBarIcon
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Cog6ToothIcon
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 transform bg-slate-900/50 backdrop-blur-md border-r border-white/10 transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header with close button */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
            <h2 className="text-sm font-bold text-slate-100">Menu</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm transition-colors duration-200"
              aria-label="Close menu"
            >
              <XMarkIcon className="w-5 h-5 text-slate-300" />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-all duration-200 group
                    ${isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border-r-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }
                  `}
                >
                  <Icon className={`
                    w-5 h-5 mr-3 transition-colors duration-200
                    ${isActive
                      ? 'text-cyan-400'
                      : 'text-slate-500 group-hover:text-slate-300'
                    }
                  `} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 mb-6">
            <div className="p-4 bg-slate-800/30 backdrop-blur-sm rounded-lg border border-white/5">
              <p className="text-xs text-slate-400 text-center hover:text-cyan-300 transition-colors duration-200 cursor-pointer">
                CodeNova v1.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
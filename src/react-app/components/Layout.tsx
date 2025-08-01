import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { Calculator, TrendingUp, Target, PieChart, Calendar, BarChart3, Repeat } from 'lucide-react';
import clsx from 'clsx';

interface LayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { path: '/', label: 'SIP Calculator', icon: Calculator },
  { path: '/lumpsum', label: 'Lumpsum Calculator', icon: TrendingUp },
  { path: '/goal-planner', label: 'Goal Planner', icon: Target },
  { path: '/mutual-funds', label: 'Fund Explorer', icon: PieChart },
  { path: '/retirement', label: 'Retirement Planner', icon: Calendar },
  { path: '/fd-vs-sip', label: 'FD vs SIP', icon: BarChart3 },
  { path: '/compounding', label: 'Compounding Power', icon: Repeat },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                FinVista
              </h1>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <p className="text-slate-600 font-medium">
                Smart Investment Planning & Wealth Building Tools
              </p>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-white/90 backdrop-blur-lg rounded-2xl border border-slate-200/40 p-5 shadow-xl">
              <div className="flex items-center space-x-2 mb-5">
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full"></div>
                <h2 className="text-lg font-semibold text-slate-800">Financial Tools</h2>
              </div>
              <ul className="space-y-1.5">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={clsx(
                          'group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02]',
                          isActive
                            ? 'bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 text-white shadow-lg shadow-emerald-500/25'
                            : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-100 hover:to-blue-50 hover:text-slate-900 hover:shadow-md'
                        )}
                      >
                        <Icon className={clsx(
                          'w-5 h-5 transition-transform duration-300',
                          isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'
                        )} />
                        <span className="font-medium text-sm">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

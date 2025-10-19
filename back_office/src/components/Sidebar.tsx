import { cn } from '@/lib/utils';
import {
  ChevronRight,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  MonitorSpeaker
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Questions', href: '/admin/questions', icon: HelpCircle },
  { name: 'Responses', href: '/admin/responses', icon: MessageSquare },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700 px-6 pb-4">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center">
          <Link to="/admin/dashboard" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:shadow-xl transition-shadow">
              <MonitorSpeaker className="h-6 w-6 text-white" />
            </div>
<div className="flex flex-col items-center">
  <img
    src="/images/bigscreen_logo.svg"
    alt="Bigscreen Logo"
    className="mx-auto mt-2 w-28 sm:w-32 md:w-36 h-auto py-2 brightness-0 object-contain"
  />
  <p className="text-sm text-slate-600 dark:text-slate-400">
    Admin Panel
  </p>
</div>

          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          'group flex gap-x-3 rounded-xl p-3 text-sm font-medium leading-6 transition-all hover:bg-slate-100 dark:hover:bg-slate-800',
                          isActive
                            ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'h-5 w-5 shrink-0 transition-colors',
                            isActive
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                          )}
                        />
                        {item.name}
                        {isActive && (
                          <ChevronRight className="ml-auto h-4 w-4 text-blue-500" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">BS</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Survey Admin
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  v1.0.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
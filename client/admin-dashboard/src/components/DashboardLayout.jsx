import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { isLoggedIn, logout } from '../api/client.js';

const navItems = [
  { to: '/', label: 'Overview', icon: '◐' },
  { to: '/routes', label: 'Routes & Stops', icon: '⌁' },
  { to: '/fleet', label: 'Fleet', icon: '▭' },
  { to: '/trips', label: 'Trips & Drivers', icon: '▸' },
];

export default function DashboardLayout() {
  const navigate = useNavigate();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-paper">
      <aside className="w-60 bg-sidebar text-paper flex flex-col shrink-0">
        <div className="px-6 py-6">
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-transit">
            City Transit
          </p>
          <h1 className="font-display text-xl mt-0.5">Admin Console</h1>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition-colors ${
                  isActive
                    ? 'bg-white/10 text-paper'
                    : 'text-paper/55 hover:text-paper hover:bg-white/5'
                }`
              }
            >
              <span className="text-transit">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-5">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2.5 rounded-lg font-body text-sm text-paper/55 hover:text-paper hover:bg-white/5 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, TrendingDown, Wallet, LogOut } from 'lucide-react';
import '../styles/sidebar.css';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/expenses', label: 'Expenses', icon: TrendingDown },
  { to: '/income', label: 'Income', icon: Wallet },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon"><Wallet size={19} /></div>
        <div>
          <strong>FinTrack</strong>
          <span>PERSONAL FINANCE</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <span className="sidebar-section-label">MENU</span>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button type="button" className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
        <div className="sidebar-footer">FINTRACK • SECURE SESSION</div>
      </div>
    </aside>
  );
}

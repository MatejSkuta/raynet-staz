import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'dashboard',   icon: '⊞', title: 'Nástěnka' },
  { id: 'contacts',    icon: '👥', title: 'Kontakty' },
  { id: 'leads',       icon: '◎', title: 'Leady' },
  { id: 'deals',       icon: '💼', title: 'Dealy' },
  { id: 'leaderboard', icon: '📊', title: 'Žebříček', active: true },
  { id: 'calendar',    icon: '📅', title: 'Kalendář' },
];

export function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">R</div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`sidebar-btn${item.active ? ' sidebar-btn--active' : ''}`}
            title={item.title}
          >
            {item.icon}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button className="sidebar-btn" title="Nastavení">⚙️</button>
        <div className="sidebar-user">FH</div>
      </div>
    </div>
  );
}

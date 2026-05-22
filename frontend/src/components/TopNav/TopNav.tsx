import './TopNav.css';

const TABS = [
  { id: 'nastednka', label: 'Nástěnka' },
  { id: 'zaciname', label: 'Začínáme' },
  { id: 'leady', label: 'Leady' },
  { id: 'nastednka-leadu', label: 'Nástěnka leadů' },
  { id: 'zebricek', label: 'Žebříček obchodníků', active: true },
  { id: 'prilezitosti', label: 'Snapřejí příležitosti' },
];

export function TopNav() {
  return (
    <div className="topnav">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`topnav-tab${tab.active ? ' topnav-tab--active' : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

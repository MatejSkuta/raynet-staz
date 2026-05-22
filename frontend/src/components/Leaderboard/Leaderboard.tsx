import './Leaderboard.css';

interface Salesperson {
  id: number;
  name: string;
  initials: string;
  color: string;
  deals: number;
  value: number;
  trend: number;
}

const MOCK_DATA: Salesperson[] = [
  { id: 1, name: 'Petra Nováková',      initials: 'PN', color: '#e91e63', deals: 46, value: 2500000, trend:  2.1 },
  { id: 2, name: 'Martin Dvořák',       initials: 'MD', color: '#2196f3', deals: 38, value: 2100000, trend:  4.0 },
  { id: 3, name: 'Jana Horáková',       initials: 'JH', color: '#9c27b0', deals: 31, value: 1850000, trend: -1.3 },
  { id: 4, name: 'Tomáš Procházka',     initials: 'TP', color: '#ff9800', deals: 26, value: 1620000, trend:  6.8 },
  { id: 5, name: 'Eva Šimánková',       initials: 'EŠ', color: '#4caf50', deals: 24, value: 1340000, trend: -2.7 },
  { id: 6, name: 'Jakub Marek',         initials: 'JM', color: '#607d8b', deals: 21, value: 1150000, trend:  1.4 },
  { id: 7, name: 'Lucie Veselá',        initials: 'LV', color: '#00bcd4', deals: 19, value:  980000, trend: -7.1 },
  { id: 8, name: 'Ondřej Blažek',       initials: 'OB', color: '#795548', deals: 17, value:  870000, trend:  1.5 },
  { id: 9, name: 'Markéta Červenáková', initials: 'MČ', color: '#f44336', deals: 14, value:  720000, trend: -3.9 },
  { id: 10, name: 'Radek Novotný',      initials: 'RN', color: '#3f51b5', deals: 12, value:  580000, trend:  4.1 },
];

const RANK_BADGE: Record<number, string> = {
  1: 'rank-gold',
  2: 'rank-silver',
  3: 'rank-bronze',
};

function formatValue(value: number): string {
  return new Intl.NumberFormat('cs-CZ').format(value);
}

function TrendBadge({ value }: { value: number }) {
  const cls = value >= 0 ? 'trend--up' : 'trend--down';
  return <span className={`trend ${cls}`}>{value >= 0 ? '+' : ''}{value}%</span>;
}

export function Leaderboard() {
  const top6 = MOCK_DATA.slice(0, 6);
  const rest = MOCK_DATA.slice(6);
  const topValue = MOCK_DATA[0].value;

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <div className="leaderboard-breadcrumb">Seřadit dle: Hodnota dealů (postoupil)</div>
        <h1 className="leaderboard-title">Žebříček obchodníků</h1>
      </div>

      <div className="leaderboard-filters">
        <div className="filter-chips">
          {['Má filtry', 'Tento měsíc', 'Obchodník', 'Region', 'Tým'].map(f => (
            <span key={f} className="filter-chip">{f} <span className="chip-x">×</span></span>
          ))}
          <button className="filter-edit-btn">✏️</button>
        </div>
        <div className="filter-actions">
          <span className="filter-date">Tento: Maj 2026 <span className="chip-x">×</span></span>
          <button className="filter-clear-btn">Vyčistit filtry</button>
          <div className="filter-right">
            <button className="btn-add">+</button>
            <button className="btn-filter">⊞ Filtrovat</button>
          </div>
        </div>
      </div>

      <div className="leaderboard-section">
        <h2 className="section-title"># Pořadí obchodníků</h2>
        <div className="top-cards">
          {top6.map((person, i) => {
            const rank = i + 1;
            return (
              <div key={person.id} className="top-card">
                <div className="top-card-header">
                  <span className={`rank-badge ${RANK_BADGE[rank] ?? 'rank-default'}`}>
                    {rank}. MÍSTO
                  </span>
                  <TrendBadge value={person.trend} />
                </div>
                <div className="top-card-avatar" style={{ backgroundColor: person.color }}>
                  {person.initials}
                </div>
                <div className="top-card-name">{person.name}</div>
                <div className="top-card-stats">
                  <div className="stat">
                    <span className="stat-value">{person.deals}</span>
                    <span className="stat-label">dealy</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value stat-value--sm">{formatValue(person.value)}</span>
                    <span className="stat-label">Kč</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="leaderboard-table-wrap">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>OBCHODNÍK</th>
              <th>DEALY</th>
              <th>HODNOTA</th>
              <th>TREND</th>
              <th>PODÍL</th>
            </tr>
          </thead>
          <tbody>
            {rest.map((person, i) => {
              const rank = i + 7;
              const share = Math.round((person.value / topValue) * 100);
              return (
                <tr key={person.id}>
                  <td className="col-rank">{rank}</td>
                  <td>
                    <div className="person-cell">
                      <div className="person-avatar" style={{ backgroundColor: person.color }}>
                        {person.initials}
                      </div>
                      <span>{person.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="deals-count">{person.deals}</span>
                    <span className="deals-label"> dealy</span>
                  </td>
                  <td>
                    {formatValue(person.value)}
                    <TrendBadge value={person.trend} />
                  </td>
                  <td>
                    <div className="bar-row">
                      <div className="bar-track">
                        <div
                          className={`bar-fill ${person.trend >= 0 ? 'bar-fill--up' : 'bar-fill--down'}`}
                          style={{ width: `${Math.min(Math.abs(person.trend) * 10, 100)}%` }}
                        />
                      </div>
                      <TrendBadge value={person.trend} />
                    </div>
                  </td>
                  <td>
                    <div className="bar-row">
                      <div className="bar-track">
                        <div className="bar-fill bar-fill--share" style={{ width: `${share}%` }} />
                      </div>
                      <span className="share-value">{share} %</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import './Leaderboard.css';

const PERSON_PHOTOS: Record<string, string> = {
  'Jana Rybářová':   '/photos/jana-rybarova.jpeg',
  'Petra Ploticová': '/photos/petra-ploticova.jpeg',
  'Lukáš Sardinka':  '/photos/lukas-sardinka.jpeg',
};

const MONTHS = ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro'];
const MONTH_NAMES = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
const YEARS = ['2025', '2026'];

function formatValue(value: number): string {
  return new Intl.NumberFormat('cs-CZ').format(value);
}

function parseMonth(val: string) {
  const [y, m] = val.split('-');
  return { year: y, monthIndex: parseInt(m) - 1 };
}

export function Leaderboard() {
  const [month, setMonth] = useState('2026-05');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState('2026');

  const { data, loading, error } = useLeaderboard(month);

  const top6 = data.slice(0, 6);
  const rest = data.slice(6);
  const topValue = data[0]?.value ?? 1;

  const { monthIndex } = parseMonth(month);
  const monthLabel = `${MONTH_NAMES[monthIndex]} ${month.slice(0, 4)}`;

  function selectMonth(y: string, mi: number) {
    setMonth(`${y}-${String(mi + 1).padStart(2, '0')}`);
    setPickerOpen(false);
  }

  return (
    <div className="leaderboard" onClick={() => pickerOpen && setPickerOpen(false)}>
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
          <div className="month-picker-wrap" onClick={e => e.stopPropagation()}>
            <button
              className="filter-date filter-date--btn"
              onClick={() => setPickerOpen(o => !o)}
            >
              📅 {monthLabel} <span className="chip-x">×</span>
            </button>
            {pickerOpen && (
              <div className="month-picker">
                <div className="month-picker-years">
                  {YEARS.map(y => (
                    <button
                      key={y}
                      className={`picker-year${pickerYear === y ? ' picker-year--active' : ''}`}
                      onClick={() => setPickerYear(y)}
                    >
                      {y}
                    </button>
                  ))}
                </div>
                <div className="month-picker-grid">
                  {MONTHS.map((m, i) => {
                    const val = `${pickerYear}-${String(i + 1).padStart(2, '0')}`;
                    return (
                      <button
                        key={val}
                        className={`picker-month${val === month ? ' picker-month--active' : ''}`}
                        onClick={() => selectMonth(pickerYear, i)}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <button className="filter-clear-btn" onClick={() => setMonth('2026-05')}>Vyčistit filtry</button>
          <div className="filter-right">
            <button className="btn-add">+</button>
            <button className="btn-filter">⊞ Filtrovat</button>
          </div>
        </div>
      </div>

      {loading && <div className="leaderboard-status">Načítám data...</div>}
      {error   && <div className="leaderboard-status leaderboard-error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="leaderboard-section">
            <h2 className="section-title"># Pořadí obchodníků</h2>
            <div className="top-cards">
              {top6.map((person, i) => {
                const rank = i + 1;
                const photo = PERSON_PHOTOS[person.name] ?? null;
                return (
                  <div key={person.id} className={`top-card top-card--rank-${rank}`}>
                    <div className="top-card-banner">
                      <span className="banner-rank">{rank}. MÍSTO</span>
                      {person.trend !== null ? (
                        <span className={`banner-trend ${person.trend >= 0 ? 'banner-trend--up' : 'banner-trend--down'}`}>
                          {person.trend >= 0 ? '▲' : '▼'} {Math.abs(person.trend)}%
                        </span>
                      ) : (
                        <span className="banner-trend banner-trend--neutral">—</span>
                      )}
                    </div>
                    <div className="top-card-body">
                      {photo ? (
                        <img className="top-card-avatar top-card-avatar--photo" src={photo} alt={person.name} />
                      ) : (
                        <div className="top-card-avatar" style={{ backgroundColor: person.color }}>
                          {person.initials}
                        </div>
                      )}
                      <div className="top-card-name">{person.name}</div>
                      <div className="top-card-stats">
                        <div className="stat-box">
                          <span className="stat-value">{person.deals}</span>
                          <span className="stat-label">dealy</span>
                        </div>
                        <div className="stat-box">
                          <span className="stat-value stat-value--sm">{formatValue(person.value)}</span>
                          <span className="stat-label">Kč</span>
                        </div>
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
                          {PERSON_PHOTOS[person.name] ? (
                            <img className="person-avatar person-avatar--photo" src={PERSON_PHOTOS[person.name]} alt={person.name} />
                          ) : (
                            <div className="person-avatar" style={{ backgroundColor: person.color }}>
                              {person.initials}
                            </div>
                          )}
                          <span>{person.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="deals-count">{person.deals}</span>
                        <span className="deals-label"> dealy</span>
                      </td>
                      <td>{formatValue(person.value)}</td>
                      <td>
                        {person.trend !== null ? (
                          <div className="bar-row">
                            <div className="bar-track">
                              <div
                                className={`bar-fill ${person.trend >= 0 ? 'bar-fill--up' : 'bar-fill--down'}`}
                                style={{ width: `${Math.min(Math.abs(person.trend), 100)}%` }}
                              />
                            </div>
                            <span className={`trend ${person.trend >= 0 ? 'trend--up' : 'trend--down'}`}>
                              {person.trend >= 0 ? '+' : ''}{person.trend} %
                            </span>
                          </div>
                        ) : (
                          <span className="trend-neutral">—</span>
                        )}
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
        </>
      )}
    </div>
  );
}

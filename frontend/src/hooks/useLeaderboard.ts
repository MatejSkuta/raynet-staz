import { useState, useEffect } from 'react';

export interface Salesperson {
  id: number;
  name: string;
  initials: string;
  color: string;
  photoUrl: string | null;
  deals: number;
  value: number;
  winRate: number;
  trend: number | null;
}

interface ApiPhoto {
  uuid: string;
  iconMediumUuid: string | null;
  fileName: string;
}

interface ApiPerson {
  id: number;
  fullName: string;
  photo: ApiPhoto | null;
  totalDeals: number;
  wonDeals: number;
  wonAmountCZK: number;
}

interface ApiResponse {
  month: string;
  data: ApiPerson[];
}

const COLORS = [
  '#e91e63', '#2196f3', '#9c27b0', '#ff9800',
  '#4caf50', '#607d8b', '#00bcd4', '#795548',
  '#f44336', '#3f51b5', '#009688', '#ff5722',
];

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return fullName.slice(0, 2).toUpperCase();
}

function prevMonth(month: string): string {
  const [y, m] = month.split('-').map(Number);
  if (m === 1) return `${y - 1}-12`;
  return `${y}-${String(m - 1).padStart(2, '0')}`;
}

export function useLeaderboard(month: string) {
  const [data, setData] = useState<Salesperson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const prev = prevMonth(month);

    Promise.all([
      fetch(`/api/persons/stats/monthly?month=${month}`).then(r => r.json() as Promise<ApiResponse>),
      fetch(`/api/persons/stats/monthly?month=${prev}`).then(r => r.json() as Promise<ApiResponse>),
    ])
      .then(([current, previous]) => {
        const prevMap: Record<number, number> = {};
        previous.data?.forEach(p => { prevMap[p.id] = p.wonAmountCZK; });

        const salespersons: Salesperson[] = current.data.map((p, i) => {
          const prevValue = prevMap[p.id] ?? null;
          let trend: number | null = null;
          if (prevValue !== null && prevValue > 0) {
            trend = Math.round(((p.wonAmountCZK - prevValue) / prevValue) * 100);
          } else if (prevValue === 0 && p.wonAmountCZK > 0) {
            trend = 100;
          }
          return {
            id: p.id,
            name: p.fullName,
            initials: getInitials(p.fullName),
            color: COLORS[i % COLORS.length],
            photoUrl: p.photo?.iconMediumUuid
              ? `/api/file/${p.photo.iconMediumUuid}`
              : null,
            deals: p.totalDeals,
            value: p.wonAmountCZK,
            winRate: p.totalDeals > 0
              ? Math.round((p.wonDeals / p.totalDeals) * 100)
              : 0,
            trend,
          };
        });

        setData(salespersons);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [month]);

  return { data, loading, error };
}

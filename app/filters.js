// Search, filter and sort for the deal list. Pure functions over DEALS:
// given a state object they return the deals to show, in display order.

import { DEALS, discountPct, savedAmount } from './deals.js';

export const SORTS = {
  'best-verdict': 'Best deals first',
  'biggest-pct': 'Biggest % off',
  'biggest-save': 'Biggest $ saving',
  'lowest-price': 'Lowest price',
  'highest-price': 'Highest price',
};

const VERDICT_RANK = { 'new-low': 0, strong: 1, routine: 2 };

export function emptyState() {
  return { q: '', category: 'all', store: 'all', minPct: 0, verdict: 'all', sort: 'best-verdict' };
}

export function applyFilters(deals, state) {
  const q = state.q.trim().toLowerCase();
  let out = deals.filter((d) => {
    if (state.category !== 'all' && d.category !== state.category) return false;
    if (state.store !== 'all' && d.store !== state.store) return false;
    if (state.verdict !== 'all' && d.verdict !== state.verdict) return false;
    if (discountPct(d) < state.minPct) return false;
    if (q) {
      const hay = `${d.title} ${d.brand} ${d.category} ${d.store}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const by = {
    'best-verdict': (a, b) =>
      VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict] ||
      discountPct(b) - discountPct(a),
    'biggest-pct': (a, b) => discountPct(b) - discountPct(a),
    'biggest-save': (a, b) => savedAmount(b) - savedAmount(a),
    'lowest-price': (a, b) => a.sale - b.sale,
    'highest-price': (a, b) => b.sale - a.sale,
  }[state.sort];
  return [...out].sort(by);
}

export function countByVerdict(deals) {
  const counts = { 'new-low': 0, strong: 0, routine: 0 };
  for (const d of deals) counts[d.verdict]++;
  return counts;
}

export function topDeal(deals) {
  return applyFilters(deals, emptyState())[0] ?? null;
}

export { DEALS };

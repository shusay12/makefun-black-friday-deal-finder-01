// Wiring: hash routes, filter controls and rendering for Bargain Beacon.
//
//   #/                  the deal list
//   #/cat/<category>    list filtered to one category
//   #/store/<store>     list filtered to one store
//   #/verdict/new-low   list filtered to new lows only
//   #/deal/<id>         one deal
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { CATEGORIES, CHECKED_DATE, DEALS, STORES } from './deals.js';
import { SORTS, applyFilters, countByVerdict, emptyState } from './filters.js';
import { card, dealPage, emptyList } from './render.js';

const app = document.getElementById('app');
const state = emptyState();

function option(value, label, selected) {
  return `<option value="${value}"${value === selected ? ' selected' : ''}>${label}</option>`;
}

function controls() {
  const cats = CATEGORIES.map((c) => option(c, c, state.category)).join('');
  const stores = STORES.map((s) => option(s, s, state.store)).join('');
  const mins = [0, 20, 30, 40, 50]
    .map((n) => option(String(n), n === 0 ? 'Any discount' : `${n}% off or more`, String(state.minPct)))
    .join('');
  const sorts = Object.entries(SORTS)
    .map(([k, label]) => option(k, label, state.sort))
    .join('');
  return `<section class="controls" aria-label="Search and filter deals">
    <label>Search <input id="q" type="search" placeholder="Search products, brands…" value="${state.q.replace(/"/g, '&quot;')}"></label>
    <label>Category <select id="f-cat"><option value="all">All categories</option>${cats}</select></label>
    <label>Store <select id="f-store"><option value="all">All stores</option>${stores}</select></label>
    <label>Discount <select id="f-min">${mins}</select></label>
    <label>Sort by <select id="f-sort">${sorts}</select></label>
  </section>`;
}

function summary(shown) {
  const counts = countByVerdict(DEALS);
  return `<p class="summary"><strong>${shown.length} of ${DEALS.length} deals</strong> · checked ${CHECKED_DATE} ·
    <span class="dot dot-new-low"></span>${counts['new-low']} new lows ·
    <span class="dot dot-strong"></span>${counts.strong} strong prices ·
    <span class="dot dot-routine"></span>${counts.routine} routine sales</p>`;
}

function listView() {
  const shown = applyFilters(DEALS, state);
  return `${controls()}${summary(shown)}
    <div class="deals">${shown.length ? shown.map(card).join('') : emptyList()}</div>`;
}

function render() {
  window.__shotReady = false;
  const hash = location.hash || '#/';
  const dealMatch = hash.match(/^#\/deal\/([^/?]+)/);
  const catMatch = hash.match(/^#\/cat\/(.+)/);
  const storeMatch = hash.match(/^#\/store\/(.+)/);
  const verdictMatch = hash.match(/^#\/verdict\/new-low/);
  if (dealMatch) {
    const found = DEALS.find((d) => d.id === decodeURIComponent(dealMatch[1]));
    document.title = `${found ? found.title : 'Deal not found'} | Bargain Beacon`;
    app.innerHTML = found
      ? dealPage(found)
      : `<p class="empty">That deal is not on this board. <a href="#/">Back to all deals</a>.</p>`;
  } else {
    if (catMatch) {
      state.category = decodeURIComponent(catMatch[1]);
      state.store = 'all';
      state.verdict = 'all';
      state.minPct = 0;
    } else if (storeMatch) {
      state.store = decodeURIComponent(storeMatch[1]);
      state.category = 'all';
      state.verdict = 'all';
      state.minPct = 0;
    } else if (verdictMatch) {
      state.verdict = 'new-low';
      state.category = 'all';
      state.store = 'all';
      state.minPct = 0;
    } else {
      state.category = 'all';
      state.store = 'all';
      state.verdict = 'all';
      state.minPct = 0;
    }
    document.title = 'Bargain Beacon — Black Friday 2026 Deal Finder';
    app.innerHTML = listView();
    const q = app.querySelector('#q');
    const rerender = () => {
      state.q = q.value;
      const shown = applyFilters(DEALS, state);
      app.querySelector('.summary').outerHTML = summary(shown);
      app.querySelector('.deals').innerHTML = shown.length
        ? shown.map(card).join('')
        : emptyList();
    };
    q.addEventListener('input', rerender);
    app.querySelector('#f-cat').addEventListener('change', (e) => {
      state.category = e.target.value;
      rerender();
    });
    app.querySelector('#f-store').addEventListener('change', (e) => {
      state.store = e.target.value;
      rerender();
    });
    app.querySelector('#f-min').addEventListener('change', (e) => {
      state.minPct = Number(e.target.value);
      rerender();
    });
    app.querySelector('#f-sort').addEventListener('change', (e) => {
      state.sort = e.target.value;
      rerender();
    });
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();

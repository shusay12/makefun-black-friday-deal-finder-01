// HTML for deal cards and the single-deal page. All markup is built from
// the deal data, escaped so a product name can never break the page.

import { CHECKED_DATE, VERDICTS, discountPct, money, savedAmount } from './deals.js';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function verdictBadge(deal) {
  const v = VERDICTS[deal.verdict];
  return `<span class="badge badge-${deal.verdict}" title="${esc(v.hint)}">${v.label}</span>`;
}

export function priceBlock(deal) {
  const pct = discountPct(deal);
  return `<p class="prices"><span class="sale">${money(deal.sale)}</span>
    <span class="usual"><s>${money(deal.usual)}</s></span>
    <span class="pct">−${pct}%</span></p>
    <p class="save">You save ${money(savedAmount(deal))}</p>`;
}

export function card(deal) {
  return `<article class="card" data-id="${esc(deal.id)}">
    <div class="card-top"><span class="store">${esc(deal.store)}</span>${verdictBadge(deal)}</div>
    <h3><a href="#/deal/${esc(deal.id)}">${esc(deal.title)}</a></h3>
    <p class="cat">${esc(deal.category)} · ${esc(deal.brand)}</p>
    ${priceBlock(deal)}
    <p class="checked">Checked ${esc(CHECKED_DATE)} · ends ${esc(deal.ends)}</p>
    <p class="actions"><a class="btn" href="${esc(deal.url)}" target="_blank" rel="noopener">View at ${esc(deal.store)} ↗</a>
    <a class="details" href="#/deal/${esc(deal.id)}">Details</a></p>
  </article>`;
}

export function dealPage(deal) {
  const v = VERDICTS[deal.verdict];
  return `<article class="detail">
    <p class="crumbs"><a href="#/">← All deals</a> · ${esc(deal.category)} · ${esc(deal.store)}</p>
    <div class="card-top"><span class="store">${esc(deal.store)}</span>${verdictBadge(deal)}</div>
    <h2>${esc(deal.title)}</h2>
    <p class="cat">${esc(deal.brand)} · ${esc(deal.category)}</p>
    ${priceBlock(deal)}
    <div class="verdict-box verdict-${deal.verdict}">
      <p><strong>${v.label} — ${esc(v.hint)}.</strong></p>
      <p>${esc(deal.verdictNote)}</p>
    </div>
    <p class="note">${esc(deal.note)}</p>
    <p class="actions"><a class="btn big" href="${esc(deal.url)}" target="_blank" rel="noopener">View this deal at ${esc(deal.store)} ↗</a></p>
    <dl class="facts">
      <div><dt>Sale price</dt><dd>${money(deal.sale)}</dd></div>
      <div><dt>Usual price</dt><dd>${money(deal.usual)}</dd></div>
      <div><dt>Discount</dt><dd>−${discountPct(deal)}% (save ${money(savedAmount(deal))})</dd></div>
      <div><dt>Price checked</dt><dd>${esc(CHECKED_DATE)}</dd></div>
      <div><dt>Price source</dt><dd>${esc(deal.source)}</dd></div>
      <div><dt>Sale ends</dt><dd>${esc(deal.ends)}</dd></div>
    </dl>
    <p class="fine">Prices move during Black Friday week — confirm the price at the store before you buy. Links open the store in a new tab.</p>
  </article>`;
}

export function emptyList() {
  return `<p class="empty">No deals match those filters. Try clearing the search or lowering the minimum discount.</p>`;
}

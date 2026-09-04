import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const notes = JSON.parse(fs.readFileSync(path.join(root, 'content', 'research.json'), 'utf8'));
const about = JSON.parse(fs.readFileSync(path.join(root, 'content', 'about.json'), 'utf8'));
const base = 'https://karaptic.com';

const escape = (value) => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const first = (value, sentences = 2) => value.match(/[^.!?]+[.!?]+(?:[”"'](?=\s|$))?/g)?.slice(0, sentences).join(' ').trim() || value;
const write = (route, html) => {
  const dir = path.join(dist, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
};

const nav = (active = '') => `
  <header class="site-header">
    <a class="brand" href="/" aria-label="Karaptic Research home">
      <span class="brand-mark"><img src="/assets/karaptic-logo.png" alt=""></span>
      <span class="brand-name">Karaptic<br>Research</span>
    </a>
    <nav class="desktop-nav" aria-label="Main navigation">
      <a ${active === 'research' ? 'aria-current="page"' : ''} href="/research/">Research</a>
      <div class="nav-group">
        <a ${active === 'labs' ? 'aria-current="page"' : ''} href="/labs/">Labs <span aria-hidden="true">⌄</span></a>
        <div class="nav-menu"><a href="/labs/klines/"><small>01</small><strong>Klines</strong><span>Event detection for Binance</span></a></div>
      </div>
      <a ${active === 'blog' ? 'aria-current="page"' : ''} href="/blog/">Blog</a>
      <a ${active === 'about' ? 'aria-current="page"' : ''} href="/about/">About</a>
      <a ${active === 'contact' ? 'aria-current="page"' : ''} href="/contact/">Contact</a>
    </nav>
    <a class="github-link" href="https://github.com/Silent47boryara/searching-for-edge">GitHub ↗</a>
    <details class="mobile-nav"><summary aria-label="Open navigation">Menu</summary><div>
      <a href="/research/">Research</a><a href="/labs/">Labs</a><a href="/labs/klines/">— Klines</a><a href="/blog/">Blog</a><a href="/about/">About</a><a href="/contact/">Contact</a>
    </div></details>
  </header>`;

const footer = `
  <footer class="site-footer">
    <a class="footer-brand" href="/">Karaptic <em>Research</em></a>
    <p>Independent research on cryptocurrency markets,<br>market structure, and systematic trading.</p>
    <div class="footer-links"><a href="/research/">Research</a><a href="/about/">About</a><a href="https://github.com/Silent47boryara/searching-for-edge">GitHub ↗</a></div>
    <p class="footer-meta">Independent · self-published · negative results included <span>Est. 2026</span></p>
  </footer>`;

function page({ title, description, route = '', active = '', className = '', body, type = 'website', schema = '' }) {
  const url = `${base}${route}`;
  const jsonLd = schema || JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: title, url, description, isPartOf: { '@type': 'WebSite', name: 'Karaptic Research', url: base } });
  return `<!doctype html>
<html lang="en"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escape(title)}</title><meta name="description" content="${escape(description)}">
  <link rel="canonical" href="${url}"><meta property="og:type" content="${type}"><meta property="og:url" content="${url}">
  <meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}">
  <meta property="og:image" content="${base}/assets/karaptic-road-clean.png"><meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.ico?v=2" sizes="any"><link rel="icon" href="/assets/karaptic-favicon.svg?v=2" type="image/svg+xml"><link rel="icon" href="/assets/karaptic-favicon-32.png?v=2" type="image/png" sizes="32x32"><link rel="apple-touch-icon" href="/assets/karaptic-apple-touch-icon.png?v=2"><meta name="theme-color" content="#11130f"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css"><script type="application/ld+json">${jsonLd}</script>
</head><body class="${className}">${nav(active)}<main>${body}</main>${footer}</body></html>`;
}

const badges = (note) => note.badges.map((badge) => `<span>${escape(badge)}</span>`).join('');
const noteCard = (note, large = false) => `<article class="research-card${large ? ' featured-card' : ''}">
  <div class="card-top"><span class="note-no">${note.num}</span><div class="badges">${badges(note)}</div></div>
  <h2><a href="/research/${note.slug}/">${escape(note.title)}</a></h2>
  <p>${escape(first(note.abstract, large ? 3 : 2))}</p>
  <a class="read-link" href="/research/${note.slug}/">Read note <span>↗</span></a>
</article>`;

const home = page({
  title: 'Karaptic Research — Independent crypto market research',
  description: 'Independent research on cryptocurrency markets, market structure, and systematic trading. Negative and closed results included.',
  route: '/', className: 'home', body: `
  <section class="home-hero grid-bg">
    <div class="hero-copy"><p class="eyebrow"><i></i> Independent · self-published · negative results included</p>
      <h1>Karaptic<br><em>Research</em></h1>
      <p class="hero-lead">Independent research on cryptocurrency markets, market structure, and systematic trading. Founded by <strong>Oleg Arefev</strong> — Chief Visionary Officer, Partner at Legal Kornet.</p>
      <p class="hero-text">Flagship research log: <a href="/research/">Searching for Edge</a> — testing published trading strategies (momentum, trend, carry, reversal, grid) against real Binance data. Each note follows the same pipeline: literature review → replication → gross → net-of-costs → verdict. Closed and negative results are published alongside positive ones.</p>
      <div class="actions"><a class="button blue" href="/research/">Explore research <span>↗</span></a><a class="line-link" href="/about/">Read the mission</a></div>
    </div>
    <aside class="hero-index"><div><span>01</span><p>Literature first</p></div><div><span>02</span><p>Real Binance data</p></div><div><span>03</span><p>Net of costs</p></div></aside>
    <figure class="road-frame"><img src="/assets/karaptic-road-clean.png" alt="A road disappearing into a tropical landscape"><figcaption><span>Searching for edge</span><span>Where the reachable result matters</span></figcaption></figure>
  </section>
  <div class="ticker"><div>QUANTITATIVE FINANCE <span>●</span> MARKET MICROSTRUCTURE <span>●</span> BINANCE <span>●</span> BACKTESTING <span>●</span> NEGATIVE RESULTS <span>●</span> QUANTITATIVE FINANCE <span>●</span> MARKET MICROSTRUCTURE <span>●</span> BINANCE <span>●</span> BACKTESTING <span>●</span> NEGATIVE RESULTS <span>●</span></div></div>
  <section class="home-research section"><div class="section-head"><p class="kicker">01 / Published work</p><h2>Research<br>notes</h2><p>Published claims are reconstructed, replicated where possible, priced at realistic execution costs, and given a verdict.</p></div>
    <div class="home-card-grid">${notes.slice(0, 3).map((n, i) => noteCard(n, i === 0)).join('')}</div>
    <a class="button black center" href="/research/">All seven notes <span>↗</span></a>
  </section>
  <section class="split-feature"><div><p class="kicker light">02 / Labs</p><h2>Built before<br>the paper.</h2></div><div><p class="feature-lead">Klines is an event-detection system for Binance, built out of months of minute-by-minute replay and case-by-case review of volume spikes.</p><p>Detection, tiering, and a short monitoring window are automated. The decision to size into a specific trade remains manual. It currently runs in paper execution.</p><a class="button lime" href="/labs/klines/">Enter Klines lab <span>↗</span></a></div></section>
  <section class="blog-preview section"><div class="section-head compact"><p class="kicker">03 / Field notes</p><h2>Blog</h2><p>A home for shorter essays, methodology updates, and observations that do not need to become a full research note.</p></div><div class="empty-row"><span>Journal is open</span><strong>First entries are being prepared.</strong><a href="/blog/">Open blog →</a></div></section>`
});
write('', home);

const researchHub = page({ title: 'Research Notes — Karaptic Research', description: 'Searching for Edge — a public research log testing published crypto trading strategies against real Binance data, note by note.', route: '/research/', active: 'research', className: 'hub-page', body: `
  <header class="page-hero grid-bg"><p class="kicker">Research / Index</p><h1>Searching<br>for <em>Edge</em></h1><p>A public research log testing published crypto trading strategies against real Binance data. Literature review → replication → gross → net-of-costs → verdict, one note per hypothesis. Closed and negative results are published alongside positive ones.</p></header>
  <section class="research-index section"><div class="index-intro"><span>07 published notes</span><p>Open a note for the full, indexable abstract and links to methodology, code, data, and references.</p></div><div class="all-notes">${notes.map((n) => noteCard(n)).join('')}</div>
  <p class="repo-callout">Full repository, methodology and references: <a href="https://github.com/Silent47boryara/searching-for-edge">github.com/Silent47boryara/searching-for-edge ↗</a></p></section>` });
write('research', researchHub);

for (const note of notes) {
  const schema = JSON.stringify({ '@context': 'https://schema.org', '@type': 'ScholarlyArticle', headline: note.title, description: note.abstract, author: { '@type': 'Person', name: 'Oleg Arefev' }, publisher: { '@type': 'Organization', name: 'Karaptic Research' }, url: `${base}/research/${note.slug}/`, sameAs: note.source });
  const notePage = page({ title: `${note.title} — Karaptic Research`, description: note.abstract, route: `/research/${note.slug}/`, active: 'research', className: 'article-page', type: 'article', schema, body: `
    <article class="article-shell"><aside class="article-rail"><a href="/research/">← Research index</a><strong>${note.num}</strong><div class="badges vertical">${badges(note)}</div></aside>
      <div class="article-body"><p class="kicker">Research Note ${note.num}</p><h1>${escape(note.title)}</h1><p class="article-deck">${escape(note.abstract)}</p>
        ${note.ssrn ? `<div class="citation"><span>Formal write-up</span><a href="${note.ssrn.url}">${note.ssrn.label} ↗</a><small>${note.ssrn.note}</small></div>` : ''}
        <div class="article-actions"><a class="button blue" href="${note.source}">Full note, code & references <span>↗</span></a><a class="line-link" href="/research/">All research notes</a></div>
        <p class="source-note">This page preserves the approved research abstract in full. The working repository contains the complete note, methodology, code, data, and references.</p>
      </div></article>` });
  write(path.join('research', note.slug), notePage);
}

const k = about.find((item) => item.title === 'What is ours: Klines');
const labs = page({ title: 'Labs — Karaptic Research', description: 'Original systems and ongoing experiments from Karaptic Research.', route: '/labs/', active: 'labs', className: 'labs-page', body: `<header class="page-hero grid-bg"><p class="kicker">Labs / Systems</p><h1>Original<br><em>work</em></h1><p>Research built from direct observation, replay, and validation rather than reconstructed from a paper.</p></header><section class="lab-tile section"><span class="lab-no">01</span><div><p class="kicker">Binance event detection</p><h2>Klines</h2><p>${escape(k.paragraphs[0])}</p><a class="button blue" href="/labs/klines/">Open lab <span>↗</span></a></div><div class="signal-plot" aria-hidden="true"><i></i><b></b><b></b><b></b><b></b><b></b></div></section>` });
write('labs', labs);

const klines = page({ title: 'Klines — Karaptic Research Labs', description: 'Klines is an event-detection system for Binance, built from months of manual replay and case-by-case review of volume spikes, not from a paper.', route: '/labs/klines/', active: 'labs', className: 'klines-page', body: `<header class="klines-hero"><div><p class="kicker light">Labs / 01</p><h1>Klines</h1><p>${escape(k.paragraphs[0])}</p></div><div class="signal-plot hero-plot" aria-hidden="true"><i></i><b></b><b></b><b></b><b></b><b></b></div></header><section class="article-shell lab-copy"><aside class="article-rail"><a href="/labs/">← Labs index</a><strong>01</strong></aside><div class="article-body"><p class="kicker">What is ours</p><h2>Detection is not execution.</h2>${k.paragraphs.map((p) => `<p class="article-deck">${escape(p)}</p>`).join('')}<div class="article-actions"><a class="button blue" href="/research/retail-trader-klines/">Read Research Note 06 <span>↗</span></a></div></div></section>` });
write(path.join('labs', 'klines'), klines);

const aboutSections = about.filter((item) => !['What is ours: Klines', 'Join'].includes(item.title));
const aboutPage = page({ title: 'About — Karaptic Research', description: "What Karaptic Research is, how the research is done, and who is behind it.", route: '/about/', active: 'about', className: 'about-page', body: `<header class="page-hero grid-bg"><p class="kicker">About / Mission</p><h1>Why this<br><em>exists</em></h1><p>What this is, how it's done, and who is behind it.</p></header><section class="about-stack section">${aboutSections.map((item, i) => `<article><span>0${i + 1}</span><div><h2>${escape(item.title)}</h2>${item.paragraphs.map((p) => `<p>${escape(p)}</p>`).join('')}${item.title === 'How the research is done' ? '<div class="actions"><a class="line-link" href="/research/">Research Notes</a><a class="line-link" href="https://github.com/Silent47boryara/searching-for-edge">Full repository ↗</a></div>' : ''}</div></article>`).join('')}</section>` });
write('about', aboutPage);

const join = about.find((item) => item.title === 'Join');
const contact = page({ title: 'Contact — Karaptic Research', description: 'Propose a hypothesis, challenge a result, or start an open discussion with Karaptic Research.', route: '/contact/', active: 'contact', className: 'contact-page', body: `<header class="contact-hero grid-bg"><p class="kicker">Contact / Open discussion</p><h1>Bring a<br><em>hypothesis.</em></h1><div class="contact-copy"><p>${escape(join.paragraphs[0])}</p><p>${escape(join.paragraphs[1])}</p><a class="button blue" href="https://github.com/Silent47boryara/searching-for-edge/discussions">Start a discussion <span>↗</span></a></div></header><section class="contact-links section"><a href="https://github.com/Silent47boryara/searching-for-edge"><small>Repository</small><strong>Searching for Edge</strong><span>↗</span></a><a href="https://www.linkedin.com/company/karaptic-research/"><small>LinkedIn</small><strong>Karaptic Research</strong><span>↗</span></a><a href="https://orcid.org/0009-0008-0663-668X"><small>Research identity</small><strong>ORCID</strong><span>↗</span></a><a href="https://papers.ssrn.com/sol3/cf_dev/AbsByAuth.cfm?per_id=12971988"><small>Papers</small><strong>SSRN</strong><span>↗</span></a></section>` });
write('contact', contact);

const blog = page({ title: 'Blog — Karaptic Research', description: 'Essays, methodology updates, and field notes from Karaptic Research.', route: '/blog/', active: 'blog', className: 'blog-page', body: `<header class="page-hero grid-bg"><p class="kicker">Blog / Field notes</p><h1>Work in<br><em>public</em></h1><p>Essays, methodology updates, and observations that sit between a short note and a full research paper.</p></header><section class="blog-empty section"><span class="lab-no">00</span><div><p class="kicker">Journal status</p><h2>The shelf is ready.</h2><p>No placeholder articles, recycled GitHub posts, or invented publication dates. New writing will appear here as its own permanent, indexable page.</p><a class="line-link" href="/contact/">Propose a topic →</a></div></section>` });
write('blog', blog);

const routes = ['/', '/research/', ...notes.map((n) => `/research/${n.slug}/`), '/labs/', '/labs/klines/', '/blog/', '/about/', '/contact/'];
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${base}${route}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const sourceRoot = process.argv[2];
if (!sourceRoot) throw new Error('Pass the approved source directory');

const decode = (value) => value
  .replaceAll('&amp;', '&')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'")
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>');
const text = (value) => decode(value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());

const researchHtml = fs.readFileSync(path.join(sourceRoot, 'research.html'), 'utf8');
const noteBlocks = [...researchHtml.matchAll(/<div class="note">([\s\S]*?)<\/div>\s*(?=<div class="note">|<div class="footer">)/g)].map((match) => match[1]);
const slugs = [
  'can-you-trade-crypto-profitably',
  'grid-bot-illusion',
  'momentum-binance-replication',
  'trend-when-published-edge-ages',
  'carry-real-edge',
  'reversal',
  'retail-trader-klines'
];
const notes = noteBlocks.map((block, index) => {
  const num = text(block.match(/<span class="num">([\s\S]*?)<\/span>/)?.[1] ?? '');
  const title = text(block.match(/<span class="title">([\s\S]*?)<\/span>/)?.[1] ?? '');
  const abstract = text(block.match(/<p class="abstract">([\s\S]*?)<\/p>/)?.[1] ?? '');
  const source = block.match(/<a class="note-link" href="([^"]+)"/)?.[1] ?? '';
  const badges = [...block.matchAll(/<span class="badge [^"]+">([\s\S]*?)<\/span>/g)].map((m) => text(m[1]));
  const ssrn = block.includes('SSRN 7376359') ? {
    url: 'https://ssrn.com/abstract=7376359',
    label: 'SSRN 7376359',
    note: 'working paper, DOI 10.2139/ssrn.7376359'
  } : null;
  return { num, slug: slugs[index], title, abstract, source, badges, ssrn };
});

if (notes.length !== 7 || notes.some((note) => !note.title || !note.abstract || !note.source)) {
  throw new Error(`Approved research import failed: found ${notes.length} complete notes`);
}

const aboutHtml = fs.readFileSync(path.join(sourceRoot, 'about.html'), 'utf8');
const cards = [...aboutHtml.matchAll(/<div class="card">\s*<h2>([\s\S]*?)<\/h2>([\s\S]*?)<\/div>/g)].map((match) => ({
  title: text(match[1]),
  paragraphs: [...match[2].matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => text(m[1]))
}));
if (cards.length !== 5) throw new Error(`Approved about import failed: found ${cards.length} sections`);

fs.mkdirSync(path.join(root, 'content'), { recursive: true });
fs.writeFileSync(path.join(root, 'content', 'research.json'), `${JSON.stringify(notes, null, 2)}\n`);
fs.writeFileSync(path.join(root, 'content', 'about.json'), `${JSON.stringify(cards, null, 2)}\n`);

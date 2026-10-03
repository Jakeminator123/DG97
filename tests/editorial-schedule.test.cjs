const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const matter = require('gray-matter');

const script = path.resolve(__dirname, '../scripts/editorial-schedule.mjs');
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Stockholm',
  year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const addDays = days => {
  const date = new Date(`${today}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};
function fixture(t, nextArticleDate = addDays(-10)) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dg97-weekly-test-'));
  t.after(() => {
    assert.equal(path.dirname(directory), path.resolve(os.tmpdir()));
    assert.ok(path.basename(directory).startsWith('dg97-weekly-test-'));
    fs.rmSync(directory, { recursive: true, force: true });
  });
  for (const subdir of ['data', 'content/posts', 'public/images']) {
    fs.mkdirSync(path.join(directory, subdir), { recursive: true });
  }
  const statePath = path.join(directory, 'data/editorial-schedule.json');
  const state = { version: 3, mode: 'weekly-generation', timezone: 'Europe/Stockholm',
    nextArticleDate, lastArticleDate: null, lastArticleSlug: null, weeklyPublished: [],
    initialBatch: { publishedOn: '2026-10-02', slugs: ['existing-guide'] } };
  fs.writeFileSync(statePath, JSON.stringify(state));
  fs.writeFileSync(path.join(directory, 'public/images/office.jpg'), 'image fixture');
  const articlePath = path.join(directory, 'content/posts/new-guide.md');
  fs.writeFileSync(articlePath, matter.stringify('Praktiska råd för teamets vardag. '.repeat(60), {
    title: 'A new guide', excerpt: 'An editorial test article', author: 'DG97 Kontorsguiden',
    date: today, modifiedDate: today, draft: false, category: 'valja-kontor', automation: 'dg97-weekly-guide',
    featuredImage: '/images/office.jpg', featuredImageAlt: 'Office image', sources: ['https://www.dg97.se/kontakt/'],
  }));
  return { statePath, articlePath, directory,
    run: (...args) => spawnSync(process.execPath, [script, ...args], { cwd: directory, encoding: 'utf8' }),
    readState: () => JSON.parse(fs.readFileSync(statePath, 'utf8')) };
}

test('a future week cannot be recorded early and status leaves files untouched', t => {
  const f = fixture(t, addDays(2));
  const before = fs.readFileSync(f.statePath, 'utf8');
  assert.equal(JSON.parse(f.run('status').stdout).due, false);
  assert.notEqual(f.run('record', 'new-guide').status, 0);
  assert.equal(fs.readFileSync(f.statePath, 'utf8'), before);
});

test('a completed weekly article advances seven days from today without catching up missed weeks', t => {
  const f = fixture(t);
  const result = f.run('record', 'new-guide');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).recorded, true);
  const state = f.readState();
  assert.deepEqual(state.weeklyPublished, [{ slug: 'new-guide', date: today }]);
  assert.equal(state.lastArticleSlug, 'new-guide');
  assert.equal(state.lastArticleDate, today);
  assert.equal(state.nextArticleDate, addDays(7));
  assert.equal(JSON.parse(f.run('status').stdout).due, false);
  assert.equal(JSON.parse(f.run('record', 'new-guide').stdout).recorded, false);
  assert.deepEqual(f.readState(), state);
});

test('drafts, missing images, incomplete metadata and fixed prices cannot advance the schedule', t => {
  const f = fixture(t);
  const original = matter.read(f.articlePath);
  for (const changes of [{ draft: true }, { featuredImage: '/images/missing.jpg' }, { category: 'unknown' },
    { date: '2020-01-01' }, { automation: null }, { sources: [] }]) {
    fs.writeFileSync(f.articlePath, matter.stringify(original.content, { ...original.data, ...changes }));
    assert.notEqual(f.run('record', 'new-guide').status, 0);
    assert.equal(f.readState().weeklyPublished.length, 0);
  }
  fs.writeFileSync(f.articlePath, matter.stringify(original.content + '\nPris: 5 900 kr.', original.data));
  assert.notEqual(f.run('record', 'new-guide').status, 0);
  assert.equal(f.readState().weeklyPublished.length, 0);
});

test('an existing guide or unsafe slug cannot be counted as a new article', t => {
  const f = fixture(t);
  assert.notEqual(f.run('record', 'existing-guide').status, 0);
  assert.notEqual(f.run('record', '../outside').status, 0);
  assert.equal(f.readState().weeklyPublished.length, 0);
});

test('inconsistent or duplicate history fails before schedule changes', t => {
  const f = fixture(t);
  const state = f.readState();
  for (const changes of [{ weeklyPublished: [{ slug: 'new-guide', date: today }] },
    { weeklyPublished: [{ slug: 'new-guide', date: today }, { slug: 'new-guide', date: today }],
      lastArticleDate: today, lastArticleSlug: 'new-guide', nextArticleDate: addDays(7) },
    { nextArticleDate: '2026-02-30' }, { version: 2 }]) {
    fs.writeFileSync(f.statePath, JSON.stringify({ ...state, ...changes }));
    assert.notEqual(f.run('status').status, 0);
  }
});

test('all twenty initial articles are published with images, sources and categories', () => {
  const root = path.resolve(__dirname, '..');
  const state = JSON.parse(fs.readFileSync(path.join(root, 'data/editorial-schedule.json'), 'utf8'));
  const allSlugs = state.initialBatch.slugs;
  assert.equal(allSlugs.length, 20);
  assert.equal(new Set(allSlugs).size, 20);
  const categories = require('../config/editorial').GUIDE_CATEGORIES.map(item => item.slug);
  const titles = new Set();
  const publishedSlugs = require('../lib/posts').getPosts().map(post => post.slug);
  for (const slug of allSlugs) {
    const { data, content } = matter.read(path.join(root, 'content/posts', `${slug}.md`));
    assert.equal(data.draft, false, slug);
    assert.ok(data.title && data.excerpt && data.featuredImageAlt, slug);
    assert.ok(fs.existsSync(path.join(root, 'public', data.featuredImage)), slug);
    assert.ok(data.sources.some(source => source.startsWith('https://www.dg97.se/')), slug);
    assert.ok(categories.includes(data.category), slug);
    assert.ok(content.trim().split(/\s+/).length >= 250, slug);
    assert.match(content, /https:\/\/www\.dg97\.se\//, slug);
    assert.doesNotMatch(content, /\b\d[\d\s.,]*\s*(?:kr|SEK)\b/, slug);
    assert.ok(publishedSlugs.includes(slug), slug);
    titles.add(data.title);
  }
  assert.equal(titles.size, 20);
});

test('published guides keep the site-wide price ban except the dated DG97 worked example', () => {
  const { PRICE_ALLOWED_SLUGS } = require('../config/site');
  const root = path.resolve(__dirname, '..');
  const { getPosts } = require('../lib/posts');
  for (const post of getPosts()) {
    const { content } = matter.read(path.join(root, 'content/posts', `${post.slug}.md`));
    if (PRICE_ALLOWED_SLUGS.includes(post.slug)) {
      assert.match(content, /Exempel: så räknar DG97 \(oktober 2026\)/, post.slug);
      assert.match(content, /1 200 kr\/kvm\/mån exkl\. moms/, post.slug);
      assert.match(content, /exkl\. moms/, post.slug);
      assert.match(content, /\/lediga-rum/, post.slug);
    } else {
      assert.doesNotMatch(content, /\b\d[\d\s.,]*\s*(?:kr|SEK)\b/, post.slug);
    }
  }
});

test('related guides exclude the current article, stay public and prefer the same topic', () => {
  const { getPosts, getRelatedPosts } = require('../lib/posts');
  const posts = getPosts();
  for (const post of posts) {
    const related = getRelatedPosts(post.slug);
    assert.equal(related.length, 3);
    assert.ok(related.every(item => item.slug !== post.slug && item.category === post.category));
    assert.ok(related.every(item => posts.some(candidate => candidate.slug === item.slug)));
  }
  assert.deepEqual(getRelatedPosts('missing-guide'), []);
});

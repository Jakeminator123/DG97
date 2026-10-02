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
function fixture(t, nextReleaseDate = addDays(-10)) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dg97-release-test-'));
  t.after(() => {
    assert.equal(path.dirname(directory), path.resolve(os.tmpdir()));
    assert.ok(path.basename(directory).startsWith('dg97-release-test-'));
    fs.rmSync(directory, { recursive: true, force: true });
  });
  for (const subdir of ['data', 'content/posts', 'public/images']) {
    fs.mkdirSync(path.join(directory, subdir), { recursive: true });
  }
  const statePath = path.join(directory, 'data/editorial-schedule.json');
  const state = { version: 2, mode: 'publish', timezone: 'Europe/Stockholm',
    nextReleaseDate, queue: ['first-guide', 'second-guide'], released: [] };
  fs.writeFileSync(statePath, JSON.stringify(state));
  fs.writeFileSync(path.join(directory, 'public/images/office.jpg'), 'image fixture');
  const articlePath = slug => path.join(directory, 'content/posts', `${slug}.md`);
  for (const slug of state.queue) {
    fs.writeFileSync(articlePath(slug), matter.stringify('Praktiska råd för teamets vardag. '.repeat(60), {
      title: slug, excerpt: 'An editorial test article', author: 'DG97 Kontorsguiden',
      date: '2026-01-01', draft: true, featuredImage: '/images/office.jpg',
      featuredImageAlt: 'A real office', sources: ['https://www.dg97.se/kontakt/'],
    }));
  }
  return { statePath, articlePath, directory,
    run: command => spawnSync(process.execPath, [script, command], { cwd: directory, encoding: 'utf8' }),
    readState: () => JSON.parse(fs.readFileSync(statePath, 'utf8')) };
}

test('a future release leaves every article and the queue untouched', t => {
  const f = fixture(t, addDays(2));
  const before = fs.readFileSync(f.statePath, 'utf8');
  assert.equal(JSON.parse(f.run('status').stdout).due, false);
  assert.equal(JSON.parse(f.run('release').stdout).published, false);
  assert.equal(fs.readFileSync(f.statePath, 'utf8'), before);
  assert.equal(matter.read(f.articlePath('first-guide')).data.draft, true);
});

test('an overdue queue releases one article, records the real date and waits another 4-6 days', t => {
  const f = fixture(t);
  const result = f.run('release');
  assert.equal(result.status, 0, result.stderr);
  const release = JSON.parse(result.stdout);
  assert.equal(release.published, true);
  assert.equal(release.recovered, false);
  const state = f.readState();
  assert.deepEqual(state.queue, ['second-guide']);
  assert.deepEqual(state.released, [{ slug: 'first-guide', date: today }]);
  assert.ok([4, 5, 6].includes(state.intervalDays));
  assert.equal(state.nextReleaseDate, addDays(state.intervalDays));
  const article = matter.read(f.articlePath('first-guide')).data;
  assert.equal(article.draft, false);
  assert.equal(article.date, today);
  assert.equal(article.modifiedDate, today);
  assert.equal(matter.read(f.articlePath('second-guide')).data.draft, true);
  assert.equal(JSON.parse(f.run('release').stdout).published, false);
  assert.deepEqual(f.readState(), state);
});

test('an incomplete article cannot advance the schedule or become public', t => {
  const f = fixture(t);
  fs.unlinkSync(path.join(f.directory, 'public/images/office.jpg'));
  const before = f.readState();
  assert.notEqual(f.run('release').status, 0);
  assert.deepEqual(f.readState(), before);
  assert.equal(matter.read(f.articlePath('first-guide')).data.draft, true);
});

test('an interrupted release recovers the same article without releasing the following one', t => {
  const f = fixture(t);
  const article = matter.read(f.articlePath('first-guide'));
  fs.writeFileSync(f.articlePath('first-guide'), matter.stringify(article.content,
    { ...article.data, draft: false, date: today, modifiedDate: today }));
  const result = f.run('release');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).recovered, true);
  assert.deepEqual(f.readState().queue, ['second-guide']);
  assert.equal(matter.read(f.articlePath('second-guide')).data.draft, true);
});

test('the last release completes the batch and later runs make no changes', t => {
  const f = fixture(t);
  fs.writeFileSync(f.statePath, JSON.stringify({ ...f.readState(), queue: ['first-guide'] }));
  assert.equal(f.run('release').status, 0);
  const state = f.readState();
  assert.equal(state.nextReleaseDate, null);
  assert.equal(state.intervalDays, null);
  assert.equal(JSON.parse(f.run('status').stdout).complete, true);
  assert.equal(JSON.parse(f.run('release').stdout).published, false);
  assert.deepEqual(f.readState(), state);
});

test('duplicate or unsafe queue entries fail before files are changed', t => {
  const f = fixture(t);
  const state = f.readState();
  for (const queue of [['first-guide', 'first-guide'], ['../outside']]) {
    fs.writeFileSync(f.statePath, JSON.stringify({ ...state, queue }));
    assert.notEqual(f.run('release').status, 0);
    assert.equal(matter.read(f.articlePath('first-guide')).data.draft, true);
  }
});

test('the real twenty-article batch has images, sources and the correct publication visibility', () => {
  const root = path.resolve(__dirname, '..');
  const state = JSON.parse(fs.readFileSync(path.join(root, 'data/editorial-schedule.json'), 'utf8'));
  const allSlugs = [...state.queue, ...state.released.map(item => item.slug)];
  assert.equal(allSlugs.length, 20);
  assert.equal(new Set(allSlugs).size, 20);
  const titles = new Set();
  for (const slug of allSlugs) {
    const { data, content } = matter.read(path.join(root, 'content/posts', `${slug}.md`));
    assert.equal(data.draft, state.queue.includes(slug), slug);
    assert.ok(data.title && data.excerpt && data.featuredImageAlt, slug);
    assert.ok(fs.existsSync(path.join(root, 'public', data.featuredImage)), slug);
    assert.ok(data.sources.some(source => source.startsWith('https://www.dg97.se/')), slug);
    assert.ok(content.trim().split(/\s+/).length >= 250, slug);
    assert.match(content, /https:\/\/www\.dg97\.se\//, slug);
    assert.doesNotMatch(content, /\b\d[\d\s.,]*\s*(?:kr|SEK)\b/, slug);
    titles.add(data.title);
  }
  assert.equal(titles.size, 20);
  const publishedSlugs = require('../lib/posts').getPosts().map(post => post.slug);
  for (const slug of state.queue) assert.ok(!publishedSlugs.includes(slug), slug);
  for (const item of state.released) assert.ok(publishedSlugs.includes(item.slug), item.slug);
});

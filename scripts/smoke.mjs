import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const port = 3107;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', String(port)], {
  env: { ...process.env, NODE_ENV: 'production', VERCEL: '1', ADMIN_USERNAME: 'smoke-admin', ADMIN_PASSWORD: 'smoke-password', ADMIN_SESSION_SECRET: 'smoke-only-secret-at-least-32-characters', GITHUB_TOKEN: '', OPENAI_API_KEY: '' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let output = '';
server.stdout.on('data', chunk => { output += chunk; });
server.stderr.on('data', chunk => { output += chunk; });
const post = (body, cookie) => ({ method: 'POST', headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) }, body: JSON.stringify(body) });
const draftSlug = 'hur-martin-som-ar-utvecklare-och-startat-ett-foretagapp-for-plantor-kan-vinna-2-miljarder-pa-internetspel';
const initialSlugs = JSON.parse(fs.readFileSync('data/editorial-schedule.json', 'utf8')).initialBatch.slugs;
const { getRelatedPosts } = createRequire(import.meta.url)('../lib/posts');
function checkGuide(html, path) {
  assert.match(html, /DG97 Kontorsguiden/, `${path} guide identity`);
  assert.match(html, /href="https:\/\/www\.dg97\.se(?:\/|"|\?)/, `${path} main-site link`);
  assert.match(html, /href="https:\/\/sajtmaskin\.se\/"/, `${path} site credit`);
  assert.doesNotMatch(html, /\b\d[\d\s.,]*\s*(?:kr|SEK)\b/, `${path} no fixed prices`);
  assert.doesNotMatch(html, /agendo_loader|data-profile-id/, `${path} no separate booking integration`);
  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  assert.ok(schemas.some(schema => schema['@type'] === 'WebSite' && schema.url === 'https://www.dg97.org'), `${path} guide website schema`);
  assert.doesNotMatch(JSON.stringify(schemas), /"(?:price|priceRange|aggregateRating|reviewCount|review|hasOfferCatalog)"|ReservationConfirmed|SearchAction/, `${path} no unsupported business claims`);
}

try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error(output);
    if (output.includes('Ready in')) { ready = true; break; }
    await delay(500);
  }
  assert.ok(ready, 'Production server must start');
  for (const path of ['/', '/om-oss', '/vara-foretag', '/galleri', '/fragor-och-svar', '/blogg', '/kontakt', '/colocate', '/foretagsportal', '/admin']) {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /https:\/\/www\.dg97\.org/, `${path} canonical domain`);
    if (['/admin', '/foretagsportal'].includes(path)) assert.match(html, /noindex, nofollow/);
    if (!['/admin', '/foretagsportal'].includes(path)) checkGuide(html, path);
    if (path === '/kontakt') {
      assert.match(html, /href="https:\/\/www\.dg97\.se\/kontakt\/"/);
      assert.doesNotMatch(html, /<form\b/, 'Enquiries go to the main site');
    }
    if (path === '/blogg') {
      assert.match(html, /Sök bland guiderna/);
      assert.match(html, /Välj ämne/);
      for (const slug of initialSlugs) assert.ok(html.includes(`/blogg/${slug}`), `${slug} listed in the guide index`);
    }
    console.log(`OK ${path}`);
  }
  const list = await fetch(`${base}/api/posts`).then(r => r.json());
  assert.ok(Array.isArray(list) && list.length > 0);
  assert.ok(!list.some(post => post.slug === draftSlug), 'Drafts are excluded from the public post list');
  const image = await fetch(`${base}/_next/image?url=%2Fimages%2Foffice_room.jpg&w=64&q=75`);
  assert.equal(image.status, 200, 'Image optimization must work after the sharp upgrade');
  assert.match(image.headers.get('content-type'), /image\//);
  for (const post of list) {
    const response = await fetch(`${base}/blogg/${post.slug}`);
    assert.equal(response.status, 200, post.slug);
    const html = await response.text();
    checkGuide(html, `/blogg/${post.slug}`);
    assert.match(html, /<figure/, `${post.slug} visible article image`);
    assert.match(html, /Läs vidare på samma tema/, `${post.slug} related guides`);
    assert.match(html, /utm_source=dg97\.org/, `${post.slug} attributable main-site links`);
    for (const related of getRelatedPosts(post.slug)) {
      assert.ok(html.includes(`/blogg/${related.slug}`), `${post.slug} links to ${related.slug}`);
    }
  }
  assert.equal((await fetch(`${base}/blogg/${draftSlug}`)).status, 404, 'Draft page is unpublished');
  assert.equal((await fetch(`${base}/api/posts/${draftSlug}`)).status, 404, 'Draft API is unpublished');
  const sitemap = await fetch(`${base}/sitemap-0.xml`).then(response => response.text());
  assert.doesNotMatch(sitemap, new RegExp(draftSlug), 'Drafts are excluded from the sitemap');
  for (const slug of initialSlugs) {
    assert.ok(list.some(post => post.slug === slug), `${slug} initial article is published`);
    assert.equal((await fetch(`${base}/api/posts/${slug}`)).status, 200, `${slug} public API`);
    assert.ok(sitemap.includes(`/blogg/${slug}</loc>`), `${slug} sitemap`);
  }
  assert.equal((await fetch(`${base}/blogg/this-post-does-not-exist`)).status, 404);
  assert.equal((await fetch(`${base}/api/posts`, post({}))).status, 405);
  assert.equal((await fetch(`${base}/api/contact`, post({}))).status, 503);
  assert.equal((await fetch(`${base}/api/newsletter/subscribe`, post({ email: 'test@example.org' }))).status, 503);
  assert.equal((await fetch(`${base}/api/posts/create`, post({}))).status, 401);
  const forged = `admin_token=${Buffer.from('smoke-admin:1').toString('base64')}`;
  assert.equal((await fetch(`${base}/api/admin/blog`, { headers: { Cookie: forged } })).status, 401);
  assert.equal((await fetch(`${base}/api/admin/auth`, post({ username: 'smoke-admin', password: 'wrong' }))).status, 401);
  const login = await fetch(`${base}/api/admin/auth`, post({ username: 'smoke-admin', password: 'smoke-password' }));
  assert.equal(login.status, 200);
  const setCookie = login.headers.get('set-cookie');
  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /Secure/);
  const cookie = setCookie.split(';')[0];
  assert.equal((await fetch(`${base}/api/admin/auth`, { headers: { Cookie: cookie } }).then(r => r.json())).authenticated, true);
  assert.equal((await fetch(`${base}/api/admin/blog`, { headers: { Cookie: cookie } })).status, 200);
  assert.equal((await fetch(`${base}/api/admin/blog?slug=..%2F..%2Fpackage`, { headers: { Cookie: cookie } })).status, 400);
  for (const path of ['blog', 'scheduler', 'scheduler/run', 'generate', 'content', 'images', 'newsletter']) {
    assert.equal((await fetch(`${base}/api/admin/${path}`, post({}, cookie))).status, 503, path);
  }
  assert.equal((await fetch(`${base}/api/posts/create`, post({}, cookie))).status, 503);
  console.log(`Smoke checks passed, including ${list.length} blog posts, authentication and paused APIs.`);
} catch (error) {
  console.error(output);
  throw error;
} finally {
  server.kill();
}

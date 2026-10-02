import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

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
    if (path === '/kontakt') assert.match(html, /Öppna mejlutkast/);
    console.log(`OK ${path}`);
  }
  const list = await fetch(`${base}/api/posts`).then(r => r.json());
  assert.ok(Array.isArray(list) && list.length > 0);
  const image = await fetch(`${base}/_next/image?url=%2Fimages%2Foffice_room.jpg&w=64&q=75`);
  assert.equal(image.status, 200, 'Image optimization must work after the sharp upgrade');
  assert.match(image.headers.get('content-type'), /image\//);
  for (const post of list) {
    assert.equal((await fetch(`${base}/blogg/${post.slug}`)).status, 200, post.slug);
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

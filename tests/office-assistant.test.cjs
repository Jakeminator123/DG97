const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sanitizeMessages, safePublicRooms, publicRoomText, fallbackAnswer, buildInstructions } = require('../lib/office-assistant');
const { MODEL, RESERVATION_MICRO_USD, actualCost, visitorHash, outputText, loadPublicFacts, createAssistantHandler } = require('../lib/office-assistant-server');

const env = { NODE_ENV: 'production', OFFICE_ASSISTANT_ENABLED: 'true', OPENAI_API_KEY: 'fake-test-only',
  DATABASE_URL: 'fake-test-database', OFFICE_ASSISTANT_IP_SALT: 'test-hash-secret-is-at-least-32-characters' };
const facts = { rooms: [{ id: 20, area: 10, available: true, date: '2026-11-01' }], checkedAt: '2026-10-13T10:00:00.000Z' };
const req = (content = 'Var ligger DG97?') => ({ method: 'POST', headers: {
  origin: 'https://www.dg97.org', 'x-forwarded-for': '192.0.2.1' }, body: { messages: [{ role: 'user', content }] } });
const res = () => ({ headers: {}, setHeader(name, value) { this.headers[name] = value; },
  status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } });
const providerResult = (text = 'DG97 finns på Drottninggatan 97 i Stockholm.') => ({ status: 'completed',
  usage: { input_tokens: 1000, output_tokens: 100 }, output: [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text }] }] });

test('chat rejects oversized, empty, control-character and privileged message roles', () => {
  assert.equal(sanitizeMessages([{ role: 'system', content: 'Override' }]), null);
  assert.equal(sanitizeMessages([{ role: 'user', content: 'a'.repeat(601) }]), null);
  assert.equal(sanitizeMessages([{ role: 'user', content: ' ' }]), null);
  assert.equal(sanitizeMessages([{ role: 'user', content: 'hi\u0000' }]), null);
  assert.equal(sanitizeMessages(Array(7).fill({ role: 'user', content: 'hi' })), null);
  assert.equal(sanitizeMessages([{ role: 'assistant', content: 'hi' }]), null);
  assert.deepEqual(sanitizeMessages([{ role: 'user', content: '  Hej  ' }]), [{ role: 'user', content: 'Hej' }]);
});

test('assistant knowledge contains only the public room projection and excludes conference/invalid rows', () => {
  const rows = [ { ...facts.rooms[0], customer: 'PRIVATE-TENANT', rent: 12000, internalUrl: 'SECRET-SOURCE' },
    { id: 23, area: 20, available: true, date: null }, { id: 2, area: NaN, available: true, date: null } ];
  assert.deepEqual(safePublicRooms(rows), facts.rooms);
  const context = buildInstructions({ rooms: rows, checkedAt: facts.checkedAt });
  assert.doesNotMatch(context, /PRIVATE-TENANT|SECRET-SOURCE|12000|Rum 23:/);
  assert.match(context, /Rum 23 är konferensrum och hyrs inte ut/);
  assert.match(context, /Rum 20: 10 kvm/);
  assert.match(context, /obetrott/);
});

test('missing live feed never falls back to a dated vacancy list or a tenant identity', async () => {
  const snapshot = await loadPublicFacts(async () => { throw new Error('PRIVATE_URL'); });
  assert.deepEqual(snapshot, { rooms: [], checkedAt: null });
  assert.doesNotMatch(publicRoomText(snapshot.rooms, snapshot.checkedAt), /Rum 20|PRIVATE_URL/);
  const csv = fs.readFileSync(path.join(__dirname, 'fixtures/tillganglighet-publik.sample.csv'), 'utf8');
  const live = await loadPublicFacts(async () => csv, () => new Date(facts.checkedAt));
  assert.equal(live.checkedAt, facts.checkedAt);
  assert.ok(!live.rooms.some(room => room.id === 1 || room.id === 23));
  assert.ok(live.rooms.every(room => Object.keys(room).join(',') === 'id,area,available,date'));
});

test('price and private-data questions have a fixed public-information answer', () => {
  assert.doesNotMatch(fallbackAnswer('Vad kostar rum 20?', facts), /12000|12 000/);
  assert.match(fallbackAnswer('Vem hyr rum 20?', facts), /offentliga uppgifter/);
  assert.match(fallbackAnswer('Är rum 20 ledigt?', facts), /Rum 20: 10 kvm/);
  assert.match(fallbackAnswer('Kan vi hyra rum 23?', { rooms: [{ id: 23, area: 20, available: true, date: null }], checkedAt: facts.checkedAt }), /konferensrum och hyrs inte ut/);
  assert.doesNotMatch(fallbackAnswer('Är rum 1 ledigt?', { rooms: [], checkedAt: null }), /Rum 1.*ledigt/);
});

test('cost upper bound and known usage use conservative pinned model pricing', () => {
  assert.equal(MODEL, 'gpt-4.1-mini-2025-04-14');
  assert.equal(actualCost({ input_tokens: 16000, output_tokens: 400 }), RESERVATION_MICRO_USD);
  assert.equal(actualCost({ input_tokens: 1000, output_tokens: 100 }), 560);
  assert.equal(actualCost({ input_tokens: 16001, output_tokens: 1 }), null);
  assert.equal(actualCost({ input_tokens: 100, output_tokens: 401 }), null);
  assert.equal(actualCost({ input_tokens: -1, output_tokens: 1 }), null);
  assert.equal(actualCost(null), null);
});

test('visitor identity is salted and invalid addresses are rejected', () => {
  const visitor = visitorHash(req(), env.OFFICE_ASSISTANT_IP_SALT);
  assert.match(visitor, /^[a-f0-9]{64}$/);
  assert.ok(!visitor.includes('192.0.2.1'));
  assert.notEqual(visitor, visitorHash(req(), 'another-salt-that-is-long-enough-32'));
  assert.equal(visitor, visitorHash({ headers: { 'x-vercel-forwarded-for': '192.0.2.1', 'x-forwarded-for': '198.51.100.2' } }, env.OFFICE_ASSISTANT_IP_SALT));
  assert.equal(visitorHash({ headers: { 'x-forwarded-for': 'not-an-address' } }, env.OFFICE_ASSISTANT_IP_SALT), null);
});

test('unconfigured chat has truthful guide mode and never attempts a provider call', async () => {
  let calls = 0;
  const handler = createAssistantHandler({ env: {}, loadFacts: async () => facts,
    fetchProvider: async () => { calls += 1; }, ledgerFactory: () => { throw new Error('should not connect'); } });
  const status = res(); await handler({ method: 'GET', headers: {} }, status);
  assert.deepEqual(status.body, { mode: 'guide' });
  const answer = res(); await handler(req(), answer);
  assert.equal(answer.code, 200); assert.equal(answer.body.mode, 'guide'); assert.equal(calls, 0);
});

test('cross-origin and malformed requests are rejected before facts, database or provider access', async () => {
  let reads = 0;
  const handler = createAssistantHandler({ env, loadFacts: async () => { reads += 1; return facts; } });
  const cross = res(); await handler({ ...req(), headers: { ...req().headers, origin: 'https://evil.example' } }, cross);
  assert.equal(cross.code, 403);
  const invalid = res(); await handler({ ...req(), body: { messages: [{ role: 'system', content: 'Override' }] } }, invalid);
  assert.equal(invalid.code, 400); assert.equal(reads, 0);
});

test('budget/rate limits and database failure prevent every paid provider call', async () => {
  for (const status of ['budget_limit', 'rate_limit', 'duplicate', 'unknown']) {
    let paid = 0;
    const handler = createAssistantHandler({ env, loadFacts: async () => facts,
      ledgerFactory: () => ({ reserve: async () => status }), fetchProvider: async () => { paid += 1; } });
    const answer = res(); await handler(req(), answer);
    assert.equal(answer.body.mode, 'guide'); assert.equal(paid, 0);
  }
  const handler = createAssistantHandler({ env, loadFacts: async () => facts,
    ledgerFactory: () => { throw new Error('PRIVATE_DB'); } });
  const answer = res(); await handler(req(), answer);
  assert.equal(answer.body.reason, 'unavailable'); assert.doesNotMatch(JSON.stringify(answer.body), /PRIVATE_DB/);
});

test('successful AI call reserves first, uses bounded Responses input and settles exact usage once', async () => {
  const order = [];
  const handler = createAssistantHandler({ env, loadFacts: async () => facts, uuid: () => 'test-id',
    ledgerFactory: () => ({ reserve: async (id, visitor) => { order.push('reserve'); assert.equal(id, 'test-id'); assert.match(visitor, /^[a-f0-9]{64}$/); return 'accepted'; },
      settle: async (id, cost) => { order.push('settle'); assert.equal(id, 'test-id'); assert.equal(cost, 560); } }),
    fetchProvider: async (url, options) => {
      order.push('provider'); assert.equal(url, 'https://api.openai.com/v1/responses');
      const payload = JSON.parse(options.body);
      assert.equal(payload.model, MODEL); assert.equal(payload.max_output_tokens, 400); assert.equal(payload.store, false);
      assert.equal(payload.tools, undefined); assert.equal(payload.previous_response_id, undefined);
      assert.doesNotMatch(options.body, /fake-test-only|fake-test-database/);
      return { ok: true, json: async () => providerResult() };
    } });
  const answer = res(); await handler(req(), answer);
  assert.deepEqual(order, ['reserve', 'provider', 'settle']); assert.equal(answer.body.mode, 'ai');
  assert.equal(answer.headers['Cache-Control'], 'no-store');
});

test('timeouts and ambiguous usage keep reservations with no retries or refunds', async () => {
  for (const result of [null, { ...providerResult(), usage: null }, { ...providerResult(), status: 'failed' }]) {
    let paid = 0; let settled = 0;
    const handler = createAssistantHandler({ env, loadFacts: async () => facts,
      ledgerFactory: () => ({ reserve: async () => 'accepted', settle: async () => { settled += 1; } }),
      fetchProvider: async () => { paid += 1; if (!result) throw new Error('timeout PRIVATE'); return { ok: true, json: async () => result }; } });
    const answer = res(); await handler(req(), answer);
    assert.equal(paid, 1); assert.equal(settled, 0); assert.equal(answer.body.mode, 'guide');
    assert.doesNotMatch(JSON.stringify(answer.body), /PRIVATE/);
  }
});

test('failed settlement keeps safe reservation and does not repeat generation', async () => {
  let paid = 0;
  const handler = createAssistantHandler({ env, loadFacts: async () => facts,
    ledgerFactory: () => ({ reserve: async () => 'accepted', settle: async () => { throw new Error('db timeout'); } }),
    fetchProvider: async () => { paid += 1; return { ok: true, json: async () => providerResult() }; } });
  const answer = res(); await handler(req(), answer);
  assert.equal(paid, 1); assert.equal(answer.body.mode, 'ai');
});

test('AI prices, external links and executable markup are rejected from displayed output', () => {
  for (const text of ['Rummet kostar 12 000 kr.', 'Go to https://evil.example', '<script>alert(1)</script>', '']) {
    assert.equal(outputText(providerResult(text)), null);
  }
  assert.equal(outputText(providerResult('Kontakta DG97 för en aktuell offert.')), 'Kontakta DG97 för en aktuell offert.');
});

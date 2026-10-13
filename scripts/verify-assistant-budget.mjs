import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const TEST_BRANCH_ID = 'br-raspy-frost-ba4f7yt6';
const TEST_HOST = 'ep-wild-pine-basdabwj-pooler.c-8.eu-central-1.aws.neon.tech';
const MONTHLY_CAP = 5000000;
const RESERVATION = 7040;
const normalizedHost = host => host.toLowerCase().replace('-pooler.', '.');

// The destination is baked into this verifier, not selected from DATABASE_URL.
// A caller cannot opt into a production host by changing an expected-host flag.
export function validateTestDatabase(env) {
  if (!env.DG97_TEST_DATABASE_URL) throw new Error('DG97_TEST_DATABASE_URL is required.');
  let url;
  try { url = new URL(env.DG97_TEST_DATABASE_URL); } catch { throw new Error('Invalid test database URL.'); }
  if (!['postgres:', 'postgresql:'].includes(url.protocol) || normalizedHost(url.hostname) !== normalizedHost(TEST_HOST)) {
    throw new Error('Refusing to access any database except the dedicated DG97 test branch.');
  }
  if (env.DG97_TEST_BRANCH_ID && env.DG97_TEST_BRANCH_ID !== TEST_BRANCH_ID) throw new Error('The supplied test branch ID does not match.');
  if (env.DG97_TEST_EXPECTED_HOST && normalizedHost(env.DG97_TEST_EXPECTED_HOST) !== normalizedHost(TEST_HOST)) throw new Error('The supplied expected host does not match.');
  if (env.DATABASE_URL) {
    let main;
    try { main = new URL(env.DATABASE_URL); } catch { throw new Error('Invalid primary database URL.'); }
    if (normalizedHost(main.hostname) === normalizedHost(url.hostname)) throw new Error('The test and primary database hosts must differ.');
  }
  return env.DG97_TEST_DATABASE_URL;
}

// SQL-aware splitter: PL/pgSQL $$ bodies, quoted identifiers/literals and comments
// remain intact. Every statement is then applied in one Neon HTTP transaction.
export function splitSqlStatements(source) {
  const statements = [];
  let start = 0;
  let quote = null;
  let dollar = null;
  let lineComment = false;
  let blockDepth = 0;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) { if (char === '\n') lineComment = false; continue; }
    if (blockDepth) {
      if (char === '/' && next === '*') { blockDepth += 1; index += 1; }
      else if (char === '*' && next === '/') { blockDepth -= 1; index += 1; }
      continue;
    }
    if (dollar) {
      if (source.startsWith(dollar, index)) { index += dollar.length - 1; dollar = null; }
      continue;
    }
    if (quote) {
      if (char === quote) {
        if (next === quote) index += 1;
        else quote = null;
      }
      continue;
    }
    if (char === '-' && next === '-') { lineComment = true; index += 1; continue; }
    if (char === '/' && next === '*') { blockDepth = 1; index += 1; continue; }
    if (char === "'" || char === '"') { quote = char; continue; }
    if (char === '$') {
      const tag = source.slice(index).match(/^\$(?:[A-Za-z_][A-Za-z_0-9]*)?\$/)?.[0];
      if (tag) { dollar = tag; index += tag.length - 1; continue; }
    }
    if (char === ';') {
      const statement = source.slice(start, index + 1).trim();
      if (statement) statements.push(statement);
      start = index + 1;
    }
  }
  if (quote || dollar || blockDepth) throw new Error('Unterminated SQL literal or comment.');
  const tail = source.slice(start).trim();
  if (tail && !/^(?:--[^\n]*(?:\n|$)|\s)*$/.test(tail)) statements.push(tail);
  return statements;
}

function assert(value, message) { if (!value) throw new Error(message); }

export async function verifyAssistantBudget(env = process.env) {
  const connection = validateTestDatabase(env);
  const sql = neon(connection, { fetchOptions: { signal: AbortSignal.timeout(30000) } });
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  let phase = 'apply-isolated-schema';
  try {
    const migration = splitSqlStatements(fs.readFileSync(path.join(root, 'db/office-assistant.sql'), 'utf8'));
    await sql.transaction(migration.map(statement => sql.query(statement)));
    phase = 'transaction-rollback-assertions';
    const marker = `DG97_ROLLBACK_OK_${randomUUID().replaceAll('-', '')}`;
    const capId = randomUUID();
    const blockedId = randomUUID();
    const capVisitor = randomBytes(32).toString('hex');
    const rateVisitor = randomBytes(32).toString('hex');
    const rateIds = Array.from({ length: 25 }, () => randomUUID());
    // This entire DO statement rolls back by raising a unique success marker.
    // Assertions run inside a real DB transaction and never leave rate fixtures.
    const rollbackSql = `DO $dg97verify$
      DECLARE m text := to_char(CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Stockholm', 'YYYY-MM');
        s text; total bigint; i integer; ids uuid[] := ARRAY[${rateIds.map(id => `'${id}'`).join(',')}]::uuid[];
      BEGIN
        INSERT INTO public.dg97_assistant_months(month) VALUES(m) ON CONFLICT DO NOTHING;
        UPDATE public.dg97_assistant_months SET reserved_micro_usd = ${MONTHLY_CAP - RESERVATION} WHERE month=m;
        s := public.dg97_assistant_reserve('${capId}', '${capVisitor}');
        IF s <> 'accepted' THEN RAISE EXCEPTION 'DG97_ASSERT_first_reservation'; END IF;
        s := public.dg97_assistant_reserve('${capId}', '${capVisitor}');
        IF s <> 'duplicate' THEN RAISE EXCEPTION 'DG97_ASSERT_duplicate_reservation'; END IF;
        s := public.dg97_assistant_reserve('${blockedId}', '${capVisitor}');
        IF s <> 'budget_limit' THEN RAISE EXCEPTION 'DG97_ASSERT_monthly_cap'; END IF;
        IF public.dg97_assistant_settle('${capId}', 560) IS DISTINCT FROM true THEN RAISE EXCEPTION 'DG97_ASSERT_settlement'; END IF;
        IF public.dg97_assistant_settle('${capId}', 0) IS DISTINCT FROM false THEN RAISE EXCEPTION 'DG97_ASSERT_idempotent_settlement'; END IF;
        SELECT reserved_micro_usd INTO total FROM public.dg97_assistant_months WHERE month=m;
        IF total <> ${MONTHLY_CAP - RESERVATION + 560} THEN RAISE EXCEPTION 'DG97_ASSERT_exact_refund'; END IF;
        UPDATE public.dg97_assistant_months SET reserved_micro_usd = 0 WHERE month=m;
        FOR i IN 1..24 LOOP
          s := public.dg97_assistant_reserve(ids[i], '${rateVisitor}');
          IF s <> 'accepted' THEN RAISE EXCEPTION 'DG97_ASSERT_rate_first_24'; END IF;
        END LOOP;
        s := public.dg97_assistant_reserve(ids[25], '${rateVisitor}');
        IF s <> 'rate_limit' THEN RAISE EXCEPTION 'DG97_ASSERT_rate_25th'; END IF;
        RAISE EXCEPTION '${marker}' USING ERRCODE = 'P0001';
      END $dg97verify$;`;
    let rolledBack = false;
    try { await sql.query(rollbackSql); }
    catch (error) {
      if (error.code === 'P0001' && error.message === marker) rolledBack = true;
      else if (error.message?.startsWith('DG97_ASSERT_')) throw new Error(error.message);
      else throw new Error('Rollback assertion transaction failed.');
    }
    assert(rolledBack, 'Rollback success marker was missing.');
    const leftovers = await sql`SELECT count(*)::integer AS n FROM public.dg97_assistant_requests
      WHERE id = ${capId}::uuid OR visitor_hash = ${rateVisitor}`;
    assert(leftovers[0].n === 0, 'Rollback assertions left unexpected fixtures.');

    phase = 'concurrent-http-reservations';
    const baselineRows = await sql`SELECT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Stockholm', 'YYYY-MM') AS month,
      (SELECT reserved_micro_usd FROM public.dg97_assistant_months
        WHERE month = to_char(CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Stockholm', 'YYYY-MM')) AS total,
      (SELECT count(*)::integer FROM public.dg97_assistant_requests) AS requests`;
    const baseline = baselineRows[0];
    const raceIds = [randomUUID(), randomUUID()];
    const raceVisitor = randomBytes(32).toString('hex');
    // Commit only synthetic cost fixtures on this disposable, baked-in branch.
    // No chat text/provider call and no destructive SQL or row deletion.
    await sql`INSERT INTO public.dg97_assistant_months(month, reserved_micro_usd)
      VALUES(${baseline.month}, ${MONTHLY_CAP - RESERVATION})
      ON CONFLICT(month) DO UPDATE SET reserved_micro_usd = EXCLUDED.reserved_micro_usd`;
    let outcomeError = null;
    let retained = 0;
    try {
      const attempts = await Promise.allSettled(raceIds.map(id => {
        // Separate neon clients and HTTP requests, rather than one batch transaction.
        const session = neon(connection);
        return session`SELECT public.dg97_assistant_reserve(${id}::uuid, ${raceVisitor}) AS status`;
      }));
      const statuses = attempts.map(attempt => attempt.status === 'fulfilled' ? attempt.value[0]?.status : 'error').sort();
      assert(JSON.stringify(statuses) === JSON.stringify(['accepted', 'budget_limit']), 'Concurrent monthly cap was not exactly one accepted / one blocked.');
      const budget = await sql`SELECT reserved_micro_usd FROM public.dg97_assistant_months WHERE month=${baseline.month}`;
      assert(Number(budget[0].reserved_micro_usd) === MONTHLY_CAP, 'Concurrent reservations did not stop at the exact cap.');
    } catch (error) { outcomeError = error; }
    finally {
      phase = 'restore-test-budget-without-deletion';
      const fixtures = await sql`SELECT id FROM public.dg97_assistant_requests WHERE id = ANY(${raceIds}::uuid[])`;
      retained = fixtures.length;
      for (const fixture of fixtures) await sql`SELECT public.dg97_assistant_settle(${fixture.id}::uuid, 0)`;
      const count = await sql`SELECT count(*)::integer AS n FROM public.dg97_assistant_requests`;
      assert(count[0].n === baseline.requests + retained, 'Other test-branch traffic appeared; refusing to overwrite its budget.');
      // Restore the original amount; keep zero-cost audit fixtures on the test branch.
      await sql`UPDATE public.dg97_assistant_months SET reserved_micro_usd = ${Number(baseline.total || 0)} WHERE month=${baseline.month}`;
    }
    if (outcomeError) throw outcomeError;
    return { status: 'passed', branchId: TEST_BRANCH_ID, checks: [
      'monthly-cap', 'duplicate-reservation', 'idempotent-settlement', 'exact-refund',
      '24-per-rolling-day', 'transaction-rollback', 'concurrent-http-cap',
    ], retainedZeroCostTestFixtures: retained };
  } catch (error) {
    // Keep connection credentials and driver errors out of terminal logs.
    const safeMessage = error.message?.startsWith('DG97_ASSERT_') || error.message?.includes('Concurrent')
      || error.message?.includes('test-branch') || error.message?.includes('Rollback') ? error.message : 'Database verification did not complete.';
    throw new Error(`${phase}: ${safeMessage}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(await verifyAssistantBudget())); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}

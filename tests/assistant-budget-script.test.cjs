const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const script = import('../scripts/verify-assistant-budget.mjs');
const testHost = 'ep-wild-pine-basdabwj-pooler.c-8.eu-central-1.aws.neon.tech';

test('integration verifier accepts only its baked-in isolated branch host', async () => {
  const { validateTestDatabase } = await script;
  const url = `postgresql://fake:fake@${testHost}/neondb?sslmode=require`;
  assert.equal(validateTestDatabase({ DG97_TEST_DATABASE_URL: url }), url);
  assert.throws(() => validateTestDatabase({}), /required/);
  assert.throws(() => validateTestDatabase({ DG97_TEST_DATABASE_URL: 'postgresql://fake:fake@ep-flat-forest-bappjnyi-pooler.c-8.eu-central-1.aws.neon.tech/neondb', DG97_TEST_EXPECTED_HOST: testHost }), /Refusing/);
  assert.throws(() => validateTestDatabase({ DG97_TEST_DATABASE_URL: url, DATABASE_URL: url.replace('-pooler.', '.') }), /must differ/);
  assert.throws(() => validateTestDatabase({ DG97_TEST_DATABASE_URL: url, DG97_TEST_BRANCH_ID: 'production' }), /branch ID/);
});

test('migration splitter preserves PL/pgSQL bodies and quoted/comment semicolons', async () => {
  const { splitSqlStatements } = await script;
  const migration = fs.readFileSync(path.join(__dirname, '../db/office-assistant.sql'), 'utf8');
  const statements = splitSqlStatements(migration);
  assert.equal(statements.filter(statement => /CREATE OR REPLACE FUNCTION/.test(statement)).length, 2);
  assert.ok(statements.filter(statement => /CREATE OR REPLACE FUNCTION/.test(statement)).every(statement => /END \$\$;/.test(statement)));
  assert.deepEqual(splitSqlStatements("SELECT 'it''s; fine'; -- comment;\nSELECT 2;"), ["SELECT 'it''s; fine';", '-- comment;\nSELECT 2;']);
  assert.equal(splitSqlStatements('DO $body$ BEGIN PERFORM 1; END $body$; SELECT 1;').length, 2);
  assert.equal(splitSqlStatements('/* outer; /* nested; */ */ SELECT 1;').length, 1);
  assert.throws(() => splitSqlStatements('DO $$ BEGIN;'), /Unterminated/);
});

let sqlClient = null;

function getDatabaseUrl() {
  return process.env.DATABASE_URL || '';
}

function getSql() {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) return null;
  if (!sqlClient) {
    const { neon } = require('@neondatabase/serverless');
    sqlClient = neon(databaseUrl);
  }
  return sqlClient;
}

function isDatabaseConfigured() {
  return Boolean(getDatabaseUrl());
}

module.exports = { getSql, getDatabaseUrl, isDatabaseConfigured };

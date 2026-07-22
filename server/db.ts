import pg from 'pg';

const { Pool } = pg;

const rawUrl = process.env.DATABASE_URL || '';
// channel_binding can break some Node pg clients
const connectionString = rawUrl.replace(/&?channel_binding=require/, '');

export const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('sslmode=require') || connectionString.includes('neon.tech')
    ? { rejectUnauthorized: false }
    : undefined,
  max: 5,
});

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  return pool.query<T>(text, params);
}

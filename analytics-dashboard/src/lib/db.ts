import { Pool } from "pg";

let _pool: Pool | null = null;

export function getPool(): Pool {
  if (_pool) return _pool;
  const connectionString = process.env.DATABASE_URL;
  _pool = new Pool({
    connectionString: connectionString || "postgresql://kod1847@localhost:5432/kod1847",
    max: 5,
    idleTimeoutMillis: 30000,
  });
  return _pool;
}

export async function dbQuery<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]> {
  const res = await getPool().query(text, params);
  return res.rows as T[];
}

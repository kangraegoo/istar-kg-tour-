import { neon } from '@neondatabase/serverless'

function getSql() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')
  return neon(process.env.DATABASE_URL)
}

export async function initDB() {
  const sql = getSql()
  await sql`
    CREATE TABLE IF NOT EXISTS tour_applications (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      department TEXT DEFAULT '',
      meal_pref TEXT DEFAULT '',
      note TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS site_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `
  // 신규 컬럼 마이그레이션 (기존 테이블에 컬럼 추가)
  await sql`ALTER TABLE tour_applications ADD COLUMN IF NOT EXISTS english_name TEXT DEFAULT ''`
  await sql`ALTER TABLE tour_applications ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT ''`
  await sql`ALTER TABLE tour_applications ADD COLUMN IF NOT EXISTS passport_image TEXT DEFAULT ''`
}

export async function getConfig(key: string): Promise<string | null> {
  const sql = getSql()
  const rows = await sql`SELECT value FROM site_config WHERE key = ${key}`
  return rows[0]?.value ?? null
}

export async function setConfig(key: string, value: string) {
  const sql = getSql()
  await sql`
    INSERT INTO site_config (key, value, updated_at)
    VALUES (${key}, ${value}, NOW())
    ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = NOW()
  `
}

export async function deleteConfig(key: string) {
  const sql = getSql()
  await sql`DELETE FROM site_config WHERE key = ${key}`
}

export async function getAllConfig(): Promise<Record<string, string>> {
  const sql = getSql()
  const rows = await sql`SELECT key, value FROM site_config`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Object.fromEntries((rows as any[]).map(r => [r.key, r.value]))
}

import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

function sql() {
  return neon(process.env.DATABASE_URL!)
}

export async function POST(req: Request) {
  const { name, english_name, phone, gender, department, meal_pref, note, passport_image } = await req.json()
  if (!name?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: '이름과 연락처는 필수입니다.' }, { status: 400 })
  }
  const db = sql()
  const [row] = await db`
    INSERT INTO tour_applications (name, english_name, phone, gender, department, meal_pref, note, passport_image)
    VALUES (
      ${name.trim()},
      ${english_name ?? ''},
      ${phone.trim()},
      ${gender ?? ''},
      ${department ?? ''},
      ${meal_pref ?? ''},
      ${note ?? ''},
      ${passport_image ?? ''}
    )
    RETURNING id
  `
  return NextResponse.json({ ok: true, id: row.id })
}

export async function GET() {
  const db = sql()
  const rows = await db`SELECT * FROM tour_applications ORDER BY created_at DESC`
  return NextResponse.json(rows)
}

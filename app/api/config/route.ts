import { NextResponse } from 'next/server'
import { getAllConfig, setConfig, deleteConfig } from '@/lib/db'

export async function GET() {
  const config = await getAllConfig()
  return NextResponse.json(config)
}

export async function POST(req: Request) {
  const { key, value } = await req.json()
  if (!key || !value) return NextResponse.json({ error: 'key and value required' }, { status: 400 })
  await setConfig(key, value)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const { key } = await req.json()
  if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 })
  await deleteConfig(key)
  return NextResponse.json({ ok: true })
}

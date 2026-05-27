import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { setConfig } from '@/lib/db'

export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get('file') as File | null
  const configKey = form.get('key') as string | null

  if (!file || !configKey) {
    return NextResponse.json({ error: 'file and key are required' }, { status: 400 })
  }

  const blob = await put(`kg-tour/${configKey}-${Date.now()}-${file.name}`, file, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  })

  await setConfig(configKey, blob.url)

  return NextResponse.json({ url: blob.url })
}

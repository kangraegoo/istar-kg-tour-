import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { setConfig } from '@/lib/db'

export async function POST(req: Request): Promise<NextResponse> {
  const body = (await req.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        return {
          allowedContentTypes: ['image/*', 'video/*', 'image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'],
          tokenPayload: clientPayload ?? '',
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // __로 시작하는 payload(여권 등)는 config 저장 제외
        if (tokenPayload && !tokenPayload.startsWith('__')) {
          await setConfig(tokenPayload, blob.url)
        }
      },
    })
    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://landing-nine-lac.vercel.app'),
  title: '(주)아이스타홀딩스 키르기스스탄4박6일 첫 여정!',
  description: '26년8월18일(화)~23(일), 4박6일 | 자연의 경이로움과 시장 기회를 발견하는 여행!',
  openGraph: {
    title: '(주)아이스타홀딩스 키르기스스탄4박6일 첫 여정!',
    description: '26년8월18일(화)~23(일), 4박6일 | 자연의 경이로움과 시장 기회를 발견하는 여행!',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nanum+Square:wght@400;700;800;900&family=Noto+Sans+KR:wght@400;700;900&display=swap" rel="stylesheet" />
        <link rel="preload" as="image" href="https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=1600&q=80" />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  )
}

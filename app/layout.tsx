import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '중앙아시아 투어 2026 — 아이스타홀딩스',
  description: '카자흐스탄·키르기스스탄 4박6일 특별 투어 | 2026년 8월 18일 출발',
  openGraph: {
    title: '중앙아시아 카자흐스탄·키르기스스탄 4박6일 특별 투어',
    description: '2026년 8월 18일 출발 | 아이스타홀딩스 임직원 특별 투어',
    images: ['https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=1200'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  )
}

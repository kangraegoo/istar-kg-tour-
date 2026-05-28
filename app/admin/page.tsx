'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Application = {
  id: number; name: string; english_name: string; phone: string
  gender: string; department: string; note: string; passport_image: string; created_at: string
}
type Config = Record<string, string>

const MEDIA_KEYS = [
  'brand_logo', 'hero_video',
  ...Array.from({ length: 6 }, (_, i) => [`day_${i+1}_video`, ...Array.from({ length: 5 }, (_, j) => `day_${i+1}_img_${j+1}`)]).flat(),
  ...Array.from({ length: 6 }, (_, i) => `attraction_${i+1}_image`),
  ...Array.from({ length: 4 }, (_, i) => `hotel_${i+1}_image`),
]

export default function AdminDashboard() {
  const [config, setConfig] = useState<Config>({})
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/config').then(r => r.json()).then(setConfig),
      fetch('/api/apply').then(r => r.json()).then(setApplications),
    ]).finally(() => setLoading(false))
  }, [])

  const uploadedCount = MEDIA_KEYS.filter(k => !!config[k]).length
  const totalSlots = MEDIA_KEYS.length

  const recentApps = [...applications].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 5)

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400 text-sm">
        로딩 중...
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">대시보드</h1>
        <p className="text-gray-400 text-sm mt-1">KG Tour 운영 현황을 한눈에 확인합니다.</p>
      </div>

      {/* 핵심 지표 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: '총 신청자', value: `${applications.length}명`, icon: '👥', color: 'bg-[#0d2340]', textColor: 'text-amber-400' },
          { label: '미디어 업로드', value: `${uploadedCount} / ${totalSlots}`, icon: '🖼️', color: 'bg-blue-600', textColor: 'text-white' },
          { label: '로고', value: config.brand_logo ? '등록됨' : '미등록', icon: '🏷️', color: config.brand_logo ? 'bg-green-600' : 'bg-gray-400', textColor: 'text-white' },
          { label: 'Hero 영상', value: config.hero_video ? '등록됨' : '미등록', icon: '🎬', color: config.hero_video ? 'bg-green-600' : 'bg-gray-400', textColor: 'text-white' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} rounded-2xl p-5 shadow-sm`}>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className={`font-black text-xl ${stat.textColor}`}>{stat.value}</div>
            <div className="text-white/50 text-xs mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 빠른 이동 */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link href="/admin/media"
          className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-amber-100 transition-colors">🖼️</div>
          <div>
            <div className="font-bold text-gray-900 text-base">미디어 관리</div>
            <div className="text-gray-400 text-xs mt-0.5">로고·Hero·일정·관광지·호텔 이미지 업로드</div>
          </div>
          <span className="ml-auto text-gray-300 group-hover:text-amber-400 transition-colors text-lg">→</span>
        </Link>
        <Link href="/admin/applications"
          className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-blue-100 transition-colors">👥</div>
          <div>
            <div className="font-bold text-gray-900 text-base">신청자 관리</div>
            <div className="text-gray-400 text-xs mt-0.5">참가 신청 목록 조회 및 CSV 다운로드</div>
          </div>
          <span className="ml-auto text-gray-300 group-hover:text-blue-400 transition-colors text-lg">→</span>
        </Link>
      </div>

      {/* 최근 신청자 */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-sm">최근 신청자</h2>
          <Link href="/admin/applications" className="text-xs text-[#0d2340] hover:underline font-medium">
            전체 보기 →
          </Link>
        </div>
        {recentApps.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">아직 신청자가 없습니다.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentApps.map((a, i) => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-7 h-7 bg-[#0d2340]/5 rounded-full flex items-center justify-center text-xs font-bold text-[#0d2340]">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 text-sm">{a.name}
                    {a.english_name && <span className="text-gray-400 text-xs font-normal ml-1.5">({a.english_name})</span>}
                  </div>
                  <div className="text-gray-400 text-xs">{a.phone} {a.department ? `· ${a.department}` : ''}</div>
                </div>
                <div className="text-gray-300 text-xs whitespace-nowrap">{new Date(a.created_at).toLocaleDateString('ko-KR')}</div>
                {a.passport_image && (
                  <a href={a.passport_image} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline whitespace-nowrap">여권</a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

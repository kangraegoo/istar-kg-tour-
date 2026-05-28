'use client'

import { useState, useEffect } from 'react'
import UploadRow from '../_components/UploadRow'
import DayMediaSection from '../_components/DayMediaSection'

type Config = Record<string, string>

const DAY_LABELS = [
  'DAY 1 — 8월 18일 (화) · 인천 → 알마티',
  'DAY 2 — 8월 19일 (수) · 차른협곡 → 카라콜',
  'DAY 3 — 8월 20일 (목) · 알틴아라샨 → 촐폰아타',
  'DAY 4 — 8월 21일 (금) · 촐폰아타 → 으슥아따',
  'DAY 5 — 8월 22일 (토) · 으슥아따 → 알마티',
  'DAY 6 — 8월 23일 (일) · 인천 도착',
]

const ATTRACTION_KEYS = [
  { key: 'attraction_1_image', label: '차른협곡 (Charyn Canyon)' },
  { key: 'attraction_2_image', label: '알틴아라샨 (Altyn Arashan)' },
  { key: 'attraction_3_image', label: '이식쿨 호수 크루즈 (Issyk-Kul Cruise)' },
  { key: 'attraction_4_image', label: '암각화 & 박물관 (Petroglyphs & Museum)' },
  { key: 'attraction_5_image', label: 'Issyk-Ata 노천유황온천 (Issyk-Ata Hot Springs)' },
  { key: 'attraction_6_image', label: '침블락 케이블카 (Shymbulak Cable Car)' },
]

const HOTEL_KEYS = [
  { key: 'hotel_1_image', label: '1박 — Plaza Hotel Almaty (카자흐스탄 알마티)' },
  { key: 'hotel_2_image', label: '2박 — Kapriz Karakol Hotel (키르기스 카라콜)' },
  { key: 'hotel_3_image', label: '3박 — Baytur Resort (키르기스 촐폰아타)' },
  { key: 'hotel_4_image', label: '4박 — Aksaray Resort (키르기스 으슥아따)' },
]

const TABS = [
  { id: 'brand', label: '브랜드 · Hero', icon: '🏷️' },
  { id: 'days',  label: '일정 미디어',   icon: '📅' },
  { id: 'attractions', label: '관광지',  icon: '🏔️' },
  { id: 'hotels', label: '호텔',         icon: '🏨' },
]

export default function MediaPage() {
  const [config, setConfig] = useState<Config>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('brand')

  useEffect(() => {
    fetch('/api/config').then(r => r.json()).then(setConfig).finally(() => setLoading(false))
  }, [])

  function handleUploaded(key: string, url: string) {
    setConfig(prev => ({ ...prev, [key]: url }))
  }

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-gray-400 text-sm">로딩 중...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">미디어 관리</h1>
        <p className="text-gray-400 text-sm mt-1">랜딩 페이지에 표시될 이미지와 영상을 업로드합니다.</p>
      </div>

      {/* 서브 탭 */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto pb-px">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all -mb-px ${
              activeTab === tab.id
                ? 'border-[#0d2340] text-[#0d2340]'
                : 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 브랜드 · Hero */}
      {activeTab === 'brand' && (
        <div className="space-y-6">
          <div>
            <SectionTitle num={1} title="브랜드 로고" note="PNG/SVG 권장, 투명 배경" />
            <UploadRow
              label="아이스타홀딩스 로고"
              configKey="brand_logo"
              currentUrl={config.brand_logo}
              onUploaded={handleUploaded}
              accept="image/*"
            />
            <p className="text-xs text-gray-400 mt-2">※ 로고가 없으면 기본 텍스트 마크(iS)가 표시됩니다.</p>
          </div>
          <div>
            <SectionTitle num={2} title="Hero 배경 영상" note="mp4 권장, 최대 500MB" />
            <UploadRow
              label="메인 히어로 배경 영상"
              configKey="hero_video"
              currentUrl={config.hero_video}
              onUploaded={handleUploaded}
              accept="video/*"
            />
            <p className="text-xs text-gray-400 mt-2">※ 영상이 없으면 기본 배경 이미지가 유지됩니다.</p>
          </div>
        </div>
      )}

      {/* 일정 미디어 */}
      {activeTab === 'days' && (
        <div>
          <SectionTitle num={3} title="일정별 미디어" note="DAY별 영상 1개 + 사진 최대 5장" />
          <div className="space-y-2">
            {DAY_LABELS.map((label, i) => (
              <DayMediaSection
                key={i + 1}
                day={i + 1}
                label={label}
                config={config}
                onUploaded={handleUploaded}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">※ 미디어가 없으면 기본 이미지가 표시됩니다.</p>
        </div>
      )}

      {/* 관광지 */}
      {activeTab === 'attractions' && (
        <div>
          <SectionTitle num={4} title="주요 관광지 이미지" note="6개 관광지" />
          <div className="grid sm:grid-cols-2 gap-4">
            {ATTRACTION_KEYS.map(a => (
              <UploadRow
                key={a.key}
                label={a.label}
                configKey={a.key}
                currentUrl={config[a.key]}
                onUploaded={handleUploaded}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">※ 이미지가 없으면 기본 이미지가 표시됩니다.</p>
        </div>
      )}

      {/* 호텔 */}
      {activeTab === 'hotels' && (
        <div>
          <SectionTitle num={5} title="호텔 이미지" note="4박 숙소" />
          <div className="grid sm:grid-cols-2 gap-4">
            {HOTEL_KEYS.map(h => (
              <UploadRow
                key={h.key}
                label={h.label}
                configKey={h.key}
                currentUrl={config[h.key]}
                onUploaded={handleUploaded}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SectionTitle({ num, title, note }: { num: number; title: string; note?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-6 h-6 bg-[#0d2340] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{num}</span>
      <span className="font-bold text-gray-800 text-base">{title}</span>
      {note && <span className="text-gray-400 text-xs">— {note}</span>}
    </div>
  )
}

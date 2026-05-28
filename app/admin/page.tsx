'use client'

import { useState, useEffect, useRef } from 'react'
import { upload } from '@vercel/blob/client'

const HOTEL_KEYS = [
  { key: 'hotel_1_image', label: '1박 — Plaza Hotel Almaty (카자흐스탄 알마티)' },
  { key: 'hotel_2_image', label: '2박 — Kapriz Karakol Hotel (키르기스 카라콜)' },
  { key: 'hotel_3_image', label: '3박 — Baytur Resort (키르기스 촐폰아타)' },
  { key: 'hotel_4_image', label: '4박 — Issyk-Ata Hot Springs (키르기스 으슥아따)' },
]

const DAY_LABELS = [
  'DAY 1 — 8월 18일 (화) · 인천 → 알마티',
  'DAY 2 — 8월 19일 (수) · 차른협곡 → 카라콜',
  'DAY 3 — 8월 20일 (목) · 알틴아라샨 → 촐폰아타',
  'DAY 4 — 8월 21일 (금) · 촐폰아타 → 으슥아따',
  'DAY 5 — 8월 22일 (토) · 으슥아따 → 알마티',
  'DAY 6 — 8월 23일 (일) · 인천 도착',
]

type Config = Record<string, string>

function UploadRow({
  label, configKey, currentUrl, onUploaded,
  accept = 'image/*',
}: {
  label: string
  configKey: string
  currentUrl?: string
  onUploaded: (key: string, url: string) => void
  accept?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [savingUrl, setSavingUrl] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const blob = await upload(`kg-tour/${configKey}-${Date.now()}-${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/upload-token',
        clientPayload: configKey,
      })
      // 업로드 완료 후 클라이언트에서 직접 DB에 URL 저장
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: configKey, value: blob.url }),
      })
      onUploaded(configKey, blob.url)
    } catch (err) {
      setError(String(err))
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleDelete() {
    if (!confirm('이 이미지를 삭제하시겠습니까?')) return
    try {
      await fetch('/api/config', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: configKey }),
      })
      onUploaded(configKey, '')
    } catch {
      setError('삭제 실패')
    }
  }

  async function handleUrlSave() {
    if (!urlInput.trim()) return
    setSavingUrl(true)
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: configKey, value: urlInput.trim() }),
      })
      if (!res.ok) throw new Error()
      onUploaded(configKey, urlInput.trim())
      setUrlInput('')
    } catch {
      setError('URL 저장 실패')
    } finally {
      setSavingUrl(false)
    }
  }

  const isVideo = accept.includes('video')

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="text-sm font-semibold text-gray-700 mb-3">{label}</div>

      {/* 현재 미리보기 */}
      {currentUrl && (
        <div className="relative mb-3 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 group">
          {isVideo ? (
            <video src={currentUrl} controls className="w-full h-36 object-contain" />
          ) : (
            <img src={currentUrl} alt="" className="w-full h-36 object-cover" />
          )}
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full items-center justify-center text-xs font-bold transition-all opacity-0 group-hover:opacity-100 hidden group-hover:flex shadow-md"
            title="삭제"
          >✕</button>
          <div className="px-2 py-1 text-[10px] text-gray-400 truncate">{currentUrl}</div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {/* 파일 업로드 */}
        <label className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed cursor-pointer transition-colors text-sm font-medium ${uploading ? 'border-blue-300 bg-blue-50 text-blue-500 cursor-not-allowed' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-500'}`}>
          {uploading ? '업로드 중...' : `${isVideo ? '🎬' : '🖼️'} ${isVideo ? '영상 파일 선택' : '이미지 파일 선택'}`}
          <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFile} disabled={uploading} />
        </label>

        {/* URL 직접 입력 */}
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="또는 URL 직접 입력"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <button
            onClick={handleUrlSave}
            disabled={!urlInput.trim() || savingUrl}
            className="px-3 py-1.5 bg-gray-800 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 disabled:opacity-40 transition-colors"
          >
            {savingUrl ? '저장 중' : '저장'}
          </button>
        </div>

        {error && <div className="text-red-500 text-xs">{error}</div>}
      </div>
    </div>
  )
}

function DayMediaSection({ day, label, config, onUploaded }: {
  day: number
  label: string
  config: Config
  onUploaded: (key: string, url: string) => void
}) {
  const [open, setOpen] = useState(false)
  const uploadedCount = Array.from({ length: 5 }, (_, i) => config[`day_${day}_img_${i + 1}`]).filter(Boolean).length
  const hasVideo = !!config[`day_${day}_video`]

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-800 text-sm">{label}</span>
        <div className="flex items-center gap-2">
          {(uploadedCount > 0 || hasVideo) && (
            <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
              {hasVideo ? '영상 ' : ''}{uploadedCount > 0 ? `사진 ${uploadedCount}장` : ''}
            </span>
          )}
          <span className="text-gray-400 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div className="border-t border-gray-100 p-4 space-y-4">
          <UploadRow
            label="영상 (선택 · mp4 권장)"
            configKey={`day_${day}_video`}
            currentUrl={config[`day_${day}_video`]}
            onUploaded={onUploaded}
            accept="video/*"
          />
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-2">사진 (최대 5장)</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 5 }, (_, i) => (
                <UploadRow
                  key={i}
                  label={`사진 ${i + 1}`}
                  configKey={`day_${day}_img_${i + 1}`}
                  currentUrl={config[`day_${day}_img_${i + 1}`]}
                  onUploaded={onUploaded}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminPage() {
  const [config, setConfig] = useState<Config>({})
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<{ id: number; name: string; english_name: string; phone: string; gender: string; department: string; meal_pref: string; note: string; passport_image: string; created_at: string }[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/config').then(r => r.json()).then(setConfig),
      fetch('/api/apply').then(r => r.json()).then(setApplications),
    ]).finally(() => setLoading(false))
  }, [])

  function downloadCSV() {
    const headers = ['#', '이름', '영문이름', '연락처', '성별', '회사명/소속', '기타요청', '여권사본URL', '신청일시']
    const rows = applications.map((a, i) => [
      i + 1,
      a.name,
      a.english_name || '',
      a.phone,
      a.gender || '',
      a.department || '',
      a.note || '',
      a.passport_image || '',
      new Date(a.created_at).toLocaleString('ko-KR'),
    ])
    const csv = [headers, ...rows]
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `KG투어_참가신청_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleUploaded(key: string, url: string) {
    setConfig(prev => ({ ...prev, [key]: url }))
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">로딩 중...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#0d2340] rounded-xl flex items-center justify-center text-amber-400 font-black text-sm">iS</div>
          <div>
            <h1 className="text-xl font-black text-gray-900">관리자 — 미디어 업로드</h1>
            <p className="text-gray-400 text-sm">Hero 영상 및 호텔 이미지를 업로드·관리합니다.</p>
          </div>
        </div>

        {/* 브랜드 로고 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-[#0d2340] rounded-full flex items-center justify-center text-white text-xs">1</span>
            브랜드 로고
          </h2>
          <UploadRow
            label="아이스타홀딩스 로고 (PNG/SVG 권장, 투명배경)"
            configKey="brand_logo"
            currentUrl={config.brand_logo}
            onUploaded={handleUploaded}
            accept="image/*"
          />
          <p className="text-xs text-gray-400 mt-2">※ 로고가 없으면 기본 텍스트 마크(iS)가 표시됩니다.</p>
        </section>

        {/* Hero 영상 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-[#0d2340] rounded-full flex items-center justify-center text-white text-xs">2</span>
            Hero 배경 영상
          </h2>
          <UploadRow
            label="메인 배경 영상 (mp4 권장, 최대 500MB)"
            configKey="hero_video"
            currentUrl={config.hero_video}
            onUploaded={handleUploaded}
            accept="video/*"
          />
          <p className="text-xs text-gray-400 mt-2">※ 영상이 없으면 기존 배경 이미지가 유지됩니다.</p>
        </section>

        {/* 일정별 미디어 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-[#0d2340] rounded-full flex items-center justify-center text-white text-xs">3</span>
            일정별 미디어 (영상 + 사진 최대 5장)
          </h2>
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
          <p className="text-xs text-gray-400 mt-2">※ 미디어가 없으면 기본 이미지가 표시됩니다.</p>
        </section>

        {/* 관광지 이미지 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-[#0d2340] rounded-full flex items-center justify-center text-white text-xs">4</span>
            주요 관광지 이미지 (6개)
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { key: 'attraction_1_image', label: '차른협곡 (Charyn Canyon)' },
              { key: 'attraction_2_image', label: '알틴아라샨 (Altyn Arashan)' },
              { key: 'attraction_3_image', label: '이식쿨 호수 크루즈 (Issyk-Kul Cruise)' },
              { key: 'attraction_4_image', label: '암각화 & 박물관 (Petroglyphs & Museum)' },
              { key: 'attraction_5_image', label: '아크베르메트 노천온천 (Ak-Bermet Hot Springs)' },
              { key: 'attraction_6_image', label: '비슈케크 시내관광 (Bishkek City Tour)' },
            ].map(a => (
              <UploadRow
                key={a.key}
                label={a.label}
                configKey={a.key}
                currentUrl={config[a.key]}
                onUploaded={handleUploaded}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">※ 이미지가 없으면 기본 이미지가 표시됩니다.</p>
        </section>

        {/* 호텔 이미지 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-[#0d2340] rounded-full flex items-center justify-center text-white text-xs">5</span>
            호텔 이미지 (4개)
          </h2>
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
        </section>

        {/* 참가 신청 목록 */}
        <section>
          <h2 className="text-base font-bold text-gray-700 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-[#0d2340] rounded-full flex items-center justify-center text-white text-xs">6</span>
              참가 신청 목록 ({applications.length}명)
            </div>
            {applications.length > 0 && (
              <button
                onClick={downloadCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0d2340] text-white text-xs font-semibold rounded-lg hover:bg-[#0d2340]/80 transition-colors"
              >
                ⬇ CSV 다운로드
              </button>
            )}
          </h2>
          {applications.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">아직 신청자가 없습니다.</div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-[#0d2340] text-white">
                  <tr>
                    {['#', '이름', '영문이름', '연락처', '성별', '회사명/소속', '여권', '기타요청', '신청일시'].map(h => (
                      <th key={h} className="px-3 py-2 text-left text-xs font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {applications.map((a, i) => (
                    <tr key={a.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-400 text-xs">{i + 1}</td>
                      <td className="px-3 py-2 font-semibold text-gray-800 whitespace-nowrap">{a.name}</td>
                      <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">{a.english_name || '-'}</td>
                      <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{a.phone}</td>
                      <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">{a.gender || '-'}</td>
                      <td className="px-3 py-2 text-gray-500 text-xs">{a.department || '-'}</td>
                      <td className="px-3 py-2 text-xs">
                        {a.passport_image
                          ? <a href={a.passport_image} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">보기</a>
                          : <span className="text-gray-300">-</span>}
                      </td>
                      <td className="px-3 py-2 text-gray-500 text-xs max-w-[120px] truncate">{a.note || '-'}</td>
                      <td className="px-3 py-2 text-gray-400 text-xs whitespace-nowrap">{new Date(a.created_at).toLocaleDateString('ko-KR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="mt-8 text-center">
          <a href="/" className="text-sm text-[#0d2340] hover:underline font-medium">← 메인 페이지로 돌아가기</a>
        </div>
      </div>
    </div>
  )
}

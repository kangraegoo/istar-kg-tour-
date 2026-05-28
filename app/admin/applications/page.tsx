'use client'

import { useState, useEffect } from 'react'

type Application = {
  id: number; name: string; english_name: string; phone: string
  gender: string; department: string; meal_pref: string; note: string
  passport_image: string; created_at: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch('/api/apply').then(r => r.json()).then(setApplications).finally(() => setLoading(false))
  }, [])

  const filtered = applications.filter(a =>
    [a.name, a.english_name, a.phone, a.department].some(v =>
      v?.toLowerCase().includes(search.toLowerCase())
    )
  )

  const allChecked = filtered.length > 0 && filtered.every(a => selected.has(a.id))

  function toggleAll() {
    if (allChecked) {
      setSelected(prev => {
        const next = new Set(prev)
        filtered.forEach(a => next.delete(a.id))
        return next
      })
    } else {
      setSelected(prev => {
        const next = new Set(prev)
        filtered.forEach(a => next.add(a.id))
        return next
      })
    }
  }

  function toggleOne(id: number) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function handleDelete() {
    if (selected.size === 0) return
    if (!confirm(`선택한 ${selected.size}명을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) return
    setDeleting(true)
    try {
      const res = await fetch('/api/apply', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selected) }),
      })
      if (res.ok) {
        setApplications(prev => prev.filter(a => !selected.has(a.id)))
        setSelected(new Set())
      } else {
        alert('삭제에 실패했습니다.')
      }
    } finally {
      setDeleting(false)
    }
  }

  function downloadCSV() {
    const headers = ['#', '이름', '영문이름', '연락처', '성별', '회사명/소속', '기타요청', '여권사본URL', '신청일시']
    const rows = applications.map((a, i) => [
      i + 1, a.name, a.english_name || '', a.phone, a.gender || '',
      a.department || '', a.note || '', a.passport_image || '',
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

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-gray-400 text-sm">로딩 중...</div>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">신청자 관리</h1>
          <p className="text-gray-400 text-sm mt-1">총 <span className="font-bold text-[#0d2340]">{applications.length}명</span> 신청</p>
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              🗑 선택 삭제 ({selected.size}명)
            </button>
          )}
          {applications.length > 0 && (
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-[#0d2340] text-white text-sm font-semibold rounded-xl hover:bg-[#0d2340]/80 transition-colors shadow-sm"
            >
              ⬇ CSV 다운로드
            </button>
          )}
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: '전체 신청', value: applications.length, color: 'text-[#0d2340]' },
          { label: '남성', value: applications.filter(a => a.gender === '남성').length, color: 'text-blue-600' },
          { label: '여성', value: applications.filter(a => a.gender === '여성').length, color: 'text-pink-600' },
          { label: '여권 첨부', value: applications.filter(a => a.passport_image).length, color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-gray-400 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 검색 */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="이름, 연락처, 소속으로 검색..."
          className="w-full max-w-sm border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d2340]/20 focus:border-[#0d2340]/40"
        />
      </div>

      {/* 테이블 */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 text-sm">
          {search ? '검색 결과가 없습니다.' : '아직 신청자가 없습니다.'}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0d2340] text-white">
                <tr>
                  <th className="px-3 py-2.5 text-left">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
                    />
                  </th>
                  {['#', '이름', '영문이름', '연락처', '성별', '회사명/소속', '여권', '기타요청', '신청일시'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr
                    key={a.id}
                    className={`border-t border-gray-50 transition-colors ${selected.has(a.id) ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-3 py-2.5">
                      <input
                        type="checkbox"
                        checked={selected.has(a.id)}
                        onChange={() => toggleOne(a.id)}
                        className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-2.5 text-gray-300 text-xs">{i + 1}</td>
                    <td className="px-3 py-2.5 font-semibold text-gray-800 whitespace-nowrap">{a.name}</td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs whitespace-nowrap">{a.english_name || '-'}</td>
                    <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{a.phone}</td>
                    <td className="px-3 py-2.5 text-xs whitespace-nowrap">
                      {a.gender
                        ? <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${a.gender === '남성' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>{a.gender}</span>
                        : <span className="text-gray-300">-</span>}
                    </td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs">{a.department || '-'}</td>
                    <td className="px-3 py-2.5 text-xs">
                      {a.passport_image
                        ? <a href={a.passport_image} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium">보기 ↗</a>
                        : <span className="text-gray-300">-</span>}
                    </td>
                    <td className="px-3 py-2.5 text-gray-400 text-xs max-w-[140px] truncate">{a.note || '-'}</td>
                    <td className="px-3 py-2.5 text-gray-400 text-xs whitespace-nowrap">{new Date(a.created_at).toLocaleDateString('ko-KR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 text-xs text-gray-400 flex items-center justify-between">
            <span>{search ? `${filtered.length}명 검색됨 (전체 ${applications.length}명)` : `전체 ${applications.length}명`}</span>
            {selected.size > 0 && <span className="text-red-500 font-semibold">{selected.size}명 선택됨</span>}
          </div>
        </div>
      )}
    </div>
  )
}

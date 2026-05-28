'use client'

import { useState, useRef } from 'react'
import { upload } from '@vercel/blob/client'

export default function UploadRow({
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

  const isVideo = accept.includes('video')

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
    if (!confirm('이 미디어를 삭제하시겠습니까?')) return
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

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="text-sm font-semibold text-gray-700 mb-3">{label}</div>

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
          >✕</button>
          <div className="px-2 py-1 text-[10px] text-gray-400 truncate">{currentUrl}</div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed cursor-pointer transition-colors text-sm font-medium ${
          uploading
            ? 'border-blue-300 bg-blue-50 text-blue-500 cursor-not-allowed'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-500'
        }`}>
          {uploading ? '업로드 중...' : `${isVideo ? '🎬 영상 파일 선택' : '🖼️ 이미지 파일 선택'}`}
          <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
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

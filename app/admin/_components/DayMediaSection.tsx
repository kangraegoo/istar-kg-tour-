'use client'

import { useState } from 'react'
import UploadRow from './UploadRow'

type Config = Record<string, string>

export default function DayMediaSection({ day, label, config, onUploaded }: {
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

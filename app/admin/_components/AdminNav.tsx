'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/admin',              label: '대시보드',    icon: '📊', exact: true },
  { href: '/admin/media',        label: '미디어 관리', icon: '🖼️' },
  { href: '/admin/applications', label: '신청자 관리', icon: '👥' },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d2340] shadow-lg">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center text-[#0d2340] font-black text-xs select-none">iS</div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">관리자 콘솔</div>
            <div className="text-white/35 text-[10px] tracking-wide">iStar KG Tour Admin</div>
          </div>
        </div>
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(item => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-400 text-[#0d2340]'
                    : 'text-white/50 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
          <a
            href="/"
            className="ml-2 px-3 py-1.5 rounded-lg text-xs text-white/35 hover:text-white/70 transition-colors border border-white/10 hover:border-white/20"
          >
            ← 메인
          </a>
        </nav>
      </div>
    </header>
  )
}

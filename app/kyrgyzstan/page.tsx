import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About 키르기스스탄 | 아이스타홀딩스 KG투어',
  description: '키르기스스탄 국가 정보, 위치, 언어, 경제, 주요 음식, 날씨 안내',
}

const STATS = [
  { icon: '🏛️', label: '수도', value: '비슈케크', sub: 'Bishkek' },
  { icon: '👥', label: '인구', value: '약 700만 명', sub: '2024 기준' },
  { icon: '📐', label: '면적', value: '199,951 km²', sub: '한반도의 약 0.9배' },
  { icon: '🕐', label: '시차', value: 'UTC+6', sub: '한국보다 3시간 느림' },
  { icon: '💰', label: '통화', value: '솜 (KGS)', sub: '1달러 ≈ 87솜' },
  { icon: '🕌', label: '종교', value: '이슬람교', sub: '약 80% 수니파' },
]

const CULTURE = [
  { icon: '🗣️', title: '공용어', desc: '키르기스어(국어)와 러시아어 공용. 비즈니스·교육은 러시아어가 주로 사용됨.' },
  { icon: '⛺', title: '유목민 문화', desc: '수천 년 이어온 유목민 전통. 가축과 함께 이동하며 유르트에서 생활하는 문화가 현재도 이어짐.' },
  { icon: '🏠', title: '유르트 (Yurt)', desc: '이동식 원형 천막 가옥. 빠른 해체·조립이 가능하며 여름철 목동들이 지금도 사용.' },
  { icon: '🐎', title: '말 문화', desc: '마상 스포츠, 독수리 사냥, 전통 폴로(코코 보루) 등 말과 연관된 문화가 깊이 발달.' },
  { icon: '🎵', title: '코무즈 (Komuz)', desc: '말총으로 만든 3현 전통 악기. 유네스코 무형문화유산으로 민족 정체성의 상징.' },
  { icon: '🤝', title: '아크사칼 제도', desc: '"흰 수염 어른들"의 장로 회의. 분쟁 조정·지역 문제 해결에 중요한 역할을 담당.' },
]

const WEATHER = [
  { month: '1월', high: -5 },
  { month: '2월', high: -2 },
  { month: '3월', high: 8 },
  { month: '4월', high: 16 },
  { month: '5월', high: 22 },
  { month: '6월', high: 28 },
  { month: '7월', high: 30 },
  { month: '8월', high: 29 },
  { month: '9월', high: 22 },
  { month: '10월', high: 14 },
  { month: '11월', high: 5 },
  { month: '12월', high: -2 },
]

const FOODS = [
  { name: '베슈바르막', nameEn: 'Beshbarmak', icon: '🍖', desc: '키르기스 국민 음식. 양고기와 넓은 면을 양파 육수와 함께 즐기는 전통 요리. "다섯 손가락"이라는 뜻으로 손으로 집어 먹는 것이 전통.' },
  { name: '라그만', nameEn: 'Lagman', icon: '🍜', desc: '손으로 늘린 굵은 면에 양고기와 채소를 볶아 올린 중앙아시아식 국수. 국물형·볶음형 두 가지로 즐길 수 있음.' },
  { name: '만트', nameEn: 'Manti', icon: '🥟', desc: '양고기 또는 쇠고기를 넣은 대형 찐만두. 사워크림과 함께 먹으며 한국 왕만두와 비슷하지만 크기가 훨씬 큼.' },
  { name: '쇼르포', nameEn: 'Shorpo', icon: '🍲', desc: '양고기와 채소를 넣고 푹 끓인 전통 수프. 맑고 진한 육수가 특징이며 유목민들의 주식이었던 전통 음식.' },
  { name: '쿠미스', nameEn: 'Kymyz', icon: '🥛', desc: '암말의 젖을 발효시켜 만든 전통 음료. 약간의 알코올 성분이 있으며 건강 음료로도 유명한 유목민 상징 음료.' },
  { name: '사만사', nameEn: 'Samsa', icon: '🥐', desc: '양고기나 채소를 넣은 삼각형 오븐 파이. 탄두르 화덕에서 구워 겉은 바삭하고 속은 촉촉한 인기 길거리 음식.' },
]

const INDUSTRIES = [
  { icon: '⛏️', name: '광업', desc: '금 광산(쿰토르)이 최대 수출품. 금은 전체 수출의 약 40%를 차지하며 국가 경제의 핵심 산업.' },
  { icon: '🌾', name: '농업·목축업', desc: '산악지형 특성상 목축업 발달. 면화·밀·채소 재배 및 양고기·유제품 생산이 주요 농업 기반.' },
  { icon: '🏔️', name: '관광업', desc: '이식쿨 호수, 텐샨 산맥 등 천혜 자연을 바탕으로 급성장 중. 트레킹·어드벤처 관광이 인기.' },
  { icon: '⚡', name: '수력발전', desc: '풍부한 산악 수자원 활용. 전력의 90% 이상이 수력 발전이며 중앙아시아 주요 전력 수출국.' },
]

const TIPS = [
  { icon: '✈️', title: '비자', desc: '한국 여권 소지자 무비자 60일 입국 가능' },
  { icon: '💵', title: '환전', desc: '달러→현지 솜(KGS) 환전 권장. 카드 사용 제한적' },
  { icon: '🔌', title: '전압', desc: '220V / 50Hz (한국 어댑터 호환 가능)' },
  { icon: '📱', title: '인터넷', desc: '주요 도시 4G 가능. 현지 SIM 구매 추천' },
  { icon: '🏥', title: '긴급연락', desc: '경찰 102 · 소방 101 · 구급 103' },
  { icon: '👔', title: '복장', desc: '트레킹 시 등산화·방풍재킷 필수. 사원 방문 시 긴 옷' },
]

function DarkLabel({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-4 mb-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-amber-400 text-[10px] font-bold tracking-[0.35em] uppercase">{label}</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>
      <h2 className="text-white text-2xl sm:text-3xl font-black text-center">{title}</h2>
    </div>
  )
}

function LightLabel({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div className="mb-10 text-center">
      <div className="flex items-center gap-4 mb-3">
        <div className="flex-1 h-px bg-[#0d2340]/10" />
        <span className="text-amber-600 text-[10px] font-bold tracking-[0.35em] uppercase">{label}</span>
        <div className="flex-1 h-px bg-[#0d2340]/10" />
      </div>
      <h2 className="text-[#0d2340] text-2xl sm:text-3xl font-black">{title}</h2>
      {sub && <p className="text-gray-400 text-sm mt-1.5">{sub}</p>}
    </div>
  )
}

export default function KyrgyzstanPage() {
  return (
    <div className="min-h-screen bg-[#0d2340]">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="아이스타홀딩스" className="h-10 w-auto object-contain" />
            <div>
              <div className="text-[#0d2340] font-bold text-sm leading-tight">아이스타홀딩스</div>
              <div className="text-amber-500 text-[10px] font-medium tracking-wider">iStar Holdings</div>
            </div>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/" className="hidden sm:block px-4 py-2 text-sm font-medium rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors">
              ← 메인으로
            </Link>
            <span className="px-4 py-2 text-sm font-bold rounded-md bg-[#0d2340] text-amber-400">
              About 키르기스스탄
            </span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-16">
        <div
          className="relative h-[55vh] min-h-[380px] flex items-end overflow-hidden"
          style={{ backgroundImage: 'url(/kg-hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 60%' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d2340]/20 via-[#0d2340]/30 to-[#0d2340]" />
          <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-14">
            <div className="inline-flex items-center gap-2 bg-amber-400/15 border border-amber-400/30 text-amber-300 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.25em] uppercase mb-3">
              Central Asia · 중앙아시아
            </div>
            <h1 className="text-white text-5xl sm:text-6xl font-black mb-2 leading-tight">
              키르기스스탄<br />
              <span className="text-2xl sm:text-3xl font-light text-white/50 tracking-wide">Kyrgyz Republic</span>
            </h1>
            <p className="text-amber-400/80 text-sm font-medium tracking-widest uppercase">천산의 나라 · Land of Celestial Mountains</p>
          </div>
        </div>
      </section>

      {/* 기본 국가 정보 — 다크 */}
      <section className="py-16 bg-[#0d2340]">
        <div className="max-w-5xl mx-auto px-4">
          <DarkLabel label="Basic Info" title="기본 국가 정보" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {STATS.map(s => (
              <div key={s.label}
                className="group border border-white/[0.08] rounded-2xl p-5 text-center hover:border-amber-400/40 hover:bg-white/[0.04] transition-all cursor-default">
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="text-white/35 text-[10px] font-semibold tracking-widest uppercase mb-1.5">{s.label}</div>
                <div className="font-black text-amber-400 text-lg leading-tight">{s.value}</div>
                <div className="text-white/25 text-[11px] mt-1">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 위치 & 지리 — 라이트 */}
      <section className="py-16 bg-[#f7f6f3]">
        <div className="max-w-5xl mx-auto px-4">
          <LightLabel label="Geography" title="위치 & 지리" />
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80"
                alt="키르기스스탄 자연"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d2340]/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white/80 text-xs font-medium">텐샨 산맥 · Tian Shan</div>
            </div>
            <div className="space-y-4">
              {[
                { icon: '🌍', title: '중앙아시아 내륙국', desc: '카자흐스탄·우즈베키스탄·타지키스탄·중국과 국경을 접하는 완전한 내륙 국가.' },
                { icon: '⛰️', title: '국토의 90%가 산악 지형', desc: '텐샨(천산) 산맥이 국토를 가로질러 평균 해발 2,750m. 아시아 최고봉급 산들이 즐비.' },
                { icon: '🏞️', title: '이식쿨 호수', desc: '세계에서 두 번째로 큰 산악 호수(6,236km²). 겨울에도 얼지 않는 온수호로 사계절 아름다운 절경.' },
                { icon: '🦁', title: '국가 상징', desc: '국기 중앙 문양은 전통 가옥 유르트의 천장(튼둑). 눈표범(일 바르스)이 국가 상징 동물.' },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all">
                  <div className="w-9 h-9 rounded-lg bg-[#0d2340]/5 flex items-center justify-center text-xl shrink-0">{item.icon}</div>
                  <div>
                    <div className="font-bold text-[#0d2340] text-sm mb-0.5">{item.title}</div>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 언어 & 문화 — 다크 */}
      <section className="py-16 bg-[#0d2340]">
        <div className="max-w-5xl mx-auto px-4">
          <DarkLabel label="Culture" title="언어 & 문화" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CULTURE.map(item => (
              <div key={item.title}
                className="group border border-white/[0.08] rounded-2xl p-5 hover:border-amber-400/40 hover:bg-white/[0.04] transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xl mb-4">{item.icon}</div>
                <div className="font-bold text-white text-sm mb-2">{item.title}</div>
                <p className="text-white/45 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 날씨 — 라이트 */}
      <section className="py-16 bg-[#f7f6f3]">
        <div className="max-w-5xl mx-auto px-4">
          <LightLabel label="Weather" title="날씨 & 여행 시즌" sub="비슈케크 기준 월평균 최고 기온 (°C)" />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-end gap-1">
              {WEATHER.map(w => {
                const barH = Math.max(4, (w.high + 15) / 50 * 100)
                const isAug = w.month === '8월'
                const bg = w.high < 5 ? 'bg-blue-300' : w.high < 20 ? 'bg-green-400' : 'bg-amber-400'
                return (
                  <div key={w.month} className="flex flex-col items-center gap-1 flex-1">
                    <span className={`text-[9px] font-bold leading-none ${isAug ? 'text-amber-600' : 'text-gray-400'}`}>{w.high}°</span>
                    <div
                      className={`w-full rounded-t ${bg} ${isAug ? 'ring-2 ring-amber-500 ring-offset-1' : ''}`}
                      style={{ height: `${barH}px` }}
                    />
                    <span className={`text-[9px] ${isAug ? 'text-amber-600 font-black' : 'text-gray-400'}`}>
                      {w.month.replace('월', '')}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-center gap-5 mt-5 flex-wrap text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-300 inline-block" />겨울 (혹한)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-400 inline-block" />봄·가을</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-400 ring-1 ring-amber-500 inline-block" />여름 (여행 최적)</span>
            </div>
          </div>
          <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
            <span className="text-xl shrink-0">☀️</span>
            <div>
              <div className="font-bold text-amber-800 text-sm mb-1">8월 여행 포인트</div>
              <p className="text-amber-700 text-xs leading-relaxed">낮 기온 25~30°C의 쾌적한 날씨. 강수량이 적고 하늘이 맑아 트레킹·아웃도어 활동 최적기. 아침저녁은 서늘하므로 얇은 겉옷 필수.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 음식 — 다크 */}
      <section className="py-16 bg-[#0d2340]">
        <div className="max-w-5xl mx-auto px-4">
          <DarkLabel label="Cuisine" title="주요 음식" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FOODS.map(f => (
              <div key={f.name}
                className="group border border-white/[0.08] rounded-2xl p-5 hover:border-amber-400/40 hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-2xl">{f.icon}</div>
                  <div>
                    <div className="font-black text-white text-sm">{f.name}</div>
                    <div className="text-amber-400/70 text-[10px] font-semibold tracking-wide">{f.nameEn}</div>
                  </div>
                </div>
                <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 경제 & 산업 — 라이트 */}
      <section className="py-16 bg-[#f7f6f3]">
        <div className="max-w-5xl mx-auto px-4">
          <LightLabel label="Economy" title="경제 & 산업" />
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'GDP', value: '약 $110억', sub: '2023 기준' },
              { label: '1인당 GDP', value: '약 $1,500', sub: '중앙아시아 내 하위권' },
              { label: '경제성장률', value: '4~6%', sub: '최근 3년 평균' },
            ].map(e => (
              <div key={e.label} className="bg-[#0d2340] rounded-2xl p-4 sm:p-5 text-center shadow-md">
                <div className="text-white/35 text-[10px] font-semibold tracking-widest uppercase mb-2">{e.label}</div>
                <div className="text-amber-400 font-black text-lg sm:text-2xl leading-tight">{e.value}</div>
                <div className="text-white/25 text-[10px] mt-1">{e.sub}</div>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {INDUSTRIES.map(i => (
              <div key={i.name} className="flex gap-4 bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all">
                <div className="w-11 h-11 rounded-xl bg-[#0d2340]/5 flex items-center justify-center text-2xl shrink-0">{i.icon}</div>
                <div>
                  <div className="font-bold text-[#0d2340] text-sm mb-1">{i.name}</div>
                  <p className="text-gray-500 text-xs leading-relaxed">{i.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 여행 실용 정보 — 다크 */}
      <section className="py-16 bg-[#0d2340]">
        <div className="max-w-5xl mx-auto px-4">
          <DarkLabel label="Travel Tips" title="여행 실용 정보" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {TIPS.map(t => (
              <div key={t.title}
                className="border border-white/[0.08] rounded-2xl p-5 hover:border-amber-400/40 hover:bg-white/[0.04] transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xl mb-3">{t.icon}</div>
                <div className="font-bold text-white text-sm mb-1.5">{t.title}</div>
                <p className="text-white/40 text-xs leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'url(/kg-hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 30%' }}
        />
        <div className="absolute inset-0 bg-[#0d2340]/85" />
        <div className="relative z-10 max-w-xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-400/15 border border-amber-400/30 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
            ✈️ 2026년 8월 출발
          </div>
          <h2 className="text-white text-3xl font-black mb-3">키르기스스탄을 직접<br />경험해보세요</h2>
          <p className="text-white/50 text-sm mb-8">4박 6일 · 아이스타홀딩스 특별 투어</p>
          <Link
            href="/#apply"
            className="inline-block px-10 py-4 bg-amber-400 hover:bg-amber-300 text-[#0d2340] font-black text-base rounded-xl transition-all shadow-xl hover:-translate-y-0.5"
          >
            투어 참가 신청하기 →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="아이스타홀딩스" className="h-9 w-auto object-contain" />
            <div>
              <div className="text-gray-900 font-bold text-sm">주식회사 아이스타홀딩스</div>
              <div className="text-gray-400 text-[11px]">iStar Holdings Co., Ltd.</div>
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-1 text-right">
            <div className="text-gray-600 text-xs">031-8027-9071 · helper@istarholdings.kr</div>
            <div className="text-gray-400 text-[11px]">경기도 하남시 미사강변중앙로 214, 701호</div>
            <div className="text-gray-300 text-[11px] mt-1">© 2026 iStar Holdings. All rights reserved.</div>
          </div>
        </div>
      </footer>

    </div>
  )
}

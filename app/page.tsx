'use client'

import { useState, useEffect, useRef } from 'react'
import { upload } from '@vercel/blob/client'

type SiteConfig = Record<string, string>

const ITINERARY = [
  {
    day: 1, label: 'DAY 1', date: '8월 18일 (화)', regions: '인천 → 알마티',
    transport: 'ZE135 / 전용차량', mealDetail: '',
    schedules: [
      { time: '19:25', desc: '인천국제공항 출발 (ZE135)' },
      { time: '22:40', desc: '알마티 국제공항 제2터미널 도착' },
      { time: '',      desc: '가이드 미팅 후 시내 이동' },
      { time: '',      desc: '호텔 체크인 및 휴식' },
    ],
    hotel: { name: 'Plaza Hotel Almaty', nameKo: '플라자 호텔 알마티', stars: 4, location: '알마티, 카자흐스탄', note: '또는 동급' },
    highlight: '출발의 설렘, 알마티 도착',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
  {
    day: 2, label: 'DAY 2', date: '8월 19일 (수)', regions: '차른협곡 → 카라콜',
    transport: '전용차량', mealDetail: '조:호텔식 / 중:도시락 / 석:현지식',
    schedules: [
      { time: '', desc: '조식 후 차른협곡으로 이동' },
      { time: '', desc: '차른협곡 하이킹 (카자흐스탄의 그랜드캐니언)' },
      { time: '', desc: '카자흐스탄 출국수속 / 케겐 국경 통과' },
      { time: '', desc: '키르기스스탄 입국수속' },
      { time: '', desc: '카라콜로 이동, 석식 후 휴식' },
    ],
    hotel: { name: 'Kapriz Karakol Hotel', nameKo: '카프리스 카라콜 호텔', stars: 4, location: '카라콜, 키르기스스탄', note: '' },
    highlight: '카자흐스탄의 그랜드캐니언, 차른협곡 하이킹',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
  },
  {
    day: 3, label: 'DAY 3', date: '8월 20일 (목)', regions: '카라콜 → 알틴아라샨 → 촐폰아타',
    transport: '전용차량 / 트레킹', mealDetail: '조:호텔식 / 중:현지식 / 석:현지식',
    schedules: [
      { time: '', desc: '조식 후 체크아웃' },
      { time: '', desc: '알틴아라샨으로 이동 (키르기스 비경 계곡)' },
      { time: '', desc: '하프지점부터 산장까지 하이킹' },
      { time: '', desc: '산악차량(가스66)으로 하산' },
      { time: '', desc: '촐폰아타로 이동, 호텔 도착 후 석식' },
    ],
    hotel: { name: 'Baytur Resort', nameKo: '바이투르 리조트', stars: 5, location: '촐폰아타, 키르기스스탄', note: 'resort.baytur.kg' },
    highlight: '알틴아라샨 트레킹 & 5성급 리조트',
    image: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=800&q=80',
  },
  {
    day: 4, label: 'DAY 4', date: '8월 21일 (금)', regions: '촐폰아타 → 으슥아따',
    transport: '전용차량', mealDetail: '조:호텔식 / 중:현지식 / 석:특식(바비큐)',
    schedules: [
      { time: '', desc: '이식쿨 호수 유람선 크루즈 체험 (핑거푸드·음료 제공)' },
      { time: '', desc: '암각화 / 르호드도 박물관 방문' },
      { time: '', desc: '으슥아따(Issyk-Ata) 노천온천으로 이동' },
      { time: '', desc: '석식 및 노천유황온천 / 사우나 체험' },
      { time: '', desc: '호텔 이동 및 체크인' },
    ],
    hotel: { name: 'Aksaray Resort', nameKo: '아크사라이 리조트', stars: 4, location: '으슥아따, 키르기스스탄', note: '' },
    highlight: '이식쿨 유람선 크루즈 & 으슥아따 노천유황온천',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  },
  {
    day: 5, label: 'DAY 5', date: '8월 22일 (토)', regions: '으슥아따 → 알마티',
    transport: '전용차량 / ZE136', mealDetail: '조:호텔식 / 중:한식 / 석:현지식',
    schedules: [
      { time: '',      desc: '조식 후 알마티 이동 (까라수 국경)' },
      { time: '',      desc: '키르기스스탄 출국수속 / 국경통과 / 카자흐스탄 입국수속' },
      { time: '',      desc: '알마티 도착 후 중식 (한식)' },
      { time: '',      desc: '침블락 이동 케이블카 탑승 (3,200m)' },
      { time: '',      desc: '시내 이동 석식 후 아르바트 거리 체험' },
      { time: '',      desc: '알마티 국제공항으로 이동' },
      { time: '23:40', desc: '알마티 국제공항 탑승 수속 (ZE136)' },
    ],
    hotel: { name: '기내 숙박', nameKo: '기내', stars: 0, location: '알마티 출발', note: '' },
    highlight: '침블락 케이블카(3,200m) & 알마티 아르바트 거리',
    image: 'https://images.unsplash.com/photo-1531219572328-a0171b4448a3?w=800&q=80',
  },
  {
    day: 6, label: 'DAY 6', date: '8월 23일 (일)', regions: '인천 도착',
    transport: 'ZE136', mealDetail: '',
    schedules: [
      { time: '10:05', desc: '인천국제공항 도착' },
      { time: '',      desc: '귀가 및 해산' },
    ],
    hotel: null,
    highlight: '무사 귀환, 소중한 추억과 함께',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
  },
]

const HOTELS_BASE = [
  { key: 'hotel_1_image', night: '1박 (8.18)', name: 'Plaza Hotel Almaty', nameKo: '플라자 호텔 알마티', stars: 4, location: '카자흐스탄 알마티', desc: '알마티 시내 중심부에 위치한 4성급 호텔. 세련된 인테리어와 편안한 객실로 첫날 여독을 풀기에 최적의 환경을 제공합니다.', fallback: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80' },
  { key: 'hotel_2_image', night: '2박 (8.19)', name: 'Kapriz Karakol Hotel', nameKo: '카프리스 카라콜 호텔', stars: 4, location: '키르기스스탄 카라콜', desc: '톈샨 산맥 기슭의 아름다운 도시 카라콜의 4성급 호텔. 맑은 자연 속에서의 고품격 숙박 경험을 선사합니다.', fallback: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80' },
  { key: 'hotel_3_image', night: '3박 (8.20)', name: 'Baytur Resort', nameKo: '바이투르 리조트', stars: 5, location: '키르기스스탄 촐폰아타', desc: '이식쿨 호수를 바라보는 5성급 프리미엄 리조트. 세계에서 두 번째로 큰 산악 호수의 절경과 함께하는 특별한 하룻밤.', fallback: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80' },
  { key: 'hotel_4_image', night: '4박 (8.21)', name: 'Aksaray Resort', nameKo: '아크사라이 리조트', stars: 4, location: '키르기스스탄 으슥아따', desc: '키르기스스탄 대자연 속에 자리한 노천유황온천 리조트. 탁 트인 산악 풍경 아래 유황온천과 사우나를 즐기며 특별한 바비큐 석식과 함께 여행의 피로를 씻어내는 힐링 타임.', fallback: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80' },
]

const ATTRACTIONS = [
  { key: 'attraction_1_image', name: '차른협곡', nameEn: 'Charyn Canyon', country: '카자흐스탄', tag: '하이킹', tagColor: 'bg-orange-100 text-orange-700', icon: '🏔️', desc: '"카자흐스탄의 그랜드캐니언"으로 불리는 대협곡. 수백만 년의 지각 변동이 만들어낸 붉은 암벽이 12km에 걸쳐 펼쳐집니다.', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80' },
  { key: 'attraction_2_image', name: '알틴아라샨', nameEn: 'Altyn Arashan', country: '키르기스스탄', tag: '트레킹', tagColor: 'bg-green-100 text-green-700', icon: '🌿', desc: '키르기스 비경의 극치. 눈 덮인 봉우리와 원시림, 맑은 계곡이 어우러진 트레킹 명소. 산악차량으로만 접근 가능한 자연의 보고.', image: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=600&q=80' },
  { key: 'attraction_3_image', name: '이식쿨 호수 크루즈', nameEn: 'Issyk-Kul Cruise', country: '키르기스스탄', tag: '크루즈', tagColor: 'bg-blue-100 text-blue-700', icon: '⛵', desc: '세계에서 두 번째로 큰 산악호수에서 핑거푸드와 음료를 즐기며 설산을 배경으로 한 절경을 만끽하는 유람선 체험. (수영복 개별 준비)', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
  { key: 'attraction_4_image', name: '암각화 & 박물관', nameEn: 'Petroglyphs & Museum', country: '키르기스스탄', tag: '역사·문화', tagColor: 'bg-purple-100 text-purple-700', icon: '🏛️', desc: '수천 년 전 중앙아시아 유목민이 새긴 암각화와 이식쿨 지역의 역사·문화를 담은 르호드도 박물관. 실크로드 문명의 흔적.', image: 'https://images.unsplash.com/photo-1531219572328-a0171b4448a3?w=600&q=80' },
  { key: 'attraction_5_image', name: 'Issyk-Ata 노천유황온천', nameEn: 'Issyk-Ata Hot Springs', country: '키르기스스탄', tag: '온천·힐링', tagColor: 'bg-pink-100 text-pink-700', icon: '♨️', desc: '으슥아따(Issyk-Ata) 산간 대자연 속 노천유황온천. 바비큐 석식과 함께 유황온천·사우나를 즐기며 여행의 피로를 씻어내는 특별한 힐링 타임.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80' },
  { key: 'attraction_6_image', name: '침블락 케이블카', nameEn: 'Shymbulak Cable Car', country: '카자흐스탄', tag: '산악관광', tagColor: 'bg-amber-100 text-amber-700', icon: '🚡', desc: '알마티 외곽에 위치한 침블락 스키 리조트. 케이블카를 타고 해발 3,200m까지 올라 텐샨 산맥의 웅장한 파노라마를 감상하는 잊지 못할 고산 체험.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
]

const INCLUDES = ['전 일정 숙박 (호텔 2인 1실 기준)', '전 일정 대형버스 및 산악차량 가스66 2대', '한국어 가이드 1명 / 보조가이드 1명', '전 일정 식사 및 간식', '전 일정 입장료', '1억원 여행자 보험', '항공권 (ZE135/ZE136)']
const EXCLUDES = ['개인 경비 (쇼핑, 음료 등)', '싱글 차지 (전 일정 200달러)', '여권 발급비용', '기타 개인 사유로 인한 추가 비용']
const NOTICES = ['호텔은 현지 사정에 따라 동급 호텔로 변경될 수 있습니다.', '비자: 한국 여권 소지자 카자흐스탄·키르기스스탄 무비자 입국 가능 (60일)', '환율: 현지에서 달러 → 텡게(KZT)/솜(KGS) 환전 권장', '복장: 트레킹 시 등산화 및 방풍 재킷 필수 지참', '카드: 현지 카드 사용 제한적, 달러 현금 지참 권장', '일정은 현지 상황에 따라 일부 변경될 수 있습니다.']

export default function LandingPage() {
  const [activeDay, setActiveDay] = useState(1)
  const [showFlight, setShowFlight] = useState(false)
  const [photoIdx, setPhotoIdx] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [heroVideoReady, setHeroVideoReady] = useState(false)
  const [dayVideoReady, setDayVideoReady] = useState(false)
  const [form, setForm] = useState({ name: '', english_name: '', phone: '', gender: '', department: '', meal_pref: '', note: '', passport_image: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')
  const [passportUploading, setPassportUploading] = useState(false)
  const [passportFileName, setPassportFileName] = useState('')
  const passportRef = useRef<HTMLInputElement>(null)
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({})

  const itineraryRef   = useRef<HTMLElement>(null)
  const hotelsRef      = useRef<HTMLElement>(null)
  const attractionsRef = useRef<HTMLElement>(null)
  const infoRef        = useRef<HTMLElement>(null)
  const applyRef       = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('/api/config').then(r => r.json()).then(setSiteConfig).catch(() => {})
  }, [])

  useEffect(() => { setPhotoIdx(0); setDayVideoReady(false) }, [activeDay])

  function scrollTo(ref: React.RefObject<HTMLElement | null>) {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMobileMenuOpen(false)
  }

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length < 4) return digits
    if (digits.startsWith('02')) {
      if (digits.length < 7) return `${digits.slice(0, 2)}-${digits.slice(2)}`
      if (digits.length < 10) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`
      return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`
    }
    if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`
    if (digits.length < 11) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }

  async function handlePassport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPassportUploading(true)
    try {
      const blob = await upload(`kg-tour/passport-${Date.now()}-${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/upload-token',
        clientPayload: '__passport__',
      })
      setForm(p => ({ ...p, passport_image: blob.url }))
      setPassportFileName(file.name)
    } catch {
      setFormError('여권 업로드에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setPassportUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!form.name.trim() || !form.phone.trim()) {
      setFormError('이름과 연락처는 필수 입력 항목입니다.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setFormError(data.error || '오류가 발생했습니다.')
      } else {
        setSubmitted(true)
      }
    } catch {
      setFormError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  const cur = ITINERARY[activeDay - 1]

  const dayVideo = siteConfig[`day_${activeDay}_video`]
  const dayImgs = Array.from({ length: 5 }, (_, i) => siteConfig[`day_${activeDay}_img_${i + 1}`]).filter(Boolean)
  const displayImgs = dayImgs.length > 0 ? dayImgs : [cur.image]
  const safeIdx = Math.min(photoIdx, displayImgs.length - 1)

  const navItems = [
    { label: '일정표',   ref: itineraryRef },
    { label: '호텔정보', ref: hotelsRef },
    { label: '관광지',   ref: attractionsRef },
    { label: '안내사항', ref: infoRef },
    { label: '참가신청', ref: applyRef },
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* GNB */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {siteConfig.brand_logo
              ? <img src={siteConfig.brand_logo} alt="아이스타홀딩스" className="h-10 w-auto object-contain" />
              : <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center text-[#0d2340] font-black text-sm select-none">iS</div>
            }
            <div>
              <div className="text-[#0d2340] font-bold text-sm leading-tight">아이스타홀딩스</div>
              <div className="text-amber-500 text-[10px] font-medium tracking-wider">iStar Holdings</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <a href="/kyrgyzstan" className="px-4 py-2 text-sm font-medium rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors mr-1">About 키르기스스탄</a>
            {navItems.map(item => (
              <button key={item.label} onClick={() => scrollTo(item.ref)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${item.label === '참가신청' ? 'bg-amber-400 text-[#0d2340] font-bold hover:bg-amber-300 ml-2' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
                {item.label}
              </button>
            ))}
          </nav>
          <button className="md:hidden text-gray-700 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen
              ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            }
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <a href="/kyrgyzstan" className="block w-full text-left px-6 py-3 text-gray-700 hover:text-white hover:bg-gray-700 text-sm font-medium transition-colors">
              About 키르기스스탄
            </a>
            {navItems.map(item => (
              <button key={item.label} onClick={() => scrollTo(item.ref)}
                className="w-full text-left px-6 py-3 text-gray-700 hover:text-white hover:bg-gray-700 text-sm font-medium transition-colors">
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative w-full aspect-video min-h-[55vh] sm:min-h-[320px] flex items-center justify-center overflow-hidden">
        {/* 배경 이미지: 항상 base layer (영상 로딩 중 fallback) */}
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        {/* 영상: 준비 완료 시에만 페이드인 (버퍼링 화면 노출 없음) */}
        {siteConfig.hero_video && (
          <video
            key={siteConfig.hero_video}
            autoPlay muted loop playsInline preload="auto"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${heroVideoReady ? 'opacity-100' : 'opacity-0'}`}
            onCanPlay={() => setHeroVideoReady(true)}
          >
            <source src={siteConfig.hero_video} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d2340]/70 via-[#0d2340]/50 to-[#0d2340]/85" />
        <div className="relative z-10 text-center px-4 animate-fadeInUp">
          <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/40 text-amber-300 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-sm font-medium mb-3 sm:mb-6 backdrop-blur-sm">
            <span>✈️</span><span>2026년 8월 18일 출발 · 4박6일</span>
          </div>
          <h1 className="text-white text-2xl sm:text-5xl md:text-6xl font-black leading-tight mb-2 sm:mb-4">
            중앙아시아<br /><span className="text-amber-400">카자흐스탄 · 키르기스스탄</span>
          </h1>
          <p className="text-white/80 text-sm sm:text-2xl font-light mb-1 sm:mb-2">4박6일 첫 일정</p>
          <p className="text-white/50 text-[11px] sm:text-sm mb-4 sm:mb-10">차른협곡 · 알틴아라샨 · 이식쿨 호수 · 침블락</p>
          <div className="flex flex-row items-center justify-center gap-2 sm:gap-3">
            <button onClick={() => scrollTo(applyRef)} className="px-4 py-2 sm:px-8 sm:py-3.5 bg-amber-400 hover:bg-amber-300 text-[#0d2340] font-bold rounded-lg sm:rounded-xl text-xs sm:text-base transition-all shadow-lg hover:-translate-y-0.5">
              참가 신청하기
            </button>
            <button onClick={() => scrollTo(itineraryRef)} className="px-4 py-2 sm:px-8 sm:py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg sm:rounded-xl text-xs sm:text-base transition-all border border-white/20 backdrop-blur-sm">
              일정 보기
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </section>

      {/* 하이라이트 */}
      <section className="bg-[#0d2340] py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {[
              { num: '01', icon: '🏔️', title: '대자연 어드벤처', sub: '차른협곡 하이킹\n& 알틴아라샨 트레킹' },
              { num: '02', icon: '⛵', title: '이식쿨 크루즈', sub: '세계 2위 산악호수\n유람선 & 핑거푸드' },
              { num: '03', icon: '♨️', title: '노천온천 힐링', sub: '설산 아래\n천연 유황온천' },
              { num: '04', icon: '🏨', title: '프리미엄 숙박', sub: '전 일정\n4~5성급 호텔' },
              { num: '05', icon: '🤝', title: '회원 전용 스페셜', sub: '아이스타 회원전용\n& 네트워킹' },
              { num: '06', icon: '🗺️', title: '한국인 가이드', sub: '전문 한국어 가이드\n& 알찬 식사 구성' },
            ].map(item => (
              <div key={item.num} className="flex flex-col items-center text-center px-1.5 sm:px-3 py-3 sm:py-5 rounded-xl border border-white/10 hover:border-amber-400/40 hover:bg-white/5 transition-all">
                <div className="text-[10px] sm:text-[20px] font-bold text-amber-400/50 tracking-widest mb-1 sm:mb-2">{item.num}</div>
                <div className="text-lg sm:text-2xl mb-1 sm:mb-2">{item.icon}</div>
                <div className="text-white font-bold text-[9px] sm:text-sm mb-0 sm:mb-1.5 leading-tight">{item.title}</div>
                <div className="hidden sm:block text-white/40 text-[11px] leading-relaxed whitespace-pre-line">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 일정표 */}
      <section ref={itineraryRef} className="py-12 bg-gray-50 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6">
            <span className="inline-block bg-amber-400 text-[#0d2340] px-5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">Itinerary</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0d2340] mt-2">상세 일정표</h2>
          </div>
          <div className="flex overflow-x-auto gap-2 mb-5 pb-2 justify-start md:justify-center">
            {ITINERARY.map(it => (
              <button key={it.day} onClick={() => { setActiveDay(it.day); setShowFlight(false) }}
                className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${!showFlight && activeDay === it.day ? 'bg-[#0d2340] text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}>
                DAY {it.day}
                <div className={`text-[10px] font-normal mt-0.5 ${!showFlight && activeDay === it.day ? 'text-amber-300' : 'text-gray-400'}`}>{it.date.replace('8월 ', '')}</div>
              </button>
            ))}
            <button onClick={() => setShowFlight(true)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${showFlight ? 'bg-amber-400 text-[#0d2340] shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}>
              ✈️ 항공정보
              <div className={`text-[10px] font-normal mt-0.5 ${showFlight ? 'text-[#0d2340]/70' : 'text-gray-400'}`}>ZE135/136</div>
            </button>
          </div>
          {showFlight ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="grid md:grid-cols-5">
                {/* 좌측 헤더 패널 - 항공 사진 배경 */}
                <div className="md:col-span-2 relative h-56 md:h-auto min-h-[260px] overflow-hidden bg-[#1a3a6e]">
                  <img src="/flight.jpg" alt="이스타항공" className="absolute inset-0 w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0d2340]/60 via-transparent to-[#0d2340]/40" />
                  <div className="absolute top-4 right-4 text-right">
                    <div className="text-amber-400 text-[10px] font-bold tracking-widest uppercase mb-0.5">Flight Information</div>
                    <div className="text-white text-base font-black">항공 운항 정보</div>
                    <div className="text-white/70 text-xs mt-1">이스타항공 (ZE)</div>
                    <div className="text-white/60 text-xs">인천 ↔ 알마티 직항</div>
                    <div className="mt-2 flex gap-1.5 justify-end">
                      <span className="bg-black/30 text-white/80 text-[10px] font-mono px-2 py-0.5 rounded-full backdrop-blur-sm">ZE135</span>
                      <span className="bg-black/30 text-white/80 text-[10px] font-mono px-2 py-0.5 rounded-full backdrop-blur-sm">ZE136</span>
                    </div>
                  </div>
                </div>
                {/* 우측 콘텐츠 */}
                <div className="md:col-span-3 p-5 sm:p-6 space-y-3">
                  {/* 가는 편 */}
                  <div className="border border-blue-100 rounded-xl overflow-hidden">
                    <div className="bg-blue-50 px-3 py-1.5 flex items-center gap-2">
                      <span className="text-blue-600 font-bold text-xs">가는 편 ZE135</span>
                      <span className="ml-auto text-gray-400 text-xs">8월 18일 (화)</span>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between">
                      <div className="text-center">
                        <div className="text-xl font-black text-[#0d2340]">19:25</div>
                        <div className="text-xs font-bold text-gray-600">ICN · 인천</div>
                      </div>
                      <div className="flex-1 px-3 text-center">
                        <div className="text-[10px] text-gray-400 mb-1">약 6시간 15분</div>
                        <div className="flex items-center"><div className="flex-1 h-px bg-gray-200"/><span className="mx-1.5 text-amber-400 text-sm">✈</span><div className="flex-1 h-px bg-gray-200"/></div>
                        <div className="text-[10px] text-gray-300 mt-1">직항</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-black text-[#0d2340]">22:40</div>
                        <div className="text-xs font-bold text-gray-600">ALA · 알마티</div>
                      </div>
                    </div>
                  </div>
                  {/* 오는 편 */}
                  <div className="border border-amber-100 rounded-xl overflow-hidden">
                    <div className="bg-amber-50 px-3 py-1.5 flex items-center gap-2">
                      <span className="text-amber-600 font-bold text-xs">오는 편 ZE136</span>
                      <span className="ml-auto text-gray-400 text-xs">8월 22일 (토) → 23일 (일)</span>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between">
                      <div className="text-center">
                        <div className="text-xl font-black text-[#0d2340]">23:40</div>
                        <div className="text-xs font-bold text-gray-600">ALA · 알마티</div>
                      </div>
                      <div className="flex-1 px-3 text-center">
                        <div className="text-[10px] text-gray-400 mb-1">약 7시간 25분</div>
                        <div className="flex items-center"><div className="flex-1 h-px bg-gray-200"/><span className="mx-1.5 text-amber-400 text-sm">✈</span><div className="flex-1 h-px bg-gray-200"/></div>
                        <div className="text-[10px] text-gray-300 mt-1">직항</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-black text-[#0d2340]">10:05 <span className="text-sm text-amber-500">+1</span></div>
                        <div className="text-xs font-bold text-gray-600">ICN · 인천</div>
                      </div>
                    </div>
                  </div>
                  {/* 수하물 */}
                  <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-4">
                    <span className="text-lg">🧳</span>
                    <div className="flex gap-5 flex-1">
                      <div>
                        <div className="text-[10px] text-gray-400">위탁 수하물</div>
                        <div className="font-black text-[#0d2340] text-base">15kg</div>
                        <div className="text-[10px] text-gray-400">1인 1개</div>
                      </div>
                      <div className="w-px bg-gray-200" />
                      <div>
                        <div className="text-[10px] text-gray-400">기내 수하물</div>
                        <div className="font-black text-[#0d2340] text-base">10kg</div>
                        <div className="text-[10px] text-gray-400">115cm 이하</div>
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-300 hidden sm:block">※ 규정은 변경될 수 있습니다</div>
                  </div>
                  {/* 기내식 */}
                  <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🍱</span>
                      <div>
                        <div className="text-[10px] text-gray-400">기내식</div>
                        <div className="font-black text-[#0d2340] text-base">유료</div>
                        <div className="text-[10px] text-gray-400">사전 구매 시 할인 혜택</div>
                      </div>
                    </div>
                    <a
                      href="https://www.eastarjet.com/newstar/PGWIS00001"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 px-3 py-1.5 bg-orange-400 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      사전 구매 →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="grid md:grid-cols-5">
                <div className="md:col-span-2 relative h-64 sm:h-72 md:h-auto min-h-[260px] overflow-hidden">
                  <img
                    key={displayImgs[safeIdx]}
                    src={displayImgs[safeIdx]}
                    alt={cur.regions}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  />
                  {dayVideo && (
                    <video
                      key={dayVideo}
                      autoPlay muted loop playsInline preload="auto"
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${dayVideoReady ? 'opacity-100' : 'opacity-0'}`}
                      onCanPlay={() => setDayVideoReady(true)}
                    >
                      <source src={dayVideo} type="video/mp4" />
                    </video>
                  )}
                  {!dayVideo && displayImgs.length > 1 && (
                    <>
                      <button
                        onClick={() => setPhotoIdx(i => (i - 1 + displayImgs.length) % displayImgs.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white text-xs transition-colors"
                      >‹</button>
                      <button
                        onClick={() => setPhotoIdx(i => (i + 1) % displayImgs.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white text-xs transition-colors"
                      >›</button>
                      <div className="absolute bottom-[72px] left-0 right-0 flex justify-center gap-1.5 z-10">
                        {displayImgs.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setPhotoIdx(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${i === safeIdx ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d2340]/80 to-transparent flex flex-col justify-end p-6">
                    <div className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-1">DAY {cur.day} · {cur.date}</div>
                    <div className="text-white text-xl font-black">{cur.regions}</div>
                    <div className="text-white/70 text-sm mt-1">{cur.highlight}</div>
                  </div>
                </div>
                <div className="md:col-span-3 p-5 sm:p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0d2340]/5 text-[#0d2340] rounded-full text-xs font-semibold">🚌 {cur.transport}</span>
                    {cur.mealDetail && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold">🍽️ {cur.mealDetail}</span>}
                  </div>
                  <div className="space-y-2.5 mb-4">
                    {cur.schedules.map((s, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="w-14 shrink-0 text-right"><span className="text-xs font-mono text-amber-600 font-bold">{s.time}</span></div>
                        <div className="flex items-start gap-2 flex-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          <span className="text-sm text-gray-700 leading-relaxed">{s.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {cur.hotel && cur.hotel.stars > 0 && (
                    <div className="bg-[#0d2340]/5 rounded-xl p-4 flex items-center gap-3">
                      <div className="text-2xl">🏨</div>
                      <div>
                        <div className="text-xs text-gray-400 mb-0.5">숙소</div>
                        <div className="font-bold text-[#0d2340] text-sm">{cur.hotel.nameKo}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-amber-400 text-sm">{'★'.repeat(cur.hotel.stars)}</span>
                          <span className="text-xs text-gray-400">{cur.hotel.location}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {cur.hotel && cur.hotel.stars === 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                      <div className="text-2xl">✈️</div>
                      <div className="text-sm text-gray-500">기내 숙박 — ZE136 귀국편 탑승</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-center gap-3 mt-6">
            {showFlight ? (
              <button onClick={() => { setActiveDay(6); setShowFlight(false) }}
                className="px-5 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">← DAY 6으로</button>
            ) : (
              <>
                <button onClick={() => setActiveDay(d => Math.max(1, d - 1))} disabled={activeDay === 1}
                  className="px-5 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-all">← 이전 일정</button>
                {activeDay === 6
                  ? <button onClick={() => setShowFlight(true)}
                      className="px-5 py-2 bg-amber-400 text-[#0d2340] rounded-lg text-sm font-semibold hover:bg-amber-300 transition-all">✈️ 항공정보 보기</button>
                  : <button onClick={() => setActiveDay(d => Math.min(6, d + 1))}
                      className="px-5 py-2 bg-[#0d2340] text-white rounded-lg text-sm font-semibold hover:bg-[#0d2340]/90 transition-all">다음 일정 →</button>
                }
              </>
            )}
          </div>
        </div>
      </section>

      {/* 호텔 정보 */}
      <section ref={hotelsRef} className="py-12 bg-white scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6">
            <span className="inline-block bg-amber-400 text-[#0d2340] px-5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">Accommodation</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0d2340] mt-2">호텔 정보</h2>
            <p className="text-gray-400 mt-2 text-sm">전 일정 4~5성급 호텔, 2인 1실 기준</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOTELS_BASE.map(h => {
              const image = siteConfig[h.key] || h.fallback
              return (
              <div key={h.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                <div className="relative h-36 overflow-hidden">
                  <img src={image} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3"><span className="bg-[#0d2340] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">{h.night}</span></div>
                  <div className="absolute top-3 right-3"><span className="bg-amber-400 text-[#0d2340] text-[11px] font-bold px-2 py-1 rounded-full">{'★'.repeat(h.stars)}</span></div>
                </div>
                <div className="p-3">
                  <div className="text-[11px] text-amber-600 font-semibold mb-0.5">{h.location}</div>
                  <div className="font-bold text-[#0d2340] text-sm mb-0.5">{h.nameKo}</div>
                  <div className="text-gray-400 text-[11px] mb-2">{h.name}</div>
                  <p className="text-gray-500 text-xs leading-relaxed">{h.desc}</p>
                </div>
              </div>
            )})}
          </div>
          <p className="text-center text-gray-400 text-xs mt-6">※ 호텔은 현지 사정에 따라 동급 호텔로 변경될 수 있습니다.</p>
        </div>
      </section>

      {/* 관광지 */}
      <section ref={attractionsRef} className="py-12 bg-gray-50 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6">
            <span className="inline-block bg-amber-400 text-[#0d2340] px-5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">Attractions</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0d2340] mt-2">주요 관광지</h2>
            <p className="text-gray-400 mt-2 text-sm">중앙아시아의 숨겨진 보석을 만나다</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ATTRACTIONS.map(a => (
              <div key={a.name} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                <div className="relative h-40 overflow-hidden">
                  <img src={siteConfig[a.key] || a.image} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <span className="text-2xl">{a.icon}</span>
                    <div>
                      <div className="text-white font-black text-base leading-tight">{a.name}</div>
                      <div className="text-white/70 text-[11px]">{a.nameEn}</div>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3"><span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${a.tagColor}`}>{a.tag}</span></div>
                </div>
                <div className="p-4">
                  <div className="text-[11px] text-gray-400 mb-1 font-medium">📍 {a.country}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 안내사항 */}
      <section ref={infoRef} className="py-12 bg-white scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-6">
            <span className="inline-block bg-amber-400 text-[#0d2340] px-5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">Information</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0d2340] mt-2">안내사항</h2>
          </div>
          <div className="bg-[#0d2340] rounded-2xl p-5 mb-4">
            <h3 className="font-black text-white text-base mb-4 flex items-center gap-2"><span>💳</span> 상품가 &amp; 입금 안내</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-white/40 text-[11px] font-semibold tracking-widest uppercase mb-1.5">1인당 상품가</div>
                <div className="text-amber-400 font-black text-3xl">286만원</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-white/40 text-[11px] font-semibold tracking-widest uppercase mb-1.5">입금 계좌</div>
                <div className="text-white font-bold text-lg">우리은행</div>
                <div className="text-amber-300 font-mono text-base mt-0.5">1005-604-698509</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-white/40 text-[11px] font-semibold tracking-widest uppercase mb-1.5">예금주</div>
                <div className="text-white font-bold text-lg">(주)아이스타홀딩스</div>
              </div>
            </div>
            <div className="mt-3 bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-3 flex items-center justify-center gap-2">
              <span className="text-red-300 text-sm">⏰</span>
              <span className="text-red-200 text-sm font-bold">입금마감일: 6/5(금)</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
              <h3 className="font-black text-green-800 text-lg mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">✓</span>포함사항
              </h3>
              <ul className="space-y-2">
                {INCLUDES.map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-green-800">
                    <span className="text-green-500 mt-0.5 shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
              <h3 className="font-black text-red-800 text-lg mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-red-400 rounded-full flex items-center justify-center text-white text-sm font-bold">✗</span>불포함사항
              </h3>
              <ul className="space-y-2">
                {EXCLUDES.map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-red-800">
                    <span className="text-red-400 mt-0.5 shrink-0">✗</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <h3 className="font-black text-amber-800 text-base mb-3 flex items-center gap-2"><span>⚠️</span> 유의사항</h3>
            <ul className="grid sm:grid-cols-2 gap-2">
              {NOTICES.map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-amber-800">
                  <span className="text-amber-500 mt-0.5 shrink-0">•</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 참가 신청 */}
      <section ref={applyRef} id="apply" className="py-12 bg-[#0d2340] scroll-mt-16">
        <div className="max-w-xl mx-auto px-4">
          <div className="text-center mb-6">
            <span className="inline-block bg-amber-400 text-[#0d2340] px-5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">Apply</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">참가 신청</h2>
            <p className="text-white/50 mt-2 text-sm">신청 후 담당자가 개별 연락 드립니다.</p>
          </div>
          {submitted ? (
            <div className="bg-white/10 rounded-2xl p-10 text-center border border-white/10">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-white text-xl font-black mb-2">신청이 완료되었습니다!</h3>
              <p className="text-white/60 text-sm">담당자 확인 후 개별 연락 드리겠습니다.<br />중앙아시아에서 함께해요! ✈️</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
              {/* 이름 + 영문이름 */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-xs font-semibold mb-1.5">이름 <span className="text-amber-400">*</span></label>
                  <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="홍길동"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-white/70 text-xs font-semibold mb-1.5">영문이름 <span className="text-white/30 font-normal">(여권 기재 영문)</span></label>
                  <input type="text" value={form.english_name} onChange={e => setForm(p => ({ ...p, english_name: e.target.value }))} placeholder="HONG GIL DONG"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors uppercase" />
                </div>
              </div>

              {/* 연락처 + 성별 */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-xs font-semibold mb-1.5">연락처 <span className="text-amber-400">*</span></label>
                  <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: formatPhone(e.target.value) }))} placeholder="010-0000-0000"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-white/70 text-xs font-semibold mb-1.5">성별</label>
                  <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors appearance-none cursor-pointer">
                    <option value="" className="text-gray-800">선택</option>
                    <option value="남성" className="text-gray-800">남성</option>
                    <option value="여성" className="text-gray-800">여성</option>
                  </select>
                </div>
              </div>

              {/* 회사명/소속 */}
              <div>
                <label className="block text-white/70 text-xs font-semibold mb-1.5">회사명 / 소속</label>
                <input type="text" value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} placeholder="예) ○○주식회사"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors" />
              </div>

              {/* 여권사본 첨부 */}
              <div>
                <label className="block text-white/70 text-xs font-semibold mb-1.5">여권사본 첨부</label>
                <div
                  onClick={() => !passportUploading && passportRef.current?.click()}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                    form.passport_image
                      ? 'border-amber-400/60 bg-amber-400/10'
                      : passportUploading
                      ? 'border-white/20 bg-white/5 cursor-not-allowed'
                      : 'border-white/20 hover:border-amber-400/50 hover:bg-white/5'
                  }`}
                >
                  <span className="text-lg">{form.passport_image ? '✅' : passportUploading ? '⏳' : '📎'}</span>
                  <span className="text-sm text-white/60 flex-1 truncate">
                    {passportUploading ? '업로드 중...' : form.passport_image ? passportFileName || '업로드 완료' : 'JPG / PNG / PDF 파일 선택'}
                  </span>
                  {form.passport_image && (
                    <button type="button" onClick={e => { e.stopPropagation(); setForm(p => ({ ...p, passport_image: '' })); setPassportFileName('') }}
                      className="text-white/30 hover:text-white/70 text-xs">✕</button>
                  )}
                </div>
                <input ref={passportRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handlePassport} />
              </div>

              {/* 기타 문의 */}
              <div>
                <label className="block text-white/70 text-xs font-semibold mb-1.5">기타 문의 / 요청사항</label>
                <textarea value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="기타 문의사항을 입력해주세요." rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors resize-none" />
              </div>

              {formError && <div className="bg-red-500/20 border border-red-400/30 text-red-300 rounded-lg px-4 py-2.5 text-sm">{formError}</div>}
              <button type="submit" disabled={submitting || passportUploading}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-[#0d2340] font-black text-base rounded-xl transition-all disabled:opacity-50 shadow-lg">
                {submitting ? '제출 중...' : '신청서 제출하기 →'}
              </button>

              {/* 문의처 */}
              <div className="pt-2 border-t border-white/10 text-center">
                <p className="text-white/40 text-xs">문의사항</p>
                <p className="text-white/70 text-sm font-semibold mt-0.5">(주)아이스타홀딩스 여행 상담 | 강래구 팀장 | ☎ 010-7107-4613</p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 카카오톡 플로팅 버튼 */}
      <a
        href="http://pf.kakao.com/_dQQgn/chat"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#FEE500] hover:bg-[#f5dc00] text-[#3A1D1D] font-bold text-sm px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 group"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C6.48 3 2 6.92 2 11.75c0 3.01 1.74 5.67 4.37 7.24L5.25 22l3.92-2.06c.9.25 1.85.38 2.83.38 5.52 0 10-3.92 10-8.75S17.52 3 12 3z"/>
        </svg>
        <span>카카오톡 상담</span>
      </a>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {siteConfig.brand_logo
              ? <img src={siteConfig.brand_logo} alt="아이스타홀딩스" className="h-9 w-auto object-contain" />
              : <div className="w-9 h-9 bg-amber-400 rounded-lg flex items-center justify-center text-[#0d2340] font-black text-sm">iS</div>
            }
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

import { IMG } from '../api'

// 글자형 아이콘 (그라데이션 원)
const TEXT_ICONS = [
  { label: '오리지널', text: 'ORIGINAL', bg: 'linear-gradient(135deg,#ff5e7e,#e3003b)', target: 'popular_tv' },
  { label: '인기 영화', text: 'MOVIE', bg: 'linear-gradient(135deg,#3a3a3a,#111)', target: 'popular_movie' },
  { label: '공개예정', text: 'SOON', bg: 'linear-gradient(135deg,#ffb23e,#ff6a00)', target: 'upcoming' },
  { label: '평점 높은 영화', text: 'TOP', bg: 'linear-gradient(135deg,#ff7a2f,#e84a00)', target: 'top_rated' },
  { label: '오늘 뭐 볼까?', text: '👀', bg: 'linear-gradient(135deg,#e04bff,#8a2be2)', target: 'trending' },
  { label: '극장 상영작', text: 'CLIP', bg: 'linear-gradient(135deg,#7b5cff,#c04bff)', target: 'now_playing' },
]

const scrollToSection = (key) =>
  document.getElementById(`row-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })

export default function QuickMenu({ picks = [], onSelect }) {

  // 글자형 아이콘과 작품 이미지 아이콘을 번갈아 배치
  const items = []
  TEXT_ICONS.forEach((t, i) => {
    items.push({ type: 'text', ...t })
    if (picks[i]) items.push({ type: 'image', item: picks[i], isNew: i % 2 === 0 })
  })

  return (
    <nav className="quick" aria-label="바로가기">
      <ul className="quick-list">
        {items.map((it, i) =>
          it.type === 'text' ? (
            <li key={`t${i}`}>
              <button className="quick-item" onClick={() => scrollToSection(it.target)}>
                <span className="quick-circle quick-text" style={{ background: it.bg }}>{it.text}</span>
                <span className="quick-label">{it.label}</span>
              </button>
            </li>
          ) : (
            <li key={`i${it.item.id}`}>
              <button className="quick-item" onClick={() => onSelect(it.item)}>
                <span className="quick-circle">
                  <img src={IMG(it.item.profile_path || it.item.poster_path, 'w185')} alt="" />
                </span>
                {it.isNew && <span className="quick-badge">N</span>}
                <span className="quick-label">{it.item.title || it.item.name}</span>
              </button>
            </li>
          )
        )}
      </ul>
    </nav>
  )
}

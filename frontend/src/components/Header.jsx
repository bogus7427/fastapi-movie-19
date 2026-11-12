import { useEffect, useState } from 'react'

export default function Header({ onSearch }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', f)
    return () => window.removeEventListener('scroll', f)
  }, [])

  const goHome = (e) => {
    e.preventDefault()
    setQ('')
    setOpen(false)
    onSearch('')
  }

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-left">
        <a className="logo" href="/" onClick={goHome}>MOVIE TV</a>
        <nav>
          <a>라이브</a>
          <a>TV프로그램</a>
          <a>영화</a>
          <a>오리지널</a>
        </nav>
      </div>
      <div className="header-right">
        {open && (
          <form onSubmit={(e) => { e.preventDefault(); onSearch(q.trim()) }}>
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="제목, 인물명으로 검색해보세요." />
          </form>
        )}
        <button className="icon-btn" onClick={() => setOpen(!open)} aria-label="검색">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
        <div className="profile" />
      </div>
    </header>
  )
}

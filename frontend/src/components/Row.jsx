import { useRef } from 'react'
import { IMG } from '../api'

export default function Row({ title, items, onSelect, ranked = false, wrap = false }) {
  const ref = useRef(null)
  const scroll = (dir) =>
    ref.current.scrollBy({ left: dir * ref.current.clientWidth * 0.9, behavior: 'smooth' })

  const list = items.filter((m) => m.poster_path)

  return (
    <section className="row">
      <h2>{title}</h2>
      <div className="row-wrap">
        {!wrap && <button className="arrow left" onClick={() => scroll(-1)}>‹</button>}
        <div className={`row-list ${wrap ? 'grid' : ''} ${ranked ? 'ranked' : ''}`} ref={ref}>
          {list.map((m, i) => (
            <div className="card" key={`${m.id}-${i}`} onClick={() => onSelect(m)}>
              {ranked && <span className="rank">{i + 1}</span>}
              <img src={IMG(m.poster_path, 'w342')} alt={m.title || m.name} loading="lazy" />
              {!ranked && <p className="card-title">{m.title || m.name}</p>}
            </div>
          ))}
        </div>
        {!wrap && <button className="arrow right" onClick={() => scroll(1)}>›</button>}
      </div>
    </section>
  )
}

import { useEffect, useState } from 'react'
import { fetchDetail, IMG } from '../api'

export default function DetailModal({ item, onClose }) {
  const media = item.media_type || (item.title ? 'movie' : 'tv')
  const [d, setD] = useState(null)

  useEffect(() => {
    fetchDetail(media, item.id).then(setD).catch(() => setD(null))
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [item, media])

  const data = d || item
  const trailer = d?.videos?.results?.find((v) => v.site === 'YouTube' && v.type === 'Trailer')
  const date = data.release_date || data.first_air_date || ''

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="닫기">✕</button>
        <div className="modal-top" style={{ backgroundImage: `url(${IMG(data.backdrop_path, 'w1280')})` }}>
          <div className="modal-shade" />
          <h2>{data.title || data.name}</h2>
        </div>
        <div className="modal-body">
          <div className="meta">
            <span className="score">★ {data.vote_average?.toFixed(1)}</span>
            {date && <span>{date.slice(0, 4)}</span>}
            {d?.runtime ? <span>{d.runtime}분</span> : null}
            {d?.number_of_seasons ? <span>시즌 {d.number_of_seasons}</span> : null}
            {d?.genres?.map((g) => <span key={g.id} className="tag">{g.name}</span>)}
          </div>
          <p className="overview">{data.overview || '줄거리 정보가 없습니다.'}</p>
          {d?.credits?.cast?.length > 0 && (
            <p className="cast"><b>출연</b> {d.credits.cast.slice(0, 6).map((c) => c.name).join(', ')}</p>
          )}
          {trailer && (
            <iframe className="trailer" src={`https://www.youtube.com/embed/${trailer.key}`} title="trailer" allowFullScreen />
          )}
        </div>
      </div>
    </div>
  )
}

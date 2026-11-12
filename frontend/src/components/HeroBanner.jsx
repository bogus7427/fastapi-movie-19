import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { IMG } from '../api'

const cut = (text, n = 120) => (text && text.length > n ? text.slice(0, n) + '…' : text)

export default function HeroBanner({ items, onSelect }) {
  return (
    <section className="hero">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        navigation
        pagination={{ clickable: true }}
        className="hero-swiper"
      >
        {items.map((m) => (
          <SwiperSlide key={m.id}>
            <div className="hero-bg" style={{ backgroundImage: `url(${IMG(m.backdrop_path, 'original')})` }} />
            <div className="hero-shade" />
            <div className="hero-content">
              <h1>{m.title || m.name}</h1>
              <p>{cut(m.overview)}</p>
              <button className="hero-btn" onClick={() => onSelect(m)}>상세 정보</button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

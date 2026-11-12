import { useEffect, useState } from 'react'
import { fetchHome, searchMulti } from './api'
import Header from './components/Header'
import HeroBanner from './components/HeroBanner'
import Row from './components/Row'
import DetailModal from './components/DetailModal'
import Footer from './components/Footer'

export default function App() {
  const [sections, setSections] = useState([])
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [results, setResults] = useState(null)

  useEffect(() => {
    fetchHome().then((d) => setSections(d.sections)).catch((e) => setError(e.message))
  }, [])

  const onSearch = async (q) => {
    if (!q) return setResults(null)
    try {
      const d = await searchMulti(q)
      setResults(d.results.filter((r) => r.media_type !== 'person'))
    } catch (e) {
      setError(e.message)
    }
  }

  const heroItems = sections[0]?.items.filter((m) => m.backdrop_path).slice(0, 6) ?? []

  return (
    <>
      <Header onSearch={onSearch} />
      {error && <p className="error">데이터를 불러오지 못했습니다: {error}</p>}
      {results ? (
        <main className="search-page">
          <Row title={`검색 결과 (${results.length})`} items={results} onSelect={setSelected} wrap />
        </main>
      ) : (
        <main>
          {heroItems.length > 0 && <HeroBanner items={heroItems} onSelect={setSelected} />}
          <div className="rows">
            {sections.map((s, i) => (
              <Row key={s.key} title={s.title} items={s.items} onSelect={setSelected} ranked={i === 0} />
            ))}
          </div>
        </main>
      )}
      <Footer />
      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

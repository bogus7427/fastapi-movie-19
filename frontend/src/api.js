export const IMG = (path, size = 'w500') => (path ? `https://image.tmdb.org/t/p/${size}${path}` : '')

async function get(url) {
  const r = await fetch(url)
  if (!r.ok) {
    const body = await r.json().catch(() => ({}))
    throw new Error(body.detail || r.statusText)
  }
  return r.json()
}

export const fetchHome = () => get('/api/home')
export const fetchDetail = (media, id) => get(`/api/${media}/${id}`)
export const searchMulti = (q) => get(`/api/search?q=${encodeURIComponent(q)}`)

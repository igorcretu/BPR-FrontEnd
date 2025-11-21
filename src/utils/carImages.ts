const imageCache = new Map<string, string | null>()

const buildKey = (brand: string, model: string, year: number): string =>
  `${brand.trim().toLowerCase()}|${model.trim().toLowerCase()}|${year}`

const buildQueries = (brand: string, model: string, year: number): string[] => [
  `${year} ${brand} ${model}`,
  `${brand} ${model}`,
  `${model}`,
]

const fetchImageFromWikimedia = async (query: string): Promise<string | null> => {
  const url =
    'https://commons.wikimedia.org/w/api.php?action=query' +
    `&generator=search&gsrsearch=${encodeURIComponent(query)}` +
    '&gsrnamespace=6' +
    '&gsrlimit=1&prop=imageinfo&iiprop=url&format=json&origin=*'

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Wikimedia responded with ${response.status}`)
  }

  const data = await response.json()
  const page = data?.query?.pages && Object.values(data.query.pages)[0]
  const imageURL = page?.imageinfo?.[0]?.url
  return (typeof imageURL === 'string' && imageURL.length > 0) ? imageURL : null
}

export const getCachedCarImage = (brand: string, model: string, year: number): string | null | undefined => {
  const key = buildKey(brand, model, year)
  return imageCache.has(key) ? imageCache.get(key) ?? null : undefined
}

export const fetchCarImage = async (brand: string, model: string, year: number): Promise<string | null> => {
  const key = buildKey(brand, model, year)
  if (imageCache.has(key)) {
    const cached = imageCache.get(key) ?? null
    return cached
  }

  const queries = buildQueries(brand, model, year)

  for (const query of queries) {
    try {
      const image = await fetchImageFromWikimedia(query)
      if (image) {
        imageCache.set(key, image)
        return image
      }
    } catch (error) {
      console.warn('Failed fetching car image', { brand, model, year, error })
    }
  }

  imageCache.set(key, null)
  return null
}

export const clearCarImageCache = () => imageCache.clear()

type CarImageDescriptor = {
  id?: string
  brand: string
  model: string
  year: number
}

const CACHE_VERSION = 'v2'
const memoryCache = new Map<string, string | null>()
const STORAGE_PREFIX = `car-image:${CACHE_VERSION}:`
const NULL_SENTINEL = '__NULL__'

const getCacheKey = ({ id, brand, model, year }: CarImageDescriptor) =>
  (id ?? `${brand}-${model}-${year}`).toLowerCase()

const readFromSession = (key: string): string | null | undefined => {
  if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') return undefined
  try {
    const raw = window.sessionStorage.getItem(`${STORAGE_PREFIX}${key}`)
    if (raw === null) return undefined
    if (raw === NULL_SENTINEL) return null
    return raw
  } catch {
    return undefined
  }
}

const writeToSession = (key: string, value: string | null) => {
  if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') return
  try {
    window.sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, value ?? NULL_SENTINEL)
  } catch {
    /* ignore session storage quota issues */
  }
}

const lookupCarImage = async (brand: string, model: string, year: number): Promise<string | null> => {
  const queries = [`${year} ${brand} ${model}`]
  const desiredWidth = 800

  for (const query of queries) {
    const url =
      'https://commons.wikimedia.org/w/api.php?action=query' +
      `&generator=search&gsrsearch=${encodeURIComponent(query)}` +
      '&gsrnamespace=6&gsrlimit=1&prop=imageinfo' +
      `&iiprop=url|dimensions&iiurlwidth=${desiredWidth}&format=json&origin=*`

    try {
      const response = await fetch(url)
      if (!response.ok) continue
      const data = (await response.json()) as {
        query?: {
          pages?: Record<string, {
            imageinfo?: Array<{ url?: string; thumburl?: string }>
          }>
        }
      }
      const firstPage = data.query?.pages && Object.values(data.query.pages)[0]
      const info = firstPage?.imageinfo?.[0]
      const imageURL = info?.thumburl ?? info?.url
      if (imageURL) return imageURL
    } catch {
      // Ignore network errors and continue with next query variant
    }
  }

  return null
}

export const getCarImage = async (descriptor: CarImageDescriptor): Promise<string | null> => {
  const key = getCacheKey(descriptor)

  if (memoryCache.has(key)) {
    return memoryCache.get(key) ?? null
  }

  const stored = readFromSession(key)
  if (stored !== undefined) {
    memoryCache.set(key, stored)
    return stored
  }

  const image = await lookupCarImage(descriptor.brand, descriptor.model, descriptor.year)
  memoryCache.set(key, image)
  writeToSession(key, image)
  return image
}

export const fetchRandomCarImage = lookupCarImage

export type { CarImageDescriptor }

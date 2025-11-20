const stripTrailingSlash = (value: string) => value.replace(/\/$/, '')

const API_BASE_URL = stripTrailingSlash(
  process.env.API_BASE_URL || process.env.VITE_API_URL || 'http://localhost:8000'
)

const buildCorsHeaders = (origin?: string) => ({
  'Access-Control-Allow-Origin': origin || '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
})

const filterHeaders = (headers: Record<string, string | undefined> = {}) => {
  const blocked = new Set(['host', 'content-length', 'origin', 'x-forwarded-for', 'x-forwarded-proto'])
  return Object.entries(headers).reduce<Record<string, string>>((acc, [key, value]) => {
    if (!value) return acc
    if (blocked.has(key.toLowerCase())) return acc
    acc[key] = value
    return acc
  }, {})
}

exports.handler = async (event) => {
  const origin = event.headers?.origin

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: buildCorsHeaders(origin), body: '' }
  }

  const apiPath = (event.path || '').replace(/^\/\.netlify\/functions\/api-proxy/, '') || '/'
  const upstreamUrl = `${API_BASE_URL}${apiPath}${event.rawQuery ? `?${event.rawQuery}` : ''}`

  try {
    const init: Record<string, unknown> = {
      method: event.httpMethod,
      headers: filterHeaders(event.headers),
      redirect: 'manual',
    }

    if (!['GET', 'HEAD'].includes(event.httpMethod) && event.body) {
      init.body = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body
    }

    const upstreamResponse = await fetch(upstreamUrl, init as RequestInit)
    const responseBody = await upstreamResponse.text()

    const responseHeaders: Record<string, string> = {}
    upstreamResponse.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })

    Object.assign(responseHeaders, buildCorsHeaders(origin))

    return {
      statusCode: upstreamResponse.status,
      headers: responseHeaders,
      body: responseBody,
    }
  } catch (error) {
    console.error('API proxy failed:', error)
    return {
      statusCode: 502,
      headers: buildCorsHeaders(origin),
      body: JSON.stringify({ success: false, error: 'Upstream API unreachable' }),
    }
  }
}

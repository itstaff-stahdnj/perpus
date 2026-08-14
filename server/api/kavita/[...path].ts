import { defineEventHandler, getRouterParam, getCookie, proxyRequest, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const path = getRouterParam(event, 'path') || ''
  
  // Extract user token from cookie if available, or fallback to server Kavita API key
  const userToken = getCookie(event, 'kavita_token') || config.kavitaApiKey

  const baseUrl = config.kavitaBaseUrl.replace(/\/$/, '')
  const query = getQuery(event)
  
  if (userToken && !query.apiKey) {
    query.apiKey = userToken as string
  }

  const queryString = new URLSearchParams(query as Record<string, string>).toString()
  const targetUrl = `${baseUrl}/api/${path}${queryString ? '?' + queryString : ''}`

  const headers: Record<string, string> = {
    'Accept': 'application/json, image/*, */*'
  }

  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`
    headers['x-api-key'] = userToken
  }

  return proxyRequest(event, targetUrl, {
    headers
  })
})

import { defineEventHandler, getRouterParam, getCookie, proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const path = getRouterParam(event, 'path') || ''
  
  // Extract user token from cookie if available, or fallback to server Kavita API key
  const userToken = getCookie(event, 'kavita_token') || config.kavitaApiKey

  const baseUrl = config.kavitaBaseUrl.replace(/\/$/, '')
  const targetUrl = `${baseUrl}/api/${path}`

  const headers: Record<string, string> = {
    'Accept': 'application/json, image/*, */*'
  }

  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`
  }

  return proxyRequest(event, targetUrl, {
    headers
  })
})

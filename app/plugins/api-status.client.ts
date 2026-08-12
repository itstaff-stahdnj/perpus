import { useApiStatus } from '~/composables/useApiStatus'

export default defineNuxtPlugin((nuxtApp) => {
  const { checkApiStatus, setApiDown, isApiDown } = useApiStatus()

  // Execute initial health check when client side mounts
  nuxtApp.hook('app:mounted', () => {
    checkApiStatus()

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        checkApiStatus()
      })

      window.addEventListener('offline', () => {
        setApiDown(true, 'Koneksi internet terputus. Tidak dapat terhubung ke server API.')
      })

      // Periodically ping backend every 45s if currently down to auto-recover when backend is back online
      setInterval(() => {
        if (isApiDown.value) {
          checkApiStatus()
        }
      }, 45000)
    }
  })
})

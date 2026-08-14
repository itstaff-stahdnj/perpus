import { ref } from 'vue'

const isApiDown = ref<boolean>(false)
const maintenanceMessage = ref<string>('Sistem / API Layanan Perpustakaan sedang dalam pemeliharaan (maintenance) atau tidak dapat dijangkau.')
const isChecking = ref<boolean>(false)
const lastChecked = ref<Date | null>(null)
const isDismissed = ref<boolean>(false)

export const useApiStatus = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl || '/api/pustaka'

  const setApiDown = (down: boolean, msg?: string) => {
    if (msg) {
      maintenanceMessage.value = msg
    }
    if (isApiDown.value !== down) {
      isApiDown.value = down
      if (!down) {
        // Reset dismiss state when API is back up
        isDismissed.value = false
      }
    }
  }

  const dismissNotification = () => {
    isDismissed.value = true
  }

  const checkApiStatus = async (): Promise<boolean> => {
    if (!process.client && !import.meta.server) return !isApiDown.value
    
    isChecking.value = true
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 6000)

      const response = await fetch(`${baseUrl}/settings`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'x-api-key': config.public.pustakaApiKey || config.pustakaApiKey || 'stah_lib_7f3e9a1b8c2d4e6f5a0b9c8d7e6f5a4b'
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      lastChecked.value = new Date()

      // 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout, 500 Internal Error
      if (response.status >= 500 || response.status === 502 || response.status === 503 || response.status === 504) {
        setApiDown(true, `Server API mengembalikan status ${response.status} (${response.statusText || 'Maintenance'}).`)
        isChecking.value = false
        return false
      }

      if (response.ok || response.status === 200) {
        setApiDown(false)
        isChecking.value = false
        return true
      }

      // If status is 4xx (e.g. 401, 404), API server is up and responding!
      if (response.status < 500) {
        setApiDown(false)
        isChecking.value = false
        return true
      }

      setApiDown(true, 'Respon server API tidak valid.')
      isChecking.value = false
      return false
    } catch (err: any) {
      lastChecked.value = new Date()
      let msg = 'Gagal terhubung ke server API Perpustakaan. Mohon periksa koneksi internet atau coba beberapa saat lagi.'
      if (err?.name === 'AbortError') {
        msg = 'Koneksi ke server API mengalami batas waktu (timeout).'
      }
      setApiDown(true, msg)
      isChecking.value = false
      return false
    }
  }

  return {
    isApiDown,
    maintenanceMessage,
    isChecking,
    lastChecked,
    isDismissed,
    setApiDown,
    dismissNotification,
    checkApiStatus
  }
}

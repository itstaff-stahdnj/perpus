import { ref, computed, onMounted, onUnmounted } from 'vue'

export type NetworkType = '4g' | '3g' | '2g' | 'slow-2g' | 'unknown'
export type PdfQualitySetting = 'auto' | 'low' | 'medium' | 'high'

const effectiveType = ref<NetworkType>('unknown')
const saveData = ref<boolean>(false)
const downlink = ref<number | null>(null)
const rtt = ref<number | null>(null)
const manualQualityOverride = ref<PdfQualitySetting | null>(null)

export const useNetworkQuality = () => {
  const updateNetworkInfo = () => {
    if (process.client && 'connection' in navigator) {
      const conn = (navigator as any).connection
      if (conn) {
        effectiveType.value = (conn.effectiveType as NetworkType) || 'unknown'
        saveData.value = Boolean(conn.saveData)
        downlink.value = typeof conn.downlink === 'number' ? conn.downlink : null
        rtt.value = typeof conn.rtt === 'number' ? conn.rtt : null
      }
    }
  }

  const isSlowConnection = computed<boolean>(() => {
    if (saveData.value) return true
    if (effectiveType.value === '2g' || effectiveType.value === 'slow-2g' || effectiveType.value === '3g') return true
    if (downlink.value !== null && downlink.value < 2.0) return true
    return false
  })

  const calculatedQuality = computed<'low' | 'medium' | 'high'>(() => {
    if (saveData.value || effectiveType.value === '2g' || effectiveType.value === 'slow-2g') {
      return 'low'
    }
    if (effectiveType.value === '3g' || (downlink.value !== null && downlink.value < 2.5)) {
      return 'medium'
    }
    return 'high'
  })

  const effectivePdfQuality = computed<'low' | 'medium' | 'high'>(() => {
    if (manualQualityOverride.value && manualQualityOverride.value !== 'auto') {
      return manualQualityOverride.value
    }
    return calculatedQuality.value
  })

  const networkLabel = computed<string>(() => {
    if (saveData.value) return 'Hemat Data (Aktif)'
    switch (effectiveType.value) {
      case '2g':
      case 'slow-2g':
        return '2G (Lambat)'
      case '3g':
        return '3G (Sedang)'
      case '4g':
        return '4G / Wi-Fi (Cepat)'
      default:
        return 'Online'
    }
  })

  const setManualQuality = (setting: PdfQualitySetting) => {
    manualQualityOverride.value = setting
  }

  if (process.client) {
    updateNetworkInfo()
  }

  return {
    effectiveType,
    saveData,
    downlink,
    rtt,
    isSlowConnection,
    calculatedQuality,
    effectivePdfQuality,
    manualQualityOverride,
    networkLabel,
    setManualQuality,
    updateNetworkInfo
  }
}

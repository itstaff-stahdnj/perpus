export interface KavitaLibrary {
  id: number
  name: string
  type: number
  coverImage?: string
  lastScanned?: string
}

export interface KavitaSeries {
  id: number
  name: string
  originalName?: string
  localizedName?: string
  summary?: string
  coverImage?: string
  pages?: number
  libraryId?: number
}

export interface KavitaChapter {
  id: number
  range: string
  number: string
  pages: number
  title?: string
  volumeId?: number
}

export interface KavitaPageInfo {
  pageCount: number
  chapterId: number
}

export const useKavita = () => {
  const config = useRuntimeConfig()
  const proxyBase = '/api/kavita'

  const getLibraries = async (): Promise<KavitaLibrary[]> => {
    try {
      const res = await $fetch<KavitaLibrary[]>(`${proxyBase}/Library/libraries`)
      return Array.isArray(res) ? res : []
    } catch (err) {
      console.error('Kavita getLibraries error:', err)
      return []
    }
  }

  const getSeriesInLibrary = async (libraryId: number): Promise<KavitaSeries[]> => {
    try {
      const res = await $fetch<KavitaSeries[]>(`${proxyBase}/Series/series-in-library?libraryId=${libraryId}`)
      return Array.isArray(res) ? res : []
    } catch (err) {
      console.error('Kavita getSeriesInLibrary error:', err)
      return []
    }
  }

  const getSeriesMetadata = async (seriesId: number): Promise<KavitaSeries | null> => {
    try {
      return await $fetch<KavitaSeries>(`${proxyBase}/Series/${seriesId}`)
    } catch (err) {
      console.error('Kavita getSeriesMetadata error:', err)
      return null
    }
  }

  const getChapterPages = async (chapterId: number): Promise<KavitaPageInfo> => {
    try {
      const pageCount = await $fetch<number>(`${proxyBase}/Reader/chapter-pages?chapterId=${chapterId}`)
      return { pageCount: pageCount || 1, chapterId }
    } catch (err) {
      console.error('Kavita getChapterPages error:', err)
      return { pageCount: 1, chapterId }
    }
  }

  const getPageImageUrl = (chapterId: number, page: number): string => {
    return `${proxyBase}/Reader/image?chapterId=${chapterId}&page=${page}`
  }

  const getCoverImageUrl = (seriesId: number): string => {
    return `${proxyBase}/Reader/thumb?seriesId=${seriesId}`
  }

  const saveProgress = async (chapterId: number, page: number, volumeId: number, seriesId: number): Promise<boolean> => {
    try {
      await $fetch(`${proxyBase}/Reader/progress`, {
        method: 'POST',
        body: {
          chapterId,
          pageNum: page,
          volumeId,
          seriesId,
          libraryId: 0
        }
      })
      return true
    } catch (err) {
      console.error('Kavita saveProgress error:', err)
      return false
    }
  }

  const syncKavitaToD1 = async (): Promise<{ success: boolean; message: string; syncedCount?: number }> => {
    try {
      const res = await $fetch<any>('/api/sync/kavita', {
        method: 'POST'
      })
      return {
        success: res?.success ?? true,
        message: res?.message || 'Sinkronisasi Kavita selesai',
        syncedCount: res?.syncedCount || 0
      }
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Gagal terhubung ke endpoint sync Kavita'
      }
    }
  }

  return {
    getLibraries,
    getSeriesInLibrary,
    getSeriesMetadata,
    getChapterPages,
    getPageImageUrl,
    getCoverImageUrl,
    saveProgress,
    syncKavitaToD1
  }
}

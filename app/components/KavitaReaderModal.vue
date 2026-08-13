<template>
  <ClientOnly>
    <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/95 flex flex-col text-white backdrop-blur-md">
      <!-- Header Navigation Bar -->
      <div class="h-16 px-4 sm:px-6 bg-gray-900 border-b border-gray-800 flex items-center justify-between shadow-lg">
        <div class="flex items-center gap-3">
          <button 
            @click="closeReader" 
            class="p-2 hover:bg-gray-800 rounded-full transition-colors"
            title="Tutup Reader"
          >
            <span class="material-symbols-outlined text-gray-300">arrow_back</span>
          </button>
          <div>
            <h2 class="font-bold text-sm sm:text-base text-amber-400 line-clamp-1">{{ title }}</h2>
            <p class="text-xs text-gray-400">Halaman {{ currentPage }} dari {{ totalPages }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Toggle Fit Width / Mode Scroll -->
          <button 
            @click="mode = mode === 'single' ? 'scroll' : 'single'" 
            class="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs rounded-lg flex items-center gap-1.5 border border-gray-700 transition-colors"
          >
            <span class="material-symbols-outlined text-sm">{{ mode === 'single' ? 'view_day' : 'auto_stories' }}</span>
            <span class="hidden sm:inline">{{ mode === 'single' ? 'Mode Scroll' : 'Mode Slide' }}</span>
          </button>
          <button 
            @click="closeReader" 
            class="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      <!-- Main Reader Workspace -->
      <div 
        class="flex-1 overflow-auto relative flex justify-center items-center p-3 select-none" 
        ref="scrollContainer"
        tabindex="0"
        @keydown.left="prevPage"
        @keydown.right="nextPage"
      >
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center gap-3">
          <div class="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-xs text-amber-400 font-medium">Memuat lembar e-book digital...</span>
        </div>

        <!-- Single Page View -->
        <template v-else-if="mode === 'single'">
          <img 
            :src="kavita.getPageImageUrl(chapterId, currentPage)" 
            class="max-h-[85vh] max-w-full object-contain shadow-2xl rounded-lg border border-gray-800 transition-all duration-200" 
            alt="E-Book Page"
          />
        </template>

        <!-- Continuous Vertical Scroll View -->
        <template v-else>
          <div class="flex flex-col gap-4 max-w-3xl w-full my-auto py-6">
            <img 
              v-for="page in totalPages" 
              :key="page"
              :src="kavita.getPageImageUrl(chapterId, page)" 
              class="w-full object-contain shadow-xl rounded-md border border-gray-800"
              loading="lazy"
              alt="E-Book Page"
            />
          </div>
        </template>
      </div>

      <!-- Footer Control Panel (Single Page Mode) -->
      <div v-if="mode === 'single' && !loading" class="h-16 px-4 sm:px-6 bg-gray-900 border-t border-gray-800 flex items-center justify-between gap-4 shadow-xl">
        <button 
          @click="prevPage" 
          :disabled="currentPage <= 1"
          class="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all"
        >
          <span class="material-symbols-outlined text-sm">chevron_left</span> <span class="hidden sm:inline">Sebelumnya</span>
        </button>

        <div class="flex-1 max-w-md flex items-center gap-3 px-2">
          <span class="text-xs font-mono text-gray-400">1</span>
          <input 
            type="range" 
            :min="1" 
            :max="totalPages" 
            v-model.number="currentPage" 
            @change="onPageSliderChange"
            class="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span class="text-xs font-mono text-gray-400">{{ totalPages }}</span>
        </div>

        <button 
          @click="nextPage" 
          :disabled="currentPage >= totalPages"
          class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-xs sm:text-sm flex items-center gap-1.5 transition-all"
        >
          <span class="hidden sm:inline">Berikutnya</span> <span class="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  chapterId: number
  seriesId: number
  volumeId: number
  title: string
  initialPage?: number
}>()

const emit = defineEmits(['close'])

const kavita = useKavita()
const isOpen = ref(true)
const loading = ref(true)
const totalPages = ref(1)
const currentPage = ref(props.initialPage || 1)
const mode = ref<'single' | 'scroll'>('single')

onMounted(async () => {
  try {
    const res = await kavita.getChapterPages(props.chapterId)
    totalPages.value = res.pageCount || 1
  } catch (e) {
    console.error('Error fetching chapter pages:', e)
  } finally {
    loading.value = false
  }
})

// Auto-save progress reading position
watch(currentPage, (newPage) => {
  kavita.saveProgress(props.chapterId, newPage, props.volumeId, props.seriesId)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const onPageSliderChange = () => {
  kavita.saveProgress(props.chapterId, currentPage.value, props.volumeId, props.seriesId)
}

const closeReader = () => {
  isOpen.value = false
  emit('close')
}
</script>

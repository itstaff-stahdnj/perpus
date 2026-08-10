<template>
  <Transition name="slide-fade">
    <div 
      v-if="toast" 
      class="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-50 flex items-center gap-3 p-3 bg-slate-900/95 border border-amber-500/30 text-white rounded-2xl shadow-2xl backdrop-blur-md max-w-sm cursor-pointer hover:border-amber-400/60 transition-all group"
      @click="handleToastClick"
    >
      <img 
        :src="toast.book_cover || noImagePlaceholder" 
        :alt="toast.book_title"
        @error="handleImgError"
        class="w-12 h-16 rounded-lg object-cover flex-shrink-0 bg-slate-800 border border-slate-700" 
      />
      <div class="flex flex-col min-w-0 text-xs flex-1 pr-4">
        <span class="font-bold text-amber-300 truncate">{{ toast.user_name }}</span>
        <span class="text-slate-200 font-medium">{{ toast.action_title }}</span>
        <span class="font-extrabold text-white truncate group-hover:text-amber-200 transition-colors" :title="toast.book_title">{{ toast.book_title }}</span>
        <span class="text-[0.65rem] text-slate-400 mt-0.5 flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{{ toast.time_formatted || 'Hari ini' }}</span>
        </span>
      </div>
      <button 
        @click.stop="dismissToast"
        class="absolute top-2 right-2 text-slate-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
        title="Tutup"
      >
        <span class="material-symbols-outlined text-xs">close</span>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const toast = ref(null)
const list = ref([])
let index = 0
let fetchTimer = null
let rotateTimer = null
let dismissTimer = null

const noImagePlaceholder = 'https://placehold.co/120x160/1e293b/cbd5e1?text=Pustaka'

const handleImgError = (event) => {
  if (event?.target) {
    event.target.src = noImagePlaceholder
  }
}

// Function to check if an activity happened TODAY (pada tanggal yang sama hari ini)
const isActivityToday = (item) => {
  if (!item) return false

  const today = new Date()
  
  // 1. Check ISO created_at date
  if (item.created_at) {
    const d = new Date(item.created_at)
    if (!isNaN(d.getTime())) {
      return d.toDateString() === today.toDateString()
    }
  }

  // 2. Check unix timestamp
  if (item.timestamp) {
    const timestampMs = item.timestamp > 10000000000 ? item.timestamp : item.timestamp * 1000
    const d = new Date(timestampMs)
    if (!isNaN(d.getTime())) {
      return d.toDateString() === today.toDateString()
    }
  }

  // 3. Check time_formatted string containing "Hari ini" / "jam" / "menit" / "detik" / "Baru saja"
  if (item.time_formatted) {
    const str = String(item.time_formatted).toLowerCase()
    if (str.includes('hari ini') || str.includes('menit') || str.includes('jam') || str.includes('detik') || str.includes('baru saja')) {
      return true
    }
  }

  return false
}

const loadActivities = async () => {
  try {
    const res = await fetch('https://portal-perpus.stahdnj.ac.id/api/aktivitas-terbaru')
    const json = await res.json()
    if (json?.success && Array.isArray(json?.data)) {
      // Filter ONLY activities that happened TODAY
      const todayActivities = json.data.filter(isActivityToday)
      list.value = todayActivities

      // If no activities today, hide the toast
      if (!todayActivities.length) {
        toast.value = null
      }
      return
    }
  } catch (err) {
    console.error('Error fetching today activities:', err)
  }

  list.value = []
  toast.value = null
}

const showToast = () => {
  if (!list.value.length) {
    toast.value = null
    return
  }
  
  toast.value = list.value[index % list.value.length]
  index++

  if (dismissTimer) clearTimeout(dismissTimer)
  dismissTimer = setTimeout(() => {
    toast.value = null
  }, 5000)
}

const dismissToast = () => {
  toast.value = null
}

const handleToastClick = () => {
  const actionText = String(toast.value?.action_title || '').toLowerCase()
  if (actionText.includes('reservasi') || actionText.includes('antre') || actionText.includes('pesan')) {
    router.push('/reservasi')
  } else if (toast.value?.book_id) {
    router.push(`/buku/${toast.value.book_id}`)
  } else {
    router.push('/buku')
  }
}

onMounted(() => {
  loadActivities()
  fetchTimer = setInterval(loadActivities, 12000) // Poll API every 12 seconds
  
  // Start pop-up loop if today has activities
  setTimeout(() => {
    showToast()
    rotateTimer = setInterval(showToast, 8000) // Cycle toast every 8 seconds
  }, 2000)
})

onUnmounted(() => {
  if (fetchTimer) clearInterval(fetchTimer)
  if (rotateTimer) clearInterval(rotateTimer)
  if (dismissTimer) clearTimeout(dismissTimer)
})
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>

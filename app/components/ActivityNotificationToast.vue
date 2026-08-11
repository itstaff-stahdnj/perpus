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
let dismissTimer = null

const noImagePlaceholder = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="160" viewBox="0 0 120 160" fill="none"><rect width="120" height="160" fill="#1e293b"/><path d="M60 50 C50 45 35 45 25 50 V90 C35 85 50 85 60 90 C70 85 85 85 95 90 V50 C85 45 70 45 60 50 Z" fill="#334155"/><text x="60" y="115" font-family="sans-serif" font-size="10" font-weight="bold" fill="#cbd5e1" text-anchor="middle">Tidak Ada Cover</text></svg>')}`;

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
      return
    }
  } catch (err) {
    console.error('Error fetching today activities:', err)
  }

  list.value = []
}

const showToastOnce = () => {
  if (!list.value.length) {
    toast.value = null
    return
  }
  
  // Tampilkan item aktivitas terbaru HANYA 1 KALI
  toast.value = list.value[0]

  // Otomatis menutup & menghilang setelah 5.5 detik (Slide away)
  if (dismissTimer) clearTimeout(dismissTimer)
  dismissTimer = setTimeout(() => {
    toast.value = null
  }, 5500)
}

const dismissToast = () => {
  if (dismissTimer) clearTimeout(dismissTimer)
  toast.value = null
}

const handleToastClick = () => {
  const actionText = String(toast.value?.action_title || '').toLowerCase()
  if (actionText.includes('reservasi') || actionText.includes('antre') || actionText.includes('pesan')) {
    if (process.client) {
      window.location.href = 'https://portal-perpus.stahdnj.ac.id/admin/reservations'
    } else {
      router.push('/reservasi')
    }
  } else if (toast.value?.book_id) {
    const slug = (toast.value.book_title || 'buku').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    router.push(`/buku/${slug}-${toast.value.book_id}`)
  } else {
    router.push('/buku')
  }
  dismissToast()
}

onMounted(async () => {
  if (process.client) {
    // Cek sessionStorage agar notifikasi hanya tampil 1x per sesi masuk pengguna
    const alreadyShown = sessionStorage.getItem('pustaka_toast_shown')
    if (alreadyShown) return

    await loadActivities()
    
    if (list.value.length > 0) {
      setTimeout(() => {
        showToastOnce()
        sessionStorage.setItem('pustaka_toast_shown', 'true')
      }, 1500)
    }
  }
})

onUnmounted(() => {
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

<template>
  <Transition name="slide-down">
    <div 
      v-if="isApiDown && !isDismissed" 
      class="fixed top-20 left-4 right-4 md:left-auto md:right-6 md:max-w-lg z-[9999] p-4 bg-slate-900/95 border border-amber-500/50 text-white rounded-2xl shadow-2xl backdrop-blur-lg flex flex-col gap-3 group transition-all duration-300"
      role="alert"
      aria-live="assertive"
    >
      <div class="flex items-start gap-3.5">
        <!-- Animated Icon Container -->
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 mt-0.5 relative">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400 absolute top-1 right-1 animate-ping"></span>
          <span class="material-symbols-outlined text-xl">cloud_off</span>
        </div>

        <!-- Notification Content -->
        <div class="flex-1 min-w-0 pr-4">
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              Maintenance / Server Down
            </span>
            <span v-if="lastChecked" class="text-[0.65rem] text-slate-400">
              Dicek: {{ formatTime(lastChecked) }}
            </span>
          </div>

          <h4 class="text-sm font-bold text-slate-100 leading-snug">
            Layanan API Sedang Maintenance
          </h4>

          <p class="text-xs text-slate-300 mt-1 leading-relaxed">
            {{ maintenanceMessage || 'Sistem tidak dapat terhubung ke server API perpustakaan. Beberapa fitur mungkin terbatas saat ini.' }}
          </p>

          <!-- Interactive Actions -->
          <div class="mt-3 flex items-center gap-2 flex-wrap">
            <button 
              @click="handleRetry" 
              :disabled="isChecking"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span 
                class="material-symbols-outlined text-sm"
                :class="{ 'animate-spin': isChecking }"
              >
                refresh
              </span>
              <span>{{ isChecking ? 'Menghubungkan...' : 'Coba Hubungkan Kembali' }}</span>
            </button>

            <button 
              @click="dismissNotification" 
              class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs rounded-xl border border-slate-700/60 transition-all cursor-pointer"
            >
              Sembunyikan
            </button>
          </div>
        </div>

        <!-- Close Button -->
        <button 
          @click="dismissNotification"
          class="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer shrink-0"
          title="Tutup Notifikasi"
          aria-label="Tutup Notifikasi"
        >
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useApiStatus } from '~/composables/useApiStatus'

const { isApiDown, maintenanceMessage, isChecking, lastChecked, isDismissed, dismissNotification, checkApiStatus } = useApiStatus()

const handleRetry = async () => {
  await checkApiStatus()
}

const formatTime = (date: Date) => {
  if (!date) return ''
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
</script>

<style scoped>
.slide-down-enter-active {
  transition: all 0.4s ease-out;
}

.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>

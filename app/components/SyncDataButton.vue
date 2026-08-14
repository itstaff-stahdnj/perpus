<template>
  <div>
    <!-- Header Variant -->
    <button 
      v-if="variant === 'header'"
      @click="handleSync"
      :disabled="isSyncing"
      class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border shrink-0 active:scale-95 shadow-xs"
      :class="isSyncing 
        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
        : (syncSuccess === true 
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white border-blue-500/40')"
      :title="lastSyncedAt ? `Terakhir disinkronkan pukul ${lastSyncedAt}. Klik untuk sinkronisasi ulang data D1 & IndexedDB.` : 'Klik untuk sinkronisasi data D1 & IndexedDB.'"
    >
      <span 
        class="material-symbols-outlined text-base inline-block"
        :class="{ 'animate-spin': isSyncing }"
      >
        sync
      </span>
      <span>{{ isSyncing ? 'Syncing...' : 'Sync Data' }}</span>
    </button>

    <!-- Inline Button Variant (Full width / Block for pages & modals) -->
    <button 
      v-else-if="variant === 'inline'"
      @click="handleSync"
      :disabled="isSyncing"
      class="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-700 to-blue-800 hover:from-blue-700 hover:to-indigo-900 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-600/20 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
    >
      <span 
        class="material-symbols-outlined text-lg inline-block"
        :class="{ 'animate-spin': isSyncing }"
      >
        sync
      </span>
      <span>{{ isSyncing ? 'Proses Sinkronisasi D1 & IndexedDB...' : '🔄 Sinkronkan Data (IndexedDB & Cloudflare D1)' }}</span>
    </button>

  </div>
</template>

<script setup lang="ts">
import { useSyncData } from '~/composables/useSyncData';

withDefaults(defineProps<{
  variant?: 'header' | 'floating' | 'inline';
}>(), {
  variant: 'floating'
});

const { isSyncing, syncSuccess, syncMessage, lastSyncedAt, triggerSync } = useSyncData();

const handleSync = async () => {
  await triggerSync();
};
</script>

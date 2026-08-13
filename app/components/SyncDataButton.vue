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

    <!-- Floating Global Widget Variant (Always visible bottom-left) -->
    <div v-else class="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 flex flex-col gap-2 select-none">
      <button 
        @click="handleSync"
        :disabled="isSyncing"
        class="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white border-2 border-blue-400/50 shadow-2xl backdrop-blur-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
        :title="lastSyncedAt ? `Sinkronisasi D1 & IndexedDB (Terakhir ${lastSyncedAt})` : 'Klik untuk sinkronkan data D1 & IndexedDB'"
      >
        <span 
          class="material-symbols-outlined text-lg text-blue-400 group-hover:rotate-180 transition-transform duration-700"
          :class="{ 'animate-spin': isSyncing }"
        >
          sync
        </span>
        <div class="text-left leading-tight pr-1">
          <p class="font-extrabold text-[11px] text-white flex items-center gap-1">
            <span>Sync Data</span>
            <span v-if="lastSyncedAt" class="text-[9px] text-emerald-400 font-mono">({{ lastSyncedAt }})</span>
          </p>
          <p class="text-[9px] text-blue-200">D1 &amp; IndexedDB</p>
        </div>
      </button>
    </div>

    <!-- Teleport Global Toast Notification -->
    <Teleport to="body">
      <div 
        v-if="syncMessage"
        class="fixed top-20 left-1/2 -translate-x-1/2 z-[999999] max-w-md w-[92%] sm:w-auto"
      >
        <div 
          class="px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 text-xs sm:text-sm font-extrabold"
          :class="syncSuccess === true 
            ? 'bg-emerald-950/90 text-emerald-100 border-emerald-500/50 shadow-emerald-900/30' 
            : (syncSuccess === false 
                ? 'bg-amber-950/90 text-amber-100 border-amber-500/50 shadow-amber-900/30' 
                : 'bg-blue-950/90 text-blue-100 border-blue-500/50 shadow-blue-900/30')"
        >
          <span 
            class="material-symbols-outlined text-xl shrink-0"
            :class="{ 'animate-spin': isSyncing }"
          >
            {{ isSyncing ? 'sync' : (syncSuccess ? 'check_circle' : 'warning') }}
          </span>
          <span class="leading-snug">{{ syncMessage }}</span>
        </div>
      </div>
    </Teleport>
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

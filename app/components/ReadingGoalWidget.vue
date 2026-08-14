<template>
  <div class="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-amber-500 text-2xl">stars</span>
        <h4 class="font-extrabold text-sm text-slate-900 dark:text-zinc-100">Target Membaca {{ currentYear }}</h4>
      </div>
      <button 
        @click="isEditing = !isEditing" 
        class="text-xs font-bold text-primary dark:text-blue-400 hover:underline cursor-pointer"
      >
        {{ isEditing ? 'Simpan' : 'Edit Target' }}
      </button>
    </div>

    <!-- Editing Mode Form -->
    <div v-if="isEditing" class="p-3 bg-slate-50 dark:bg-zinc-800 rounded-2xl space-y-2 text-xs">
      <label class="block font-bold text-slate-700 dark:text-zinc-300">Tentukan Target Buku Tahun Ini:</label>
      <div class="flex items-center gap-2">
        <input 
          v-model.number="targetBooks" 
          type="number" 
          min="1" 
          max="100" 
          class="w-20 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 font-bold outline-none"
        />
        <span class="font-bold text-slate-600 dark:text-zinc-400">Buku / Tahun</span>
        <button @click="saveGoal" class="px-3 py-1.5 bg-primary text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer">
          Simpan
        </button>
      </div>
    </div>

    <!-- Progress Ring & Stats Display -->
    <div v-else class="flex items-center gap-5">
      <!-- SVG Progress Ring -->
      <div class="relative w-20 h-20 shrink-0 flex items-center justify-center">
        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            class="text-slate-100 dark:text-zinc-800"
            stroke-width="3.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            class="text-amber-500 transition-all duration-1000 ease-out"
            :stroke-dasharray="`${progressPercentage}, 100`"
            stroke-width="3.5"
            stroke-linecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <span class="absolute font-black text-xs text-slate-900 dark:text-amber-300">
          {{ progressPercentage }}%
        </span>
      </div>

      <!-- Stats Text -->
      <div class="space-y-1">
        <p class="font-extrabold text-sm text-slate-900 dark:text-zinc-100">
          <span class="text-amber-500 font-black text-base">{{ completedCount }}</span> dari <span class="font-black">{{ targetBooks }}</span> Buku Terbaca
        </p>
        <p class="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
          {{ progressMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{
  completedBooksCount?: number;
}>();

const currentYear = new Date().getFullYear();
const targetBooks = ref(12);
const isEditing = ref(false);

const completedCount = computed(() => props.completedBooksCount || 0);

const progressPercentage = computed(() => {
  if (!targetBooks.value || targetBooks.value <= 0) return 0;
  return Math.min(100, Math.round((completedCount.value / targetBooks.value) * 100));
});

const progressMessage = computed(() => {
  if (progressPercentage.value >= 100) return '🎉 Luar biasa! Target membaca tahun ini sudah tercapai!';
  if (progressPercentage.value >= 50) return '💪 Bagus sekali! Anda sudah melewati separuh target tahunan.';
  return '🌱 Semangat terus membaca untuk mencapai target pengetahuan Anda!';
});

const saveGoal = () => {
  isEditing.value = false;
  if (process.client) {
    localStorage.setItem('pustaka_reading_target', String(targetBooks.value));
  }
};

onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem('pustaka_reading_target');
    if (saved && !isNaN(Number(saved))) {
      targetBooks.value = Number(saved);
    }
  }
});
</script>

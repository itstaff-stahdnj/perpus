<template>
  <button 
    type="button" 
    @click="toggleTheme" 
    class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/80 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-amber-300 flex items-center justify-center transition-all duration-300 shadow-xs active:scale-95 cursor-pointer shrink-0"
    :title="isDark ? 'Beralih ke Tema Terang (Light Mode)' : 'Beralih ke Tema Gelap (Dark Mode)'"
  >
    <span class="material-symbols-outlined text-lg sm:text-xl transition-transform duration-300" :class="isDark ? 'rotate-180 text-amber-300' : 'rotate-0 text-slate-700'">
      {{ isDark ? 'dark_mode' : 'light_mode' }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDark = ref(false);

const applyTheme = (dark: boolean) => {
  isDark.value = dark;
  if (!process.client) return;

  if (dark) {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
    localStorage.setItem('pustaka_theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
    localStorage.setItem('pustaka_theme', 'light');
  }

  window.dispatchEvent(new CustomEvent('pustaka-theme-change', { detail: { dark } }));
};

const toggleTheme = () => {
  applyTheme(!isDark.value);
};

onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem('pustaka_theme');
    if (saved) {
      applyTheme(saved === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark);
    }
  }
});
</script>

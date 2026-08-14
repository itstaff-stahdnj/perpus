<template>
  <div class="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 shadow-xl space-y-3 relative overflow-hidden">
    <!-- Equalizer Background Wave Animation -->
    <div v-if="isPlaying && !isPaused" class="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/10 rounded-full blur-xl pointer-events-none animate-pulse"></div>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2.5 min-w-0">
        <div 
          class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 transition-all"
          :class="isPlaying ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 animate-pulse' : 'bg-slate-800 text-slate-300'"
        >
          {{ isPlaying ? '🎙️' : '🎧' }}
        </div>
        <div class="min-w-0">
          <h4 class="font-extrabold text-xs text-white truncate leading-tight">
            {{ title || 'Narator Suara E-Book (Audiobook)' }}
          </h4>
          <p class="text-[10px] text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
            <span>Bahasa Indonesia (id-ID)</span>
            <span>•</span>
            <span class="text-blue-400 font-bold">{{ speechStatusText }}</span>
          </p>
        </div>
      </div>

      <!-- Playback Rate Controls -->
      <div class="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 shrink-0">
        <button 
          v-for="rateOption in rateOptions" 
          :key="rateOption"
          @click="changeRate(rateOption)"
          class="px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer"
          :class="playbackRate === rateOption ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'"
        >
          {{ rateOption }}x
        </button>
      </div>
    </div>

    <!-- Animated Audio Visualizer Bars -->
    <div class="flex items-center justify-between gap-1 h-3 px-1">
      <div 
        v-for="i in 16" 
        :key="i"
        class="flex-1 bg-blue-500 rounded-full transition-all duration-300"
        :style="{
          height: isPlaying && !isPaused ? `${Math.floor(Math.random() * 80) + 20}%` : '20%',
          opacity: isPlaying && !isPaused ? '0.9' : '0.3'
        }"
      ></div>
    </div>

    <!-- Audio Player Controls Bar -->
    <div class="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
      <div class="flex items-center gap-2">
        <button 
          v-if="!isPlaying || isPaused" 
          @click="play" 
          class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-base">play_arrow</span>
          <span>{{ isPaused ? 'Lanjutkan' : 'Putar Narasi' }}</span>
        </button>

        <button 
          v-else 
          @click="pause" 
          class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-extrabold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-base">pause</span>
          <span>Jeda Narator</span>
        </button>

        <button 
          v-if="isPlaying" 
          @click="stop" 
          class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all cursor-pointer"
          title="Hentikan Narator"
        >
          Stop
        </button>
      </div>

      <span class="text-[10px] text-slate-500 font-mono font-bold hidden sm:inline">
        Web Speech Synthesis API
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';

const props = defineProps<{
  textToRead: string;
  title?: string;
}>();

const isPlaying = ref(false);
const isPaused = ref(false);
const playbackRate = ref(1.0);
const rateOptions = [0.8, 1.0, 1.25, 1.5];

let utterance: SpeechSynthesisUtterance | null = null;

const speechStatusText = computed(() => {
  if (isPaused.value) return 'Dijeda';
  if (isPlaying.value) return 'Sedang Membaca Suara...';
  return 'Siap Diputar';
});

const play = () => {
  if (!process.client) return;

  if (!('speechSynthesis' in window)) {
    alert('Maaf, peramban Anda belum mendukung fitur Text-to-Speech.');
    return;
  }

  if (isPaused.value && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    isPaused.value = false;
    isPlaying.value = true;
    return;
  }

  window.speechSynthesis.cancel();

  const cleanText = (props.textToRead || '').replace(/<[^>]*>?/gm, '').trim();
  if (!cleanText) {
    alert('Tidak ada teks untuk dibaca.');
    return;
  }

  utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'id-ID';
  utterance.rate = playbackRate.value;

  utterance.onstart = () => {
    isPlaying.value = true;
    isPaused.value = false;
  };

  utterance.onend = () => {
    isPlaying.value = false;
    isPaused.value = false;
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis error:', e);
    isPlaying.value = false;
    isPaused.value = false;
  };

  window.speechSynthesis.speak(utterance);
};

const pause = () => {
  if (process.client && window.speechSynthesis) {
    window.speechSynthesis.pause();
    isPaused.value = true;
  }
};

const stop = () => {
  if (process.client && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    isPlaying.value = false;
    isPaused.value = false;
  }
};

const changeRate = (rate: number) => {
  playbackRate.value = rate;
  if (isPlaying.value) {
    stop();
    play();
  }
};

onUnmounted(() => {
  if (process.client && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
});
</script>

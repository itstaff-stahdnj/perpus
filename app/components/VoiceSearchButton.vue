<template>
  <div class="relative inline-flex items-center">
    <button 
      type="button" 
      @click="toggleListening"
      class="p-2 rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer select-none relative"
      :class="[
        isListening 
          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 animate-pulse scale-105' 
          : 'bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300'
      ]"
      :title="isListening ? 'Mendengarkan suara Anda... (Klik untuk berhenti)' : 'Pencarian Suara (Klik dan Ucapkan Judul Buku)'"
    >
      <span class="material-symbols-outlined text-lg sm:text-xl">
        {{ isListening ? 'mic' : 'mic_none' }}
      </span>

      <!-- Wave pulse ring -->
      <span v-if="isListening" class="absolute inset-0 rounded-xl border-2 border-rose-400 animate-ping opacity-75 pointer-events-none"></span>
    </button>

    <!-- Toast Banner Popup when Listening -->
    <Teleport to="body">
      <Transition name="voice-slide">
        <div 
          v-if="isListening" 
          class="fixed bottom-24 left-1/2 -translate-x-1/2 z-[999999] bg-slate-900/95 dark:bg-zinc-900/95 border border-rose-500/40 text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3"
        >
          <div class="w-3 h-3 rounded-full bg-rose-500 animate-ping shrink-0"></div>
          <div class="text-left leading-tight min-w-[200px]">
            <p class="font-extrabold text-xs text-rose-400 uppercase tracking-wider">Pencarian Suara Aktif</p>
            <p class="text-xs text-slate-200 font-semibold truncate">{{ transcript || 'Silakan ucapkan kata kunci buku...' }}</p>
          </div>
          <button @click="stopListening" class="text-xs font-bold text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg shrink-0">
            Selesai
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';

const emit = defineEmits<{
  (e: 'result', transcriptText: string): void;
}>();

const isListening = ref(false);
const transcript = ref('');
let recognition: any = null;

const startListening = () => {
  if (!process.client) return;

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    const inputVal = window.prompt('Pencarian Kata Kunci (Peramban Anda belum mengaktifkan Mikrofon Speech API):');
    if (inputVal && inputVal.trim()) {
      emit('result', inputVal.trim());
    }
    return;
  }

  try {
    recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      isListening.value = true;
      transcript.value = '';
    };

    recognition.onresult = (event: any) => {
      let current = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        current += event.results[i][0].transcript;
      }
      transcript.value = current;
      emit('result', current);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      isListening.value = false;
    };

    recognition.onend = () => {
      isListening.value = false;
    };

    recognition.start();
  } catch (err) {
    console.error('Failed to start speech recognition:', err);
    isListening.value = false;
  }
};

const stopListening = () => {
  if (recognition) {
    recognition.stop();
  }
  isListening.value = false;
};

const toggleListening = () => {
  if (isListening.value) {
    stopListening();
  } else {
    startListening();
  }
};

onUnmounted(() => {
  if (recognition) {
    recognition.abort();
  }
});

defineExpose({
  startListening,
  stopListening,
  toggleListening
});
</script>

<style scoped>
.voice-slide-enter-active,
.voice-slide-leave-active {
  transition: all 0.3s ease;
}
.voice-slide-enter-from,
.voice-slide-leave-to {
  transform: translate(-50%, 20px);
  opacity: 0;
}
</style>

<template>
  <div>
    <!-- Floating Trigger Button (Prominent Pill Badge) -->
    <button 
      @click="isOpen = !isOpen" 
      class="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[99990] h-12 sm:h-14 px-4 sm:px-5 rounded-full bg-gradient-to-r from-blue-600 via-primary to-indigo-800 hover:scale-105 active:scale-95 text-white shadow-2xl flex items-center gap-2.5 transition-all cursor-pointer border-2 border-white/50 group"
      title="Tanya Wayan AI - Pustakawan Digital 24/7"
    >
      <div class="relative flex items-center justify-center">
        <span class="material-symbols-outlined text-2xl sm:text-3xl text-amber-300 animate-pulse" v-if="!isOpen">smart_toy</span>
        <span class="material-symbols-outlined text-2xl sm:text-3xl" v-else>close</span>
        <span class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping"></span>
      </div>

      <div v-if="!isOpen" class="flex flex-col items-start leading-tight text-left pr-1">
        <span class="font-black text-xs sm:text-sm text-white tracking-wide">Tanya Wayan AI</span>
        <span class="text-[9px] text-amber-300 font-bold uppercase tracking-wider hidden sm:block">Pustakawan Digital</span>
      </div>
      <span v-else class="font-extrabold text-xs sm:text-sm">Tutup</span>
    </button>

    <!-- Chat Modal Window -->
    <Teleport to="body">
      <Transition name="chat-slide">
        <div 
          v-if="isOpen" 
          class="fixed bottom-24 right-4 sm:right-6 z-[99995] w-[92vw] sm:w-[400px] h-[520px] max-h-[80vh] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          <!-- Chat Header -->
          <div class="bg-gradient-to-r from-slate-900 via-primary to-slate-950 p-4 text-white flex items-center justify-between shadow-md">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md shrink-0">
                🤖
              </div>
              <div>
                <h4 class="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <span>Wayan AI</span>
                  <span class="px-1.5 py-0.5 rounded bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-[9px] uppercase font-mono">Pustakawan Digital</span>
                </h4>
                <p class="text-[10px] text-slate-300">Siap membantu informasi pustaka & pencarian 24/7</p>
              </div>
            </div>

            <button @click="isOpen = false" class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer">
              ✕
            </button>
          </div>

          <!-- Messages Container -->
          <div ref="chatContainerRef" class="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60 dark:bg-zinc-950">
            
            <div v-for="(msg, idx) in messages" :key="idx" class="flex flex-col" :class="msg.role === 'user' ? 'items-end' : 'items-start'">
              <div 
                class="max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-xs"
                :class="msg.role === 'user' 
                  ? 'bg-primary text-white rounded-br-none dark:bg-blue-600 font-medium' 
                  : 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 rounded-bl-none border border-slate-200/80 dark:border-zinc-700/80 font-normal'"
              >
                <p class="whitespace-pre-line">{{ msg.text }}</p>
              </div>
              <span class="text-[9px] text-slate-400 mt-1 px-1">{{ msg.time }}</span>
            </div>

            <!-- Loading Indicator -->
            <div v-if="isTyping" class="flex items-center gap-2 text-slate-400 text-xs p-2 bg-white dark:bg-zinc-800 rounded-2xl w-max border border-slate-200 dark:border-zinc-700">
              <div class="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
              <span class="text-[10px] font-bold text-slate-500 dark:text-zinc-400">Wayan AI sedang berpikir...</span>
            </div>

          </div>

          <!-- Quick Suggestions Pills -->
          <div class="px-3 py-2 bg-slate-100/70 dark:bg-zinc-900 border-t border-slate-200/80 dark:border-zinc-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            <button 
              v-for="prompt in quickPrompts" 
              :key="prompt"
              @click="sendQuickPrompt(prompt)"
              class="px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-[10px] font-bold text-slate-700 dark:text-zinc-300 whitespace-nowrap hover:border-primary transition-all cursor-pointer shadow-2xs"
            >
              {{ prompt }}
            </button>
          </div>

          <!-- Input Footer -->
          <form @submit.prevent="sendMessage" class="p-3 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center gap-2 shrink-0">
            <input 
              v-model="inputQuery"
              type="text" 
              placeholder="Tanyakan buku, jadwal, atau aturan..."
              class="flex-1 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-zinc-100 outline-none focus:border-primary"
            />
            <button 
              type="submit" 
              :disabled="!inputQuery.trim() || isTyping"
              class="w-9 h-9 rounded-xl bg-primary hover:bg-primary-container dark:bg-blue-600 text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shadow-md shrink-0"
            >
              <span class="material-symbols-outlined text-lg">send</span>
            </button>
          </form>

        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { usePustakaApi } from '~/composables/usePustakaApi';

const isOpen = ref(false);
const inputQuery = ref('');
const isTyping = ref(false);
const chatContainerRef = ref<HTMLDivElement | null>(null);

const { getBooks } = usePustakaApi();

const quickPrompts = [
  '🔍 Cari Buku Agama Hindu',
  '📖 Cara Pinjam Mandiri',
  '⏰ Jam Operasional Pustaka',
  '📄 Bebas Pustaka Mahasiswa'
];

const messages = ref([
  {
    role: 'bot',
    text: 'Om Swastyastu! 🙏 Selamat datang di Perpustakaan STAH DNJ. Saya Wayan AI, asisten pustakawan digital Anda. Ada yang bisa saya bantu hari ini?',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
]);

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainerRef.value) {
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
    }
  });
};

const sendQuickPrompt = (prompt: string) => {
  inputQuery.value = prompt.replace(/^[^\w]+/, '').trim();
  sendMessage();
};

const sendMessage = async () => {
  const q = inputQuery.value.trim();
  if (!q) return;

  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  messages.value.push({ role: 'user', text: q, time: nowStr });
  inputQuery.value = '';
  scrollToBottom();

  isTyping.value = true;

  try {
    const reply = await generateBotReply(q);
    messages.value.push({ role: 'bot', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
  } catch (err) {
    messages.value.push({ role: 'bot', text: 'Maaf, sistem sedang memproses permintaan Anda. Silakan coba kembali.', time: nowStr });
  } finally {
    isTyping.value = false;
    scrollToBottom();
  }
};

const generateBotReply = async (queryText: string): Promise<string> => {
  const lower = queryText.toLowerCase();

  if (lower.includes('jam') || lower.includes('buka') || lower.includes('operasional')) {
    return '⏰ Jam Operasional Perpustakaan STAH DNJ:\n• Senin - Jumat: 08.00 - 16.00 WIB\n• Sabtu: 09.00 - 14.00 WIB\n• Minggu & Hari Libur Nasional: Tutup';
  }

  if (lower.includes('pinjam') || lower.includes('mandiri') || lower.includes('cara')) {
    return '📖 Cara Peminjaman Mandiri di Kampus:\n1. Buka katalog buku di website perpus.\n2. Pastikan Anda sudah Login & berada di area kampus.\n3. Tekan tombol "Pinjam Mandiri (Di Kampus)".\n4. Ambil buku dari rak dan konfirmasikan ke Petugas/Kiosk Absensi.';
  }

  if (lower.includes('bebas') || lower.includes('syarat') || lower.includes('wisuda')) {
    return '📄 Syarat Surat Bebas Pustaka:\n1. Tidak memiliki tunggakan peminjaman buku fisik.\n2. Mengunggah softcopy tugas akhir / skripsi ke repositori.\n3. Mengajukan bebas pustaka di menu "Layanan Bebas Pustaka".';
  }

  // Book Search Query
  if (lower.includes('buku') || lower.includes('cari') || lower.includes('hindu') || lower.includes('veda') || lower.includes('sastra')) {
    try {
      const res = await getBooks();
      if (res?.data && Array.isArray(res.data)) {
        const matches = res.data.filter(b => 
          b.judul.toLowerCase().includes(lower.replace('buku', '').trim()) || 
          (b.category && String(b.category).toLowerCase().includes(lower.trim()))
        ).slice(0, 3);

        if (matches.length > 0) {
          const listStr = matches.map((b, i) => `${i + 1}. ${b.judul} (${b.penulis || 'STAH DNJ'})`).join('\n');
          return `📚 Berikut beberapa rekomendasi koleksi buku yang cocok:\n\n${listStr}\n\nKetik judul buku tersebut di kolom pencarian katalog untuk detail lengkap!`;
        }
      }
    } catch (e) {}
    return '📚 Kami memiliki ratusan koleksi Kitab Suci Veda, Filsafat Hindu, Sastra Kawi, dan Ilmu Sosial. Silakan ketik judul spesifik yang Anda cari!';
  }

  return `Terima kasih atas pertanyaan Anda mengenai "${queryText}". Untuk bantuan langsung dari Pustakawan STAH DNJ, Anda juga bisa menghubungi staf melalui menu Bantuan Pustaka.`;
};

watch(isOpen, (newVal) => {
  if (newVal) scrollToBottom();
});
</script>

<style scoped>
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.25s ease;
}
.chat-slide-enter-from,
.chat-slide-leave-to {
  transform: translateY(20px) scale(0.95);
  opacity: 0;
}
</style>

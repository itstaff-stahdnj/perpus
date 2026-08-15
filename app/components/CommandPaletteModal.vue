<template>
  <Teleport to="body">
    <Transition name="command-fade">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-[999999] bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 select-none"
        @click.self="close"
        @keydown.esc="close"
      >
        <div 
          class="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all animate-in fade-in zoom-in-95 duration-150"
          @click.stop
        >
          <!-- Search Header Input -->
          <div class="p-4 border-b border-slate-100 dark:border-zinc-800/80 flex items-center gap-3 bg-slate-50/50 dark:bg-zinc-900/50">
            <span class="material-symbols-outlined text-slate-400 dark:text-zinc-500 text-2xl shrink-0">search</span>
            <input 
              ref="searchInputRef"
              v-model="query" 
              type="text" 
              class="w-full bg-transparent text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 font-semibold text-sm sm:text-base outline-none"
              placeholder="Cari buku, halaman, atau ketikkan perintah... (Ctrl+K)"
              @keydown.down.prevent="navigateDown"
              @keydown.up.prevent="navigateUp"
              @keydown.enter.prevent="selectActiveItem"
            />
            <span class="hidden sm:inline-block px-2 py-1 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 rounded-lg text-[10px] font-extrabold tracking-wider shrink-0">
              ESC
            </span>
          </div>

          <!-- Results Scroll Area -->
          <div class="max-h-[60vh] overflow-y-auto p-3 space-y-4">
            
            <!-- Quick Actions Group -->
            <div v-if="filteredActions.length > 0">
              <p class="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Aksi Cepat & Navigasi
              </p>
              <div class="space-y-1 mt-1">
                <div 
                  v-for="(item, idx) in filteredActions" 
                  :key="item.id"
                  @click="executeItem(item)"
                  @mouseenter="selectedIndex = idx"
                  class="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                  :class="selectedIndex === idx ? 'bg-primary text-white dark:bg-blue-600 shadow-md' : 'hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-200'"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="material-symbols-outlined text-xl shrink-0" :class="selectedIndex === idx ? 'text-white' : 'text-primary dark:text-blue-400'">
                      {{ item.icon }}
                    </span>
                    <div class="truncate">
                      <p class="font-bold text-xs sm:text-sm truncate">{{ item.title }}</p>
                      <p class="text-[10px] opacity-80 truncate">{{ item.subtitle }}</p>
                    </div>
                  </div>
                  <span class="text-[10px] font-extrabold opacity-70 shrink-0 bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-md">
                    {{ item.shortcut || 'Buka' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Dynamic Book Search Results -->
            <div v-if="query.trim().length > 0">
              <p class="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Katalog Buku ({{ matchingBooks.length }} Hasil)
              </p>
              
              <div v-if="matchingBooks.length === 0" class="p-6 text-center text-xs text-slate-400 dark:text-zinc-500">
                Tidak ada buku yang cocok dengan "{{ query }}"
              </div>

              <div v-else class="space-y-1 mt-1">
                <div 
                  v-for="(book, idx) in matchingBooks" 
                  :key="book.id"
                  @click="openBook(book)"
                  @mouseenter="selectedIndex = filteredActions.length + idx"
                  class="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                  :class="selectedIndex === (filteredActions.length + idx) ? 'bg-primary text-white dark:bg-blue-600 shadow-md' : 'hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-200'"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="material-symbols-outlined text-xl shrink-0" :class="selectedIndex === (filteredActions.length + idx) ? 'text-white' : 'text-amber-500'">
                      menu_book
                    </span>
                    <div class="truncate">
                      <p class="font-bold text-xs sm:text-sm truncate">{{ book.judul }}</p>
                      <p class="text-[10px] opacity-80 truncate">{{ book.penulis || 'Penulis Tidak Diketahui' }}</p>
                    </div>
                  </div>
                  <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-md shrink-0" :class="book.is_ebook ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300'">
                    {{ book.is_ebook ? 'E-Book' : 'Fisik' }}
                  </span>
                </div>
              </div>
            </div>

          </div>

          <!-- Footer Shortcut Hints -->
          <div class="p-3 bg-slate-100/70 dark:bg-zinc-950 border-t border-slate-200/80 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 px-4">
            <div class="flex items-center gap-3">
              <span class="flex items-center gap-1"><kbd class="px-1.5 py-0.5 bg-white dark:bg-zinc-800 rounded shadow-xs text-[9px] font-mono">↑↓</kbd> Navigasi</span>
              <span class="flex items-center gap-1"><kbd class="px-1.5 py-0.5 bg-white dark:bg-zinc-800 rounded shadow-xs text-[9px] font-mono">↵</kbd> Pilih</span>
            </div>
            <span class="font-bold text-primary dark:text-blue-400">STAH DNJ Command Center</span>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { usePustakaApi, type Book } from '~/composables/usePustakaApi';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'trigger-voice'): void;
  (e: 'trigger-member-card'): void;
}>();

const router = useRouter();
const { getBooks } = usePustakaApi();

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const query = ref('');
const selectedIndex = ref(0);
const searchInputRef = ref<HTMLInputElement | null>(null);
const allBooks = ref<Book[]>([]);

const defaultActions = [
  { id: 'nav-home', title: 'Beranda Utama', subtitle: 'Ke Halaman Beranda', icon: 'home', action: () => router.push('/') },
  { id: 'nav-katalog', title: 'Katalog Buku', subtitle: 'Jelajahi Koleksi Pustaka', icon: 'menu_book', action: () => router.push('/buku') },
  { id: 'nav-layanan', title: 'Layanan & Bebas Pustaka', subtitle: 'Informasi Layanan Mahasiswa', icon: 'room_service', action: () => router.push('/layanan') },
  { id: 'nav-absensi', title: 'Absensi Kedatangan', subtitle: 'Presensi Pengunjung Pustaka', icon: 'qr_code_scanner', action: () => router.push('/absensi') },
  { id: 'nav-reservasi', title: 'Reservasi & Peminjaman', subtitle: 'Status Peminjaman Mandiri', icon: 'event_seat', action: () => router.push('/reservasi') },
  { id: 'nav-profile', title: 'Profil & Kartu Anggota', subtitle: 'Buka Kartu Keanggotaan Digital', icon: 'badge', action: () => emit('trigger-member-card') },
  { id: 'nav-voice', title: 'Pencarian Perintah Suara', subtitle: 'Cari Buku via Mikrofon Suara', icon: 'mic', action: () => emit('trigger-voice') },
  { 
    id: 'act-backup', 
    title: 'Backup Manual D1 ke Server Laravel', 
    subtitle: 'Cadangkan data D1 ke Server API Laravel', 
    icon: 'cloud_upload', 
    action: async () => {
      try {
        const res = await fetch('/api/backup/push-laravel', { method: 'POST' }).then(r => r.json());
        alert(res.message || 'Backup manual selesai diproses.');
      } catch (e) {
        alert('Gagal mengirimkan backup ke Laravel.');
      }
    }
  }
];

const filteredActions = computed(() => {
  if (!query.value.trim()) return defaultActions;
  const q = query.value.toLowerCase();
  return defaultActions.filter(a => a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q));
});

const matchingBooks = computed(() => {
  if (!query.value.trim()) return [];
  const q = query.value.toLowerCase();
  return allBooks.value.filter(b => 
    b.judul.toLowerCase().includes(q) || 
    (b.penulis && b.penulis.toLowerCase().includes(q)) ||
    (b.isbn && b.isbn.includes(q))
  ).slice(0, 8);
});

const totalItemsCount = computed(() => filteredActions.value.length + matchingBooks.value.length);

const navigateDown = () => {
  if (totalItemsCount.value === 0) return;
  selectedIndex.value = (selectedIndex.value + 1) % totalItemsCount.value;
};

const navigateUp = () => {
  if (totalItemsCount.value === 0) return;
  selectedIndex.value = (selectedIndex.value - 1 + totalItemsCount.value) % totalItemsCount.value;
};

const selectActiveItem = () => {
  if (selectedIndex.value < filteredActions.value.length) {
    executeItem(filteredActions.value[selectedIndex.value]);
  } else {
    const bookIdx = selectedIndex.value - filteredActions.value.length;
    if (matchingBooks.value[bookIdx]) {
      openBook(matchingBooks.value[bookIdx]);
    }
  }
};

const executeItem = (item: any) => {
  close();
  if (item?.action) item.action();
};

const openBook = (b: Book) => {
  close();
  const slug = (b.judul || 'buku').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  router.push(`/buku/${slug}-${b.id}`);
};

const close = () => {
  isOpen.value = false;
  query.value = '';
  selectedIndex.value = 0;
};

const loadBooksCache = async () => {
  try {
    const res = await getBooks();
    if (res?.data && Array.isArray(res.data)) {
      allBooks.value = res.data;
    }
  } catch (e) {}
};

watch(isOpen, (newVal) => {
  if (newVal) {
    selectedIndex.value = 0;
    loadBooksCache();
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
});

// Keyboard Shortcut Listener (Ctrl+K / Cmd+K)
const handleGlobalKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    isOpen.value = !isOpen.value;
  }
};

onMounted(() => {
  if (process.client) {
    window.addEventListener('keydown', handleGlobalKeydown);
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('keydown', handleGlobalKeydown);
  }
});
</script>

<style scoped>
.command-fade-enter-active,
.command-fade-leave-active {
  transition: opacity 0.2s ease;
}
.command-fade-enter-from,
.command-fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <Teleport to="body">
    <Transition name="shelf-fade">
      <div 
        v-if="modelValue" 
        class="fixed inset-0 z-[999999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none"
        @click.self="close"
      >
        <div class="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl">
                📍
              </div>
              <div>
                <h3 class="font-extrabold text-base text-slate-900 dark:text-zinc-100">Navigasi Peta Lokasi Rak 2D</h3>
                <p class="text-xs text-slate-500 dark:text-zinc-400">Temukan posisi rak buku fisik di Gedung Perpustakaan STAH DNJ</p>
              </div>
            </div>
            <button @click="close" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 flex items-center justify-center text-slate-500 dark:text-zinc-400 cursor-pointer">
              ✕
            </button>
          </div>

          <!-- Shelf Details Pill -->
          <div class="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-2xl flex items-center justify-between gap-3 text-slate-900 dark:text-zinc-100">
            <div>
              <p class="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">POSISI RAK BUKS FISIK</p>
              <p class="font-black text-sm text-slate-900 dark:text-amber-200 mt-0.5">{{ shelfLocation.floor }} • {{ shelfLocation.rack }}</p>
              <p class="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">Klasifikasi DDC: <strong class="font-mono">{{ ddcCode }}</strong> ({{ shelfLocation.category }})</p>
            </div>
            <span class="px-3 py-1.5 bg-amber-500 text-slate-950 rounded-xl font-extrabold text-xs shadow-md shrink-0">
              Lantai {{ shelfLocation.floorLevel }}
            </span>
          </div>

          <!-- Interactive 2D Library Floor Map Canvas -->
          <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800 relative overflow-hidden text-white shadow-inner">
            <div class="flex justify-between items-center text-[10px] text-slate-400 mb-3 font-bold">
              <span>DENAH DUA DIMENSI (GEDUNG PERPUSTAKAAN STAH DNJ)</span>
              <span class="text-emerald-400 flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Pintu Masuk Utaman</span>
              </span>
            </div>

            <!-- 2D Map Grid Layout -->
            <div class="grid grid-cols-4 gap-2 text-center text-xs font-bold py-2">
              
              <!-- Zone A (000 & 100) -->
              <div 
                class="p-4 rounded-xl border transition-all flex flex-col justify-between h-24"
                :class="shelfZone === 'A' ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/50 shadow-lg scale-105' : 'bg-slate-800/60 border-slate-700 text-slate-400 opacity-60'"
              >
                <span class="text-[10px] uppercase">RAK A (000-100)</span>
                <span class="font-black text-sm">Umum & Filsafat</span>
                <span v-if="shelfZone === 'A'" class="text-[9px] bg-amber-400 text-slate-950 font-black rounded py-0.5 px-1 animate-pulse">LOKASI BUKU</span>
              </div>

              <!-- Zone B (200 Agama Hindu & Veda) -->
              <div 
                class="p-4 rounded-xl border transition-all flex flex-col justify-between h-24"
                :class="shelfZone === 'B' ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/50 shadow-lg scale-105' : 'bg-slate-800/60 border-slate-700 text-slate-400 opacity-60'"
              >
                <span class="text-[10px] uppercase">RAK B (200)</span>
                <span class="font-black text-sm">Agama & Veda</span>
                <span v-if="shelfZone === 'B'" class="text-[9px] bg-amber-400 text-slate-950 font-black rounded py-0.5 px-1 animate-pulse">LOKASI BUKU</span>
              </div>

              <!-- Zone C (300 & 400 Sosial & Kawi) -->
              <div 
                class="p-4 rounded-xl border transition-all flex flex-col justify-between h-24"
                :class="shelfZone === 'C' ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/50 shadow-lg scale-105' : 'bg-slate-800/60 border-slate-700 text-slate-400 opacity-60'"
              >
                <span class="text-[10px] uppercase">RAK C (300-400)</span>
                <span class="font-black text-sm">Sosial & Kawi</span>
                <span v-if="shelfZone === 'C'" class="text-[9px] bg-amber-400 text-slate-950 font-black rounded py-0.5 px-1 animate-pulse">LOKASI BUKU</span>
              </div>

              <!-- Zone D (500-900 Sains & Sastra) -->
              <div 
                class="p-4 rounded-xl border transition-all flex flex-col justify-between h-24"
                :class="shelfZone === 'D' ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/50 shadow-lg scale-105' : 'bg-slate-800/60 border-slate-700 text-slate-400 opacity-60'"
              >
                <span class="text-[10px] uppercase">RAK D (500-900)</span>
                <span class="font-black text-sm">Sains & Sastra</span>
                <span v-if="shelfZone === 'D'" class="text-[9px] bg-amber-400 text-slate-950 font-black rounded py-0.5 px-1 animate-pulse">LOKASI BUKU</span>
              </div>

            </div>

            <!-- Floor Map Legend & Circulation Desk -->
            <div class="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 bg-blue-600 rounded-sm"></span> Meja Pustakawan & Sirkulasi</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span> Kiosk Presensi Mandiri</span>
            </div>
          </div>

          <!-- Close Action -->
          <div class="flex justify-end pt-1">
            <button 
              @click="close" 
              class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
            >
              Tutup Peta Rak
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  book?: any;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const close = () => emit('update:modelValue', false);

const ddcCode = computed(() => {
  if (!props.book) return '200';
  const raw = String(props.book.ddc || props.book.kode_ddc || props.book.category?.nama_kategori || '200');
  const match = raw.match(/\d{3}/);
  return match ? match[0] : '200';
});

const shelfZone = computed(() => {
  const codeNum = parseInt(ddcCode.value, 10);
  if (isNaN(codeNum)) return 'B';
  if (codeNum >= 0 && codeNum < 200) return 'A';
  if (codeNum >= 200 && codeNum < 300) return 'B';
  if (codeNum >= 300 && codeNum < 500) return 'C';
  return 'D';
});

const shelfLocation = computed(() => {
  switch (shelfZone.value) {
    case 'A':
      return { floor: 'Gedung Utama (Lantai 1)', floorLevel: 1, rack: 'Baris Rak A-02', category: 'Karya Umum & Filsafat' };
    case 'B':
      return { floor: 'Gedung Utama (Lantai 1)', floorLevel: 1, rack: 'Baris Rak B-01 (Koleksi Utama)', category: 'Agama Hindu & Kitab Suci' };
    case 'C':
      return { floor: 'Gedung Utama (Lantai 2)', floorLevel: 2, rack: 'Baris Rak C-04', category: 'Ilmu Sosial & Bahasa Kawi' };
    default:
      return { floor: 'Gedung Utama (Lantai 2)', floorLevel: 2, rack: 'Baris Rak D-03', category: 'Sains, Sastra & Sejarah' };
  }
});
</script>

<style scoped>
.shelf-fade-enter-active,
.shelf-fade-leave-active {
  transition: opacity 0.2s ease;
}
.shelf-fade-enter-from,
.shelf-fade-leave-to {
  opacity: 0;
}
</style>

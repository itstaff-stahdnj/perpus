<template>
  <Teleport to="body">
    <Transition name="receipt-fade">
      <div 
        v-if="modelValue" 
        class="fixed inset-0 z-[999999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none"
        @click.self="close"
      >
        <div class="w-full max-w-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900 dark:text-zinc-100">
          
          <!-- Receipt Header Bar -->
          <div class="text-center space-y-1 pb-3 border-b border-dashed border-slate-300 dark:border-zinc-700">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center font-bold text-2xl">
              🧾
            </div>
            <h3 class="font-black text-base uppercase tracking-wider text-slate-900 dark:text-white">STRUK PEMINJAMAN DIGITAL</h3>
            <p class="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">Perpustakaan STAH Dharma Nusantara Jakarta</p>
          </div>

          <!-- Borrow Details Body -->
          <div class="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl space-y-2 text-xs">
            <div class="flex justify-between">
              <span class="text-slate-500">KODE LOAN:</span>
              <strong class="font-mono text-primary dark:text-blue-400">{{ loanCode }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">JUDUL BUKU:</span>
              <strong class="font-bold truncate max-w-[180px] text-right">{{ loan?.book?.judul || loan?.judul_buku || 'Buku Pustaka' }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">TANGGAL PINJAM:</span>
              <span>{{ formatDate(loan?.tanggal_pinjam || loan?.created_at) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">TENGGAT KEMBALI:</span>
              <strong class="text-rose-600 dark:text-rose-400 font-bold">{{ formatDate(loan?.tanggal_kembali || loan?.due_date) }}</strong>
            </div>
          </div>

          <!-- Due Date Countdown Pill -->
          <div class="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 rounded-2xl text-center space-y-0.5">
            <p class="text-[10px] font-extrabold uppercase text-amber-700 dark:text-amber-400">HITUNG MUNDUR SISA WAKTU</p>
            <p class="font-mono text-sm font-black text-amber-900 dark:text-amber-300">{{ remainingDaysText }}</p>
          </div>

          <!-- QR Return Pass Display -->
          <div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-inner text-center space-y-1">
            <p class="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">QR PASS PENGEMBALIAN KILAT</p>
            <img 
              :src="`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(loanCode)}`" 
              alt="QR Return Pass"
              class="w-32 h-32 mx-auto object-contain"
            />
            <p class="text-[10px] font-mono font-bold text-slate-900">{{ loanCode }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between gap-2 pt-1">
            <button @click="printReceipt" class="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer">
              🖨️ Cetak Struk
            </button>
            <button @click="close" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold text-xs rounded-xl transition-all cursor-pointer">
              Tutup
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
  loan?: any;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const close = () => emit('update:modelValue', false);

const loanCode = computed(() => props.loan?.kode_pinjam || `LOAN-${props.loan?.id || 101}`);

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

const remainingDaysText = computed(() => {
  if (!props.loan?.tanggal_kembali && !props.loan?.due_date) return '7 Hari Tersisa';
  const target = new Date(props.loan?.tanggal_kembali || props.loan?.due_date).getTime();
  const diff = target - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return `⚠️ Terlambat ${Math.abs(days)} Hari`;
  if (days === 0) return `🚨 Tenggat Jatuh Hari Ini!`;
  return `⏱️ ${days} Hari Lagi (Sebelum Tenggat)`;
});

const printReceipt = () => {
  if (process.client) window.print();
};
</script>

<style scoped>
.receipt-fade-enter-active,
.receipt-fade-leave-active {
  transition: opacity 0.2s ease;
}
.receipt-fade-enter-from,
.receipt-fade-leave-to {
  opacity: 0;
}
</style>

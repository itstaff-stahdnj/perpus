<template>
  <Teleport to="body">
    <div 
      v-if="modelValue" 
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="close"
    >
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-left border border-slate-200 animate-in fade-in zoom-in duration-200 text-slate-800 flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-4 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <span class="material-symbols-outlined text-xl">shopping_cart</span>
            </div>
            <div>
              <h3 class="font-extrabold text-slate-900 text-base">Keranjang Tampungan Buku</h3>
              <p class="text-xs text-slate-500">Pinjam lebih dari 1 buku sekaligus (Multi-Book Borrow)</p>
            </div>
          </div>
          <button class="text-slate-400 hover:text-slate-700 transition-colors p-1" @click="close">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="cart.length === 0" class="py-12 text-center text-slate-500 space-y-3">
          <span class="material-symbols-outlined text-5xl text-slate-300">remove_shopping_cart</span>
          <p class="font-bold text-sm text-slate-700">Keranjang Tampungan Masih Kosong</p>
          <p class="text-xs text-slate-500 max-w-xs mx-auto">
            Tambahkan beberapa buku dari katalog atau detail buku dengan mengklik tombol "Tampung" untuk meminjam lebih dari 1 buku sekaligus.
          </p>
          <button 
            @click="close" 
            class="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-container transition-colors cursor-pointer"
          >
            Jelajahi Katalog Buku
          </button>
        </div>

        <!-- Book List & Controls -->
        <div v-else class="flex-1 overflow-y-auto space-y-4 pr-1">
          <div class="flex items-center justify-between text-xs font-bold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl">
            <span>Daftar Buku Terpilih ({{ cart.length }} Buku)</span>
            <button @click="clearCart" class="text-rose-600 hover:underline text-[11px] cursor-pointer">
              Kosongkan Keranjang
            </button>
          </div>

          <!-- Book Item Cards -->
          <div class="space-y-2">
            <div 
              v-for="b in cart" 
              :key="b.id" 
              class="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-colors"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-12 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  <img 
                    :src="b.cover_image || b.cover_image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI61U0Gb0GCI3csX5g_Tws6K5775TufoAItfBr2ZGCANRNu0NlxeseUAuBqzB1HzuvrIrNV4NL21OSkV2q370ak_bZc5ebYvc7EokgVQMknIbqYuCSawR1NSfEuUD6E5AQrhSg6ZUkbaPs4t2BL3nAkKNCggbNKDXGvVa66mTDLxbv5FTt8BL1NUy1G07xpcgZGOlGMxPMbFyoCq3umgCSOwvRXmcGF_BSqvr7ev8nerw29xv8txFLMQ'" 
                    alt="Cover"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="min-w-0 text-xs">
                  <p class="font-bold text-slate-900 truncate leading-tight mb-0.5">{{ b.judul }}</p>
                  <p class="text-slate-500 truncate mb-1">{{ b.penulis || 'Penulis Tidak Diketahui' }}</p>
                  <span class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md font-mono">
                    {{ b.no_panggil || `D EKMA ${b.id}` }}
                  </span>
                </div>
              </div>

              <button 
                @click="removeFromCart(b.id)"
                class="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shrink-0 cursor-pointer"
                title="Hapus buku dari keranjang"
              >
                <span class="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          </div>

          <!-- Duration Selector -->
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <label class="block text-xs font-bold text-slate-700">Durasi Peminjaman (Berlaku untuk Semua Buku):</label>
            <div class="grid grid-cols-3 gap-2">
              <button 
                v-for="d in [3, 5, 7]" 
                :key="d"
                type="button"
                @click="durasiHari = d"
                class="py-2.5 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5"
                :class="durasiHari === d ? 'bg-primary text-white border-primary shadow-xs' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'"
              >
                <span>{{ d }} Hari</span>
                <span class="text-[10px] opacity-80 font-normal">Standard</span>
              </button>
            </div>

            <div class="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
              <span class="text-slate-600">Estimasi Tenggat Kembali:</span>
              <strong class="text-primary font-bold">{{ calculatedDueDate }}</strong>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div v-if="cart.length > 0" class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0 mt-2">
          <button 
            @click="close"
            class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
          >
            Tutup
          </button>
          
          <button 
            @click="processBatchBorrow"
            :disabled="submitting"
            class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-2 active:scale-95"
          >
            <span v-if="submitting" class="material-symbols-outlined text-base animate-spin">sync</span>
            <span v-else class="material-symbols-outlined text-base">check_circle</span>
            <span>{{ submitting ? 'Memproses...' : `Pinjam ${cart.length} Buku Sekaligus` }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePustakaCart } from '../composables/usePustakaCart';
import { usePustakaApi } from '../composables/usePustakaApi';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'borrowed-success'): void;
}>();

const { cart, removeFromCart, clearCart } = usePustakaCart();
const { selfBorrow, tokenCookie } = usePustakaApi();

const durasiHari = ref(7);
const submitting = ref(false);

const close = () => {
  emit('update:modelValue', false);
};

const calculatedDueDate = computed(() => {
  const d = new Date();
  d.setDate(d.getDate() + Number(durasiHari.value));
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
});

const processBatchBorrow = async () => {
  if (!tokenCookie.value) {
    if (process.client) {
      window.location.href = 'https://portal-perpus.stahdnj.ac.id/sso/perpus';
    }
    return;
  }

  if (cart.value.length === 0) return;

  submitting.value = true;
  let successCount = 0;
  let errorMsgs: string[] = [];

  try {
    for (const b of [...cart.value]) {
      const res = await selfBorrow(b.id, durasiHari.value);
      if (res.success) {
        successCount++;
        removeFromCart(b.id);
      } else {
        errorMsgs.push(`${b.judul}: ${res.message}`);
      }
    }

    if (successCount > 0) {
      alert(`Berhasil meminjam ${successCount} buku sekaligus! Silakan cek daftar Pinjaman Aktif di menu Profil.`);
      emit('borrowed-success');
      if (cart.value.length === 0) {
        close();
      }
    }

    if (errorMsgs.length > 0) {
      alert(`Beberapa buku tidak dapat dipinjam:\n${errorMsgs.join('\n')}`);
    }
  } finally {
    submitting.value = false;
  }
};
</script>

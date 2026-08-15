<template>
  <Teleport to="body">
    <Transition name="card-fade">
      <div 
        v-if="modelValue" 
        class="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none"
        @click.self="close"
      >
        <div class="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          <!-- Modal Header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary text-2xl">badge</span>
              <h3 class="font-extrabold text-lg text-slate-900 dark:text-zinc-100">Kartu Anggota Digital</h3>
            </div>
            <button @click="close" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 flex items-center justify-center text-slate-500 dark:text-zinc-400 cursor-pointer">
              ✕
            </button>
          </div>

          <!-- Flip Card Container (Perspective 3D) -->
          <div class="w-full aspect-[1.586/1] relative cursor-pointer group" style="perspective: 1000px;" @click="isFlipped = !isFlipped">
            <div 
              class="w-full h-full duration-700 transition-transform relative rounded-2xl shadow-xl border border-white/20"
              :style="{
                transformStyle: 'preserve-3d',
                WebkitTransformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }"
            >
              <!-- FRONT SIDE OF CARD -->
              <div 
                class="absolute inset-0 rounded-2xl p-5 bg-gradient-to-br from-slate-900 via-primary to-slate-950 text-white flex flex-col justify-between overflow-hidden shadow-2xl border border-secondary/30"
                style="backface-visibility: hidden; -webkit-backface-visibility: hidden;"
              >
                <!-- Background Pattern -->
                <div class="absolute inset-0 opacity-15 pointer-events-none" style="background-image: radial-gradient(#d97706 1px, transparent 1px); background-size: 16px 16px;"></div>
                <div class="absolute -top-12 -right-12 w-40 h-40 bg-secondary/20 rounded-full blur-2xl"></div>

                <!-- Header Brand -->
                <div class="flex items-start justify-between relative z-10">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md text-sm">
                      📖
                    </div>
                    <div>
                      <h4 class="font-extrabold text-xs tracking-wider uppercase text-amber-300 leading-tight">PERPUSTAKAAN STAH DNJ</h4>
                      <p class="text-[9px] text-slate-300 font-medium">STAH Dharma Nusantara Jakarta</p>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[9px] font-extrabold tracking-wider uppercase">
                    {{ memberRole }}
                  </span>
                </div>

                <!-- Member Info Section -->
                <div class="flex items-center gap-4 relative z-10 my-1">
                  <div class="w-16 h-16 rounded-xl bg-slate-800 border-2 border-amber-400/60 overflow-hidden shrink-0 shadow-lg flex items-center justify-center text-xl font-bold text-amber-400">
                    <img v-if="memberAvatar" :src="memberAvatar" class="w-full h-full object-cover" :alt="memberName" />
                    <span v-else>{{ (memberName || 'U').charAt(0) }}</span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="font-black text-sm text-white truncate leading-tight">{{ memberName }}</p>
                    <p class="text-xs text-amber-300 font-mono font-bold truncate mt-0.5">{{ memberNim || memberEmail }}</p>
                    <p class="text-[10px] text-slate-300 font-medium mt-1 flex items-center gap-1">
                      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>Status: {{ memberStatus }}</span>
                    </p>
                  </div>
                </div>

                <!-- Bottom QR Token Bar -->
                <div class="flex items-center justify-between pt-2 border-t border-white/10 relative z-10 text-[9px] text-slate-300">
                  <span>ID TOKEN: <strong class="font-mono text-amber-300">{{ qrToken }}</strong></span>
                  <span class="text-amber-400 font-bold flex items-center gap-0.5">
                    <span>Klik kartu untuk membalik</span> 🔄
                  </span>
                </div>
              </div>

              <!-- BACK SIDE OF CARD -->
              <div 
                class="absolute inset-0 rounded-2xl p-5 bg-gradient-to-br from-zinc-950 via-slate-900 to-zinc-900 text-white flex flex-col justify-between border border-zinc-700 shadow-2xl"
                style="backface-visibility: hidden; -webkit-backface-visibility: hidden; transform: rotateY(180deg);"
              >
                <div>
                  <h4 class="font-extrabold text-xs text-amber-300 uppercase tracking-wider mb-2">SYARAT & KETENTUAN KARTU</h4>
                  <ul class="text-[10px] text-zinc-300 space-y-1 leading-relaxed list-disc list-inside">
                    <li>Kartu ini adalah identitas resmi pemustaka STAH DNJ.</li>
                    <li>Gunakan QR Code di bawah untuk presensi &amp; peminjaman mandiri.</li>
                    <li>Penyalahgunaan kartu dapat menyebabkan penangguhan akun.</li>
                  </ul>
                </div>

                <!-- Simulated Barcode Display -->
                <div class="bg-white p-2.5 rounded-xl text-center space-y-1 shadow-inner">
                  <svg class="w-full h-8 mx-auto" viewBox="0 0 200 40" preserveAspectRatio="none">
                    <rect x="0" width="4" height="40" fill="#000"/>
                    <rect x="6" width="2" height="40" fill="#000"/>
                    <rect x="12" width="6" height="40" fill="#000"/>
                    <rect x="22" width="2" height="40" fill="#000"/>
                    <rect x="28" width="4" height="40" fill="#000"/>
                    <rect x="36" width="8" height="40" fill="#000"/>
                    <rect x="48" width="2" height="40" fill="#000"/>
                    <rect x="54" width="6" height="40" fill="#000"/>
                    <rect x="64" width="4" height="40" fill="#000"/>
                    <rect x="72" width="2" height="40" fill="#000"/>
                    <rect x="78" width="6" height="40" fill="#000"/>
                    <rect x="88" width="8" height="40" fill="#000"/>
                    <rect x="100" width="4" height="40" fill="#000"/>
                    <rect x="108" width="2" height="40" fill="#000"/>
                    <rect x="114" width="6" height="40" fill="#000"/>
                    <rect x="124" width="4" height="40" fill="#000"/>
                    <rect x="132" width="6" height="40" fill="#000"/>
                    <rect x="142" width="2" height="40" fill="#000"/>
                    <rect x="148" width="8" height="40" fill="#000"/>
                    <rect x="160" width="4" height="40" fill="#000"/>
                    <rect x="168" width="2" height="40" fill="#000"/>
                    <rect x="174" width="6" height="40" fill="#000"/>
                    <rect x="184" width="4" height="40" fill="#000"/>
                    <rect x="192" width="4" height="40" fill="#000"/>
                  </svg>
                  <p class="font-mono text-[10px] font-bold text-slate-900 tracking-widest">{{ qrToken }}</p>
                </div>
              </div>

            </div>
          </div>

          <!-- Actions Footer -->
          <div class="flex items-center justify-between gap-3 pt-2">
            <button 
              @click="printCard" 
              class="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span class="material-symbols-outlined text-base">print</span>
              <span>Cetak / Simpan Kartu</span>
            </button>
            <button 
              @click="close" 
              class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Tutup
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  user?: any;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const isFlipped = ref(false);

const memberName = computed(() => props.user?.name || 'Pemustaka STAH DNJ');
const memberEmail = computed(() => props.user?.email || 'pemustaka@stahdnj.ac.id');
const memberNim = computed(() => props.user?.nim || props.user?.nidn || null);
const memberRole = computed(() => props.user?.role || 'Mahasiswa');
const memberStatus = computed(() => props.user?.status_keanggotaan || 'Aktif');
const memberAvatar = computed(() => props.user?.avatar_url || null);
const qrToken = computed(() => props.user?.qr_token || memberNim.value || `STAH-${props.user?.id || 1001}`);

const close = () => {
  emit('update:modelValue', false);
  isFlipped.value = false;
};

const printCard = () => {
  if (process.client) {
    window.print();
  }
};
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.preserve-3d {
  transform-style: preserve-3d;
}
.backface-hidden {
  backface-visibility: hidden;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
.card-fade-enter-active,
.card-fade-leave-active {
  transition: opacity 0.25s ease;
}
.card-fade-enter-from,
.card-fade-leave-to {
  opacity: 0;
}
</style>

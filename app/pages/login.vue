<template>
  <div class="min-h-screen bg-surface-bright text-on-background font-body-md flex items-center justify-center py-12 px-margin-mobile sm:px-margin-desktop relative overflow-hidden">
    <!-- Background Accents -->
    <div class="absolute inset-0 opacity-10 pointer-events-none">
      <div class="absolute w-full h-full" style="background-image: radial-gradient(#1b2e4b 1px, transparent 1px); background-size: 32px 32px;"></div>
    </div>
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-md relative z-10">
      <!-- Main Login Card -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant/60 shadow-2xl space-y-6">
        
        <!-- Header & Logo -->
        <div class="text-center space-y-2">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-secondary mb-1 shadow-md">
            <span class="material-symbols-outlined text-4xl">local_library</span>
          </div>
          <h1 class="font-headline-md text-2xl text-primary font-extrabold">Login Perpustakaan</h1>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            Masuk dengan Email, NIM, atau NIDN Civitas Akademika STAH Dharma Nusantara Jakarta.
          </p>
        </div>

        <!-- Alert Notification -->
        <div 
          v-if="errorMessage" 
          class="p-4 rounded-2xl text-xs font-bold border flex items-start gap-2.5"
          :class="isSuccess ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-rose-50 text-rose-900 border-rose-300'"
        >
          <span class="material-symbols-outlined text-base shrink-0 mt-0.5">
            {{ isSuccess ? 'check_circle' : 'error' }}
          </span>
          <div class="space-y-1">
            <p>{{ errorMessage }}</p>
            <p v-if="isFailoverMode" class="text-[10px] opacity-80">
              ⚡ Terhubung menggunakan database cadangan Cloudflare D1 (Mode Failover).
            </p>
          </div>
        </div>

        <!-- Direct Login Form -->
        <form @submit.prevent="handleFormLogin" class="space-y-4 text-left">
          <div>
            <label class="block font-bold text-xs text-primary mb-1">NIM / NIDN / Email *</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">person</span>
              <input 
                v-model="loginInput" 
                type="text" 
                required 
                placeholder="Masukkan NIM, NIDN, atau Email..."
                class="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-primary font-medium outline-none focus:border-secondary transition-colors"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-xs text-primary mb-1">Password *</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
              <input 
                v-model="passwordInput" 
                :type="showPassword ? 'text' : 'password'" 
                required 
                placeholder="Masukkan password Anda..."
                class="w-full pl-10 pr-10 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-primary font-medium outline-none focus:border-secondary transition-colors"
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <span class="material-symbols-outlined text-base">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="submitting"
            class="w-full py-3.5 px-6 bg-gradient-to-r from-primary via-blue-900 to-primary hover:from-blue-900 hover:to-primary text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-[98%] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <span class="material-symbols-outlined text-lg" :class="{ 'animate-spin': submitting }">
              {{ submitting ? 'sync' : 'login' }}
            </span>
            <span>{{ submitting ? 'Memproses Authentikasi...' : 'Masuk ke Perpustakaan' }}</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative flex items-center justify-center py-2">
          <div class="border-t border-outline-variant/60 w-full"></div>
          <span class="bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant shrink-0">atau</span>
        </div>

        <!-- External SSO Portal Link -->
        <a 
          href="https://portal-perpus.stahdnj.ac.id/sso/perpus" 
          class="w-full py-3 px-4 bg-surface-container-high hover:bg-secondary/10 text-primary font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-outline-variant/60"
        >
          <span class="material-symbols-outlined text-base">open_in_new</span>
          <span>Masuk via SSO External Portal</span>
        </a>

        <!-- Footer Back Link -->
        <div class="pt-4 border-t border-outline-variant/60 text-center text-xs text-on-surface-variant">
          <NuxtLink to="/" class="text-primary font-bold hover:underline inline-flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">arrow_back</span>
            <span>Kembali ke Beranda Utama</span>
          </NuxtLink>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePustakaApi } from '~/composables/usePustakaApi';

definePageMeta({
  layout: false
});

const router = useRouter();
const { login } = usePustakaApi();

const loginInput = ref('');
const passwordInput = ref('');
const showPassword = ref(false);
const submitting = ref(false);
const errorMessage = ref('');
const isSuccess = ref(false);
const isFailoverMode = ref(false);

const handleFormLogin = async () => {
  if (!loginInput.value.trim() || !passwordInput.value.trim()) return;

  submitting.value = true;
  errorMessage.value = '';
  isSuccess.value = false;
  isFailoverMode.value = false;

  try {
    const res = await login(loginInput.value, passwordInput.value);
    if (res.success) {
      isSuccess.value = true;
      isFailoverMode.value = !!res.is_failover;
      errorMessage.value = res.message || 'Login berhasil!';

      setTimeout(() => {
        const userRole = (res.data?.role || '').toLowerCase();
        if (userRole === 'admin' || userRole === 'pustakawan' || userRole === 'administrator') {
          router.push('/admin');
        } else {
          router.push('/profil');
        }
      }, 1000);
    } else {
      isSuccess.value = false;
      errorMessage.value = res.message || 'Login gagal. Periksa kembali NIM/Email dan password Anda.';
    }
  } catch (err: any) {
    isSuccess.value = false;
    errorMessage.value = err?.message || 'Terjadi kesalahan saat otentikasi.';
  } finally {
    submitting.value = false;
  }
};

useHead({
  title: 'Login Perpustakaan - STAH Dharma Nusantara Jakarta',
  meta: [
    { name: 'description', content: 'Masuk ke portal layanan digital perpustakaan STAH Dharma Nusantara Jakarta.' }
  ]
});
</script>

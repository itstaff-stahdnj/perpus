<template>
  <div class="min-h-screen bg-surface-bright text-on-background font-body-md flex items-center justify-center py-12 px-margin-mobile sm:px- margin-desktop relative overflow-hidden">
    <!-- Background Accents -->
    <div class="absolute inset-0 opacity-10 pointer-events-none">
      <div class="absolute w-full h-full" style="background-image: radial-gradient(#1b2e4b 1px, transparent 1px); background-size: 32px 32px;"></div>
    </div>
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-md relative z-10">
      <!-- Card Login -->
      <div class="bg-white rounded-3xl card-shadow p-8 border border-outline-variant/60 shadow-xl">
        <!-- Logo & Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-secondary mb-4 shadow-md">
            <span class="material-symbols-outlined text-4xl">local_library</span>
          </div>
          <h1 class="font-headline-md text-2xl text-primary font-extrabold mb-1">Portal Pustaka STAH DNJ</h1>
          <p class="text-xs text-on-surface-variant">Masuk dengan NIM / NIDN / Email dan Password</p>
        </div>

        <!-- Alert Notification -->
        <div v-if="alertMessage" class="p-4 rounded-xl mb-6 text-xs flex items-center gap-3" :class="alertSuccess ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'">
          <span class="material-symbols-outlined text-xl" :class="alertSuccess ? 'text-emerald-600' : 'text-rose-600'">
            {{ alertSuccess ? 'check_circle' : 'error' }}
          </span>
          <span class="leading-snug">{{ alertMessage }}</span>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLoginSubmit" class="flex flex-col gap-4">
          <div>
            <label class="block text-xs font-bold text-primary mb-1.5">NIM / NIDN / Email</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">person</span>
              <input 
                v-model="emailOrNim" 
                type="text" 
                required 
                placeholder="e.g. 2209.00.1929 atau email@stahdnj.ac.id" 
                class="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-primary font-medium outline-none focus:border-secondary transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-primary mb-1.5">Kata Sandi (Password)</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">lock</span>
              <input 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                required 
                placeholder="Masukkan kata sandi..." 
                class="w-full pl-10 pr-10 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-primary font-medium outline-none focus:border-secondary transition-all"
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                <span class="material-symbols-outlined text-lg">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="submitting" 
            class="w-full py-3.5 mt-2 bg-primary hover:bg-primary-container text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-[98%] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span class="material-symbols-outlined text-lg">login</span>
            <span>{{ submitting ? 'Memproses Masuk...' : 'Masuk Ke Pustaka' }}</span>
          </button>
        </form>

        <!-- Divider & Help links -->
        <div class="mt-8 pt-6 border-t border-outline-variant/60 text-center flex flex-col gap-3 text-xs text-on-surface-variant">
          <p>Belum memiliki kata sandi atau lupa password?</p>
          <NuxtLink to="/bantuan" class="text-secondary font-bold hover:underline inline-flex items-center justify-center gap-1">
            <span class="material-symbols-outlined text-sm">help</span>
            <span>Hubungi Meja Bantuan Perpustakaan</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { login, getProfile, tokenCookie } = usePustakaApi();
const router = useRouter();

const emailOrNim = ref('');
const password = ref('');
const showPassword = ref(false);
const submitting = ref(false);
const alertMessage = ref('');
const alertSuccess = ref(false);

const adminRoles = ['admin', 'kepala_pustaka', 'kepala_perpustakaan', 'pustakawan', 'staf', 'petugas', 'operator'];

const redirectByUserRole = (user) => {
  const roleStr = (user?.role || '').toLowerCase();
  const isAdmin = adminRoles.some(r => roleStr.includes(r));
  if (isAdmin) {
    router.push('/admin');
  } else {
    router.push('/dashboard');
  }
};

const handleLoginSubmit = async () => {
  if (!emailOrNim.value.trim() || !password.value.trim()) return;

  submitting.value = true;
  alertMessage.value = '';

  try {
    const res = await login(emailOrNim.value.trim(), password.value.trim());
    if (res?.success) {
      alertSuccess.value = true;
      alertMessage.value = res.message || 'Login berhasil! Mengalihkan ke dashboard...';

      // Determine user role and redirect
      let userObj = res.data || res.user;
      if (!userObj || !userObj.role) {
        const profileRes = await getProfile().catch(() => null);
        userObj = profileRes?.data || profileRes?.user || userObj;
      }

      setTimeout(() => {
        redirectByUserRole(userObj);
      }, 800);
    } else {
      alertSuccess.value = false;
      alertMessage.value = res.message || 'Login gagal. Periksa kembali NIM/Email dan Password Anda.';
    }
  } catch (err) {
    alertSuccess.value = false;
    alertMessage.value = err?.message || 'Terjadi kesalahan sistem saat mencoba masuk.';
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  if (tokenCookie.value) {
    const profileRes = await getProfile().catch(() => null);
    if (profileRes?.data || profileRes?.user) {
      redirectByUserRole(profileRes.data || profileRes.user);
    }
  }
});

useHead({
  title: 'Masuk Pustaka Digital - STAH Dharma Nusantara Jakarta',
  meta: [
    { name: 'description', content: 'Halaman autentikasi portal perpustakaan STAH Dharma Nusantara Jakarta.' }
  ]
});
</script>

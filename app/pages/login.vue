<template>
  <div class="min-h-screen bg-surface-bright text-on-background font-body-md flex items-center justify-center py-12 px-margin-mobile sm:px-margin-desktop relative overflow-hidden">
    <!-- Background Accents -->
    <div class="absolute inset-0 opacity-10 pointer-events-none">
      <div class="absolute w-full h-full" style="background-image: radial-gradient(#1b2e4b 1px, transparent 1px); background-size: 32px 32px;"></div>
    </div>
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-md relative z-10 text-center">
      <!-- Card Login Redirect -->
      <div class="bg-white rounded-3xl p-8 border border-outline-variant/60 shadow-2xl">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-secondary mb-4 shadow-md">
          <span class="material-symbols-outlined text-4xl">vpn_key</span>
        </div>
        <h1 class="font-headline-md text-2xl text-primary font-extrabold mb-2">Mengalihkan ke Portal Autentikasi</h1>
        <p class="text-xs text-on-surface-variant mb-6 leading-relaxed">
          Autentikasi terpusat STAH Dharma Nusantara berada di <strong>portal-perpus.stahdnj.ac.id</strong>.<br/>
          Setelah masuk, Anda akan diarahkan ke Dashboard di <strong>panel-perpus.stahdnj.ac.id</strong>.
        </p>

        <div class="space-y-3">
          <a 
            href="https://portal-perpus.stahdnj.ac.id/login" 
            class="w-full py-4 px-6 bg-primary hover:bg-primary-container text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-[98%] flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined text-lg">open_in_new</span>
            <span>Masuk Lewat portal-perpus.stahdnj.ac.id</span>
          </a>

          <a 
            href="https://panel-perpus.stahdnj.ac.id" 
            class="w-full py-3 px-6 bg-surface-container-high hover:bg-secondary/10 text-primary font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-outline-variant/60"
          >
            <span class="material-symbols-outlined text-base">dashboard</span>
            <span>Langsung Ke Dashboard Panel Perpus</span>
          </a>
        </div>

        <div class="mt-8 pt-6 border-t border-outline-variant/60 text-xs text-on-surface-variant">
          <NuxtLink to="/" class="text-primary font-bold hover:underline inline-flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">arrow_back</span>
            <span>Kembali ke Beranda Perpustakaan</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
});

onMounted(() => {
  // Auto redirect after 1.5s
  setTimeout(() => {
    window.location.href = 'https://portal-perpus.stahdnj.ac.id/login';
  }, 1500);
});

useHead({
  title: 'Pengalihan Portal Login - STAH Dharma Nusantara Jakarta',
  meta: [
    { name: 'description', content: 'Autentikasi terpusat portal perpustakaan STAH Dharma Nusantara Jakarta.' }
  ]
});
</script>

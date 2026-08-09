<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-100 pb-20 selection:bg-primary selection:text-white">
    
    <!-- HERO HEADER SECTION -->
    <section class="relative bg-gradient-to-br from-slate-950 via-blue-950 to-primary-container text-white py-16 sm:py-24 overflow-hidden border-b border-blue-900/40">
      <!-- Background Mesh Decoration -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute w-full h-full" style="background-image: radial-gradient(#38bdf8 1px, transparent 1px); background-size: 32px 32px;"></div>
      </div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-6">
        
        <!-- Navigation Breadcrumb -->
        <NuxtLink to="/layanan" class="inline-flex items-center gap-2 text-xs font-extrabold text-blue-200 hover:text-white transition-all bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
          <span>← Kembali ke Layanan Perpustakaan</span>
        </NuxtLink>

        <!-- Header Content Grid -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div class="space-y-3 max-w-3xl">
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-md">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Gerbang Akses Riset & Jurnal Digital Global</span>
            </div>

            <h1 class="text-3xl sm:text-5xl font-black leading-tight text-white tracking-tight">
              E-Resources <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-blue-300 to-emerald-300">Pustaka Digital</span>
            </h1>

            <p class="text-xs sm:text-base text-slate-300 leading-relaxed font-medium">
              Gerbang digital menuju ribuan jurnal internasional bereputasi, e-book, repositori naskah kebudayaan, dan basis data riset global yang dapat diakses kapan saja dan di mana saja.
            </p>
          </div>

          <!-- User Authentication Status Card -->
          <div v-if="currentUser" class="p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shrink-0 shadow-2xl space-y-2 max-w-xs w-full">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800">
                🟢 Terverifikasi
              </span>
              <span class="text-[10px] font-mono text-slate-300 uppercase">{{ userRole }}</span>
            </div>

            <div>
              <p class="text-sm font-black text-white truncate">{{ currentUser.name }}</p>
              <p class="text-xs text-slate-300 font-mono">{{ currentUser.email || currentUser.nim || currentUser.nidn }}</p>
            </div>

            <p class="text-[11px] text-amber-300 font-bold flex items-center gap-1 pt-1 border-t border-white/10">
              <span>✨ Hak Akses Berlangganan Kampus Aktif</span>
            </p>
          </div>

          <!-- Guest Banner Status Card -->
          <div v-else class="p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shrink-0 shadow-2xl space-y-3 max-w-xs w-full">
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-800">
                🌐 Akses Terbuka Penuh
              </span>
              <p class="text-xs text-slate-200 mt-2 leading-snug">
                Seluruh e-resources dan jurnal digital terbuka langsung untuk Anda jelajahi & unduh.
              </p>
            </div>

            <a 
              href="https://portal-perpus.stahdnj.ac.id/sso/perpus"
              class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🔑</span>
              <span>Login SSO Civitas</span>
            </a>
          </div>
        </div>

        <!-- Interactive Search & Category Filter Bar -->
        <div class="pt-6 space-y-4">
          <div class="flex flex-col sm:flex-row gap-3">
            
            <!-- Live Search Input -->
            <div class="relative flex-1">
              <span class="material-symbols-outlined absolute left-4 top-3.5 text-slate-400 text-xl">search</span>
              <input 
                ref="searchInputRef"
                v-model="searchQuery" 
                type="text" 
                placeholder="Ketik nama jurnal, topik riset, atau kata kunci (contoh: Scopus, Garuda, Weda, Sinta)..."
                class="w-full pl-12 pr-10 py-3 rounded-2xl bg-white/95 dark:bg-zinc-900/95 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary shadow-xl font-medium"
              />
              <button 
                v-if="searchQuery" 
                @click="clearSearch"
                class="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 text-xs bg-slate-200 dark:bg-zinc-700 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                title="Bersihkan pencarian (Esc)"
              >
                ✕
              </button>
            </div>

            <!-- Total Resources Counter -->
            <div class="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center justify-between sm:justify-center gap-2">
              <span>📚 Menampilkan:</span>
              <span class="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black font-mono">
                {{ filteredResources.length }} / {{ eResources.length }} Portal
              </span>
            </div>
          </div>

          <!-- Quick Suggestion Chips -->
          <div class="flex items-center gap-2 flex-wrap text-xs">
            <span class="text-slate-300 font-bold text-[11px]">💡 Pencarian Populer:</span>
            <button 
              v-for="chip in popularChips" 
              :key="chip"
              @click="setSearchQuery(chip)"
              class="px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/30 text-white text-[11px] font-semibold transition-all cursor-pointer border border-white/15"
            >
              {{ chip }}
            </button>
          </div>

          <!-- Category Pill Tabs -->
          <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button 
              v-for="cat in categories" 
              :key="cat.id"
              @click="selectedCategory = cat.id"
              class="px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border"
              :class="selectedCategory === cat.id ? 'bg-primary text-white border-primary shadow-lg shadow-blue-600/30 scale-102' : 'bg-white/10 text-slate-200 border-white/15 hover:bg-white/20'"
            >
              <span>{{ cat.icon }}</span>
              <span>{{ cat.label }}</span>
              <span class="text-[10px] opacity-80 font-mono">({{ getCategoryCount(cat.id) }})</span>
            </button>
          </div>
        </div>

      </div>
    </section>

    <!-- MAIN CONTENT BODY -->
    <main class="max-w-7xl mx-auto px-4 sm:px-8 mt-10 space-y-10">
      
      <!-- DYNAMIC STATUS NOTICE BANNER -->
      <div v-if="currentUser" class="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-300 flex items-center justify-between flex-wrap gap-3 backdrop-blur-md shadow-sm">
        <div class="flex items-center gap-3">
          <span class="text-xl">✅</span>
          <div>
            <p class="font-extrabold text-xs sm:text-sm">Hak Akses Civitas Akademika Terverifikasi</p>
            <p class="text-[11px] opacity-90">Selamat datang, <strong>{{ currentUser?.name }}</strong>. Seluruh fasilitas portal e-resources & jurnal internasional siap Anda gunakan secara penuh.</p>
          </div>
        </div>
        <span class="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider">
          {{ userRole.toUpperCase() }}
        </span>
      </div>

      <div v-else class="p-5 rounded-3xl bg-blue-500/10 border border-blue-500/30 text-blue-950 dark:text-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md shadow-sm">
        <div class="flex items-start gap-3">
          <span class="text-xl shrink-0">🚀</span>
          <div class="space-y-1">
            <p class="font-extrabold text-xs sm:text-sm">Akses E-Resources Terbuka Penuh Untuk Anda</p>
            <p class="text-[11px] opacity-90 leading-relaxed">
              Seluruh basis data riset, e-book, dan portal jurnal di bawah ini dapat diakses langsung oleh Mahasiswa, Dosen, Pustakawan, Admin, maupun Pengunjung Pustaka STAH DNJ.
            </p>
          </div>
        </div>

        <a 
          href="https://portal-perpus.stahdnj.ac.id/sso/perpus"
          class="px-5 py-2.5 rounded-2xl bg-primary hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span>🔑</span>
          <span>Login SSO Kampus</span>
        </a>
      </div>

      <!-- E-RESOURCES GRID CARDS -->
      <section class="space-y-6">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <h2 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>📚 Direktori Basis Data E-Resources</span>
            <span class="text-xs text-slate-400 font-normal">({{ filteredResources.length }} Hasil Ditemukan)</span>
          </h2>

          <div v-if="searchQuery" class="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-zinc-300">
            <span>Pencarian untuk: "<span class="text-primary">{{ searchQuery }}</span>"</span>
            <button @click="clearSearch" class="text-xs text-rose-500 underline cursor-pointer">Hapus Filter</button>
          </div>
        </div>

        <!-- Grid Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="resource in filteredResources" 
            :key="resource.id"
            class="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-5 relative overflow-hidden group"
          >
            <!-- Background Accent Ribbon -->
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none"></div>

            <div class="space-y-4">
              <!-- Top Row: Icon & Badge -->
              <div class="flex items-start justify-between gap-3">
                <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner shrink-0">
                  {{ resource.icon }}
                </div>
                <span 
                  class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-2xs border"
                  :class="resource.badgeColor"
                >
                  {{ resource.badge }}
                </span>
              </div>

              <!-- Title & Publisher -->
              <div class="space-y-1">
                <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug">
                  {{ resource.name }}
                </h3>
                <p class="text-[11px] font-bold text-slate-400 dark:text-zinc-400 flex items-center gap-1">
                  <span>Penerbit:</span>
                  <span class="text-slate-700 dark:text-zinc-200 font-semibold truncate">{{ resource.publisher }}</span>
                </p>
              </div>

              <!-- Description -->
              <p class="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
                {{ resource.description }}
              </p>

              <!-- Access Mode Pill Box -->
              <div class="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-800 text-[11px] space-y-1">
                <p class="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-xs text-primary">key</span>
                  <span>Petunjuk Akses:</span>
                </p>
                <p class="text-slate-600 dark:text-zinc-400 leading-snug">
                  {{ resource.accessGuide }}
                </p>
              </div>
            </div>

            <!-- Bottom Action Row -->
            <div class="pt-2 flex items-center gap-2">
              <button 
                @click="openResourceModal(resource)"
                class="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shrink-0"
                title="Lihat rincian informasi"
              >
                <span class="material-symbols-outlined text-sm">info</span>
                <span>Info</span>
              </button>

              <a 
                :href="resource.url" 
                target="_blank" 
                rel="noopener noreferrer"
                class="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-primary hover:to-blue-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-lg"
              >
                <span>Buka Portal E-Resource</span>
                <span class="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">open_in_new</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Empty Results View -->
        <div v-if="filteredResources.length === 0" class="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 p-8 space-y-3">
          <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-3xl mx-auto">🔍</div>
          <h4 class="text-base font-bold text-slate-900 dark:text-white">Basis Data Tidak Ditemukan</h4>
          <p class="text-xs text-slate-500 max-w-md mx-auto">
            Tidak ada portal e-resource yang cocok dengan kata kunci "{{ searchQuery }}". Cobalah kata kunci lain seperti Scopus, Garuda, atau Weda.
          </p>
          <button @click="clearSearch" class="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl cursor-pointer">
            Reset Pencarian
          </button>
        </div>
      </section>

      <!-- PANDUAN KAMPUS & ETIKA PENGGUNAAN -->
      <section class="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-primary flex items-center justify-center text-2xl shrink-0">
            ⚖️
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Panduan Akses & Etika Penggunaan E-Resources
            </h3>
            <p class="text-xs text-slate-500 dark:text-zinc-400">
              Tata tertib dan standar etika akademik penggunaan basis data lisensi perpustakaan.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div class="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-800 space-y-2">
            <p class="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-base">wifi</span>
              <span>Akses Kampus & Remote VPN</span>
            </p>
            <p class="text-slate-600 dark:text-zinc-400 leading-relaxed">
              Koleksi jurnal berlangganan dapat diakses secara otomatis saat menggunakan Wi-Fi Kampus STAH DNJ atau login SSO institusi secara remote.
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-800 space-y-2">
            <p class="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-base">auto_stories</span>
              <span>Manajemen Referensi & Sitasi</span>
            </p>
            <p class="text-slate-600 dark:text-zinc-400 leading-relaxed">
              Gunakan perangkat lunak Mendeley atau Zotero untuk mengelola referensi dan mengunduh format sitasi resmi (APA/IEEE/Chicago).
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-800 space-y-2">
            <p class="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-rose-500 text-base">gavel</span>
              <span>Kebijakan Fair Use & Larangan Scraper</span>
            </p>
            <p class="text-slate-600 dark:text-zinc-400 leading-relaxed">
              Dilarang keras menggunakan software pengunduhan massal otomatis (bulk downloading scraper/bot) yang dapat memicu pemblokiran lisensi kampus.
            </p>
          </div>
        </div>
      </section>

    </main>

    <!-- RESOURCE DETAIL MODAL -->
    <Teleport to="body">
      <div 
        v-if="selectedResourceModal" 
        class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
        @click.self="selectedResourceModal = null"
      >
        <div class="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-5 text-left relative">
          <button 
            @click="selectedResourceModal = null" 
            class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>

          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-3xl shrink-0">
              {{ selectedResourceModal.icon }}
            </div>
            <div>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase" :class="selectedResourceModal.badgeColor">
                {{ selectedResourceModal.badge }}
              </span>
              <h3 class="text-lg font-black text-slate-900 dark:text-white leading-tight mt-1">
                {{ selectedResourceModal.name }}
              </h3>
              <p class="text-xs text-slate-500">Penerbit: {{ selectedResourceModal.publisher }}</p>
            </div>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <h4 class="font-bold text-slate-900 dark:text-white mb-1">Deskripsi Basis Data:</h4>
              <p class="text-slate-600 dark:text-zinc-300 leading-relaxed">{{ selectedResourceModal.description }}</p>
            </div>

            <div class="p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl space-y-1">
              <h4 class="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <span>🔑 Panduan Akses Resmi:</span>
              </h4>
              <p class="text-slate-600 dark:text-zinc-300">{{ selectedResourceModal.accessGuide }}</p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button @click="selectedResourceModal = null" class="px-4 py-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-bold cursor-pointer">
              Tutup
            </button>
            <a 
              :href="selectedResourceModal.url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="px-5 py-2.5 bg-primary hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Kunjungi Portal E-Resource</span>
              <span class="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePustakaApi } from '../../composables/usePustakaApi';

const { getProfile, tokenCookie } = usePustakaApi();

const currentUser = ref<any>(null);
const loadingUser = ref(true);

const searchQuery = ref('');
const selectedCategory = ref('all');
const selectedResourceModal = ref<any>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);

const popularChips = [
  'Scopus',
  'Garuda Sinta',
  'Weda & Sanskrit',
  'Perpusnas',
  'IEEE Xplore',
  'DOAJ',
  'Open Library',
  'Google Scholar',
];

const categories = [
  { id: 'all', label: 'Semua Portal', icon: '🌐' },
  { id: 'intl', label: 'Jurnal Internasional', icon: '🔬' },
  { id: 'nasional', label: 'Jurnal Nasional', icon: '🇮🇩' },
  { id: 'hindu', label: 'Naskah & Indologi', icon: '🕉️' },
  { id: 'ebook', label: 'E-Book & Repositori', icon: '📖' },
];

const userRole = computed(() => {
  return (currentUser.value?.role || 'tamu').toLowerCase();
});

const isAuthorized = computed(() => {
  return true; // Direct open access for everyone!
});

const eResources = [
  {
    id: 1,
    category: 'intl',
    name: 'Scopus / Elsevier',
    shortName: 'Scopus',
    publisher: 'Elsevier B.V.',
    icon: '🔬',
    badge: 'Q1-Q4 Scopus Indexed',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800',
    description: 'Basis data sitasi dan abstrak jurnal terindeks internasional terbesar di dunia untuk penelusuran riset ilmiah bereputasi tinggi.',
    accessGuide: 'Login menggunakan Email SSO institusi / Wi-Fi Kampus STAH DNJ.',
    keywords: ['scopus', 'elsevier', 'internasional', 'q1', 'q2', 'q3', 'q4', 'jurnal', 'sitasi', 'riset'],
    url: 'https://www.scopus.com',
  },
  {
    id: 2,
    category: 'intl',
    name: 'ScienceDirect',
    shortName: 'ScienceDirect',
    publisher: 'Elsevier Science',
    icon: '🌐',
    badge: 'Full-Text Peer Reviewed',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    description: 'Platform artikel jurnal ilmiah full-text mencakup bidang ilmu sosial, sains, humaniora, dan pendidikan tinggi.',
    accessGuide: 'Akses penuh artikel via jaringan kampus & kredensial SSO.',
    keywords: ['sciencedirect', 'elsevier', 'fulltext', 'artikel', 'jurnal', 'internasional', 'sains', 'sosial'],
    url: 'https://www.sciencedirect.com',
  },
  {
    id: 3,
    category: 'intl',
    name: 'IEEE Xplore Digital Library',
    shortName: 'IEEE Xplore',
    publisher: 'IEEE',
    icon: '💻',
    badge: 'Teknologi & Elektro',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
    description: 'Koleksi publikasi riset sains data, sistem informasi, teknologi pendidikan, dan elektro dari IEEE.',
    accessGuide: 'Otentikasi otomatis via IP Kampus / SSO.',
    keywords: ['ieee', 'ieee xplore', 'teknologi', 'komputer', 'sistem informasi', 'elektro', 'jurnal'],
    url: 'https://ieeexplore.ieee.org',
  },
  {
    id: 4,
    category: 'nasional',
    name: 'GARUDA (Garba Rujukan Digital)',
    shortName: 'GARUDA',
    publisher: 'Kemenristekdikti / BRIN',
    icon: '🇮🇩',
    badge: 'SINTA 1-6 Terakreditasi',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    description: 'Portal rujukan publikasi ilmiah dan jurnal nasional terakreditasi SINTA dari seluruh perguruan tinggi di Indonesia.',
    accessGuide: 'Akses langsung Open Access tanpa kuota.',
    keywords: ['garuda', 'garba rujukan digital', 'sinta', 'nasional', 'kemdikbud', 'brin', 'skripsi', 'jurnal indonesia'],
    url: 'https://garuda.kemdikbud.go.id',
  },
  {
    id: 5,
    category: 'nasional',
    name: 'Neliti (Repositori Penelitian Indonesia)',
    shortName: 'Neliti',
    publisher: 'Neliti Indonesia',
    icon: '📚',
    badge: 'Open Access Indonesia',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
    description: 'Mesin pencari riset dan repositori pustaka ilmiah terbesar yang mengindeks lebih dari 10.000 jurnal ilmiah Indonesia.',
    accessGuide: 'Dapat diakses gratis kapan saja oleh seluruh civitas.',
    keywords: ['neliti', 'penelitian', 'indonesia', 'repositori', 'jurnal', 'skripsi', 'makalah', 'open access'],
    url: 'https://www.neliti.com/id',
  },
  {
    id: 6,
    category: 'nasional',
    name: 'E-Resources Perpustakaan Nasional RI',
    shortName: 'Perpusnas',
    publisher: 'Perpustakaan Nasional RI',
    icon: '🏛️',
    badge: 'Lisensi Nasional Perpusnas',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    description: 'Layanan basis data e-journal dan e-book berlangganan resmi Perpusnas RI (ProQuest, EBSCO, JSTOR, Springer).',
    accessGuide: 'Daftar anggota Perpusnas gratis dengan NIK / NIM.',
    keywords: ['perpusnas', 'perpustakaan nasional', 'proquest', 'ebsco', 'jstor', 'springer', 'ebook', 'buku digital'],
    url: 'https://e-resources.perpusnas.go.id',
  },
  {
    id: 7,
    category: 'hindu',
    name: 'Digital Sanskrit Library & GRETIL',
    shortName: 'GRETIL Sanskrit',
    publisher: 'Göttingen Register of Electronic Texts in Indian Languages',
    icon: '🕉️',
    badge: 'Naskah Suci & Indologi',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    description: 'Repositori digital teks Sanskrit kuno, Weda, Upanisad, Darsana, Purana, dan teks sastra filosofis Indologi.',
    accessGuide: 'Akses terbuka untuk riset agama & kebudayaan Hindu.',
    keywords: ['weda', 'sanskrit', 'gretil', 'sansekerta', 'upanisad', 'purana', 'darsana', 'hindu', 'agama', 'sastra kuno', 'naskah'],
    url: 'http://gretil.sub.uni-goettingen.de',
  },
  {
    id: 8,
    category: 'hindu',
    name: 'SOAS Research Online & Indology Archive',
    shortName: 'SOAS Indology',
    publisher: 'University of London (SOAS)',
    icon: '📜',
    badge: 'Studi Kebudayaan Nusantara',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    description: 'Koleksi e-book dan jurnal riset studi kawasan Asia, sejarah kebudayaan Nusantara, dan kajian tradisi Bali.',
    accessGuide: 'Dapat diunduh langsung format PDF.',
    keywords: ['soas', 'indology', 'bali', 'nusantara', 'kebudayaan', 'sejarah', 'lontar', 'studi asia'],
    url: 'https://eprints.soas.ac.uk',
  },
  {
    id: 9,
    category: 'ebook',
    name: 'DOAJ (Directory of Open Access Journals)',
    shortName: 'DOAJ',
    publisher: 'Infrastructure Services for Open Access',
    icon: '🔓',
    badge: 'Global Open Access',
    badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-300 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800',
    description: 'Direktori jurnal akses terbuka independen yang memuat lebih dari 18.000 jurnal ilmiah terpeer-review secara ketat.',
    accessGuide: 'Bebas biaya unduh karya ilmiah full-text.',
    keywords: ['doaj', 'open access', 'directory', 'jurnal', 'gratis', 'pdf', 'artikel'],
    url: 'https://doaj.org',
  },
  {
    id: 10,
    category: 'ebook',
    name: 'Internet Archive & Open Library',
    shortName: 'Open Library',
    publisher: 'Internet Archive',
    icon: '📖',
    badge: 'E-Book Peminjaman Digital',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    description: 'Perpustakaan digital global penyedia jutaan e-book akademik, manuskrip sejarah, dan karya klasik yang dapat dipinjam.',
    accessGuide: 'Buat akun gratis dengan email kampus.',
    keywords: ['open library', 'internet archive', 'ebook', 'buku digital', 'manuskrip', 'sejarah', 'pinjam ebook'],
    url: 'https://openlibrary.org',
  },
  {
    id: 11,
    category: 'ebook',
    name: 'Google Scholar / Cendekia',
    shortName: 'Google Scholar',
    publisher: 'Google LLC',
    icon: '🎓',
    badge: 'Mesin Sitasi Global',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    description: 'Mesin pencari khusus tesis, disertasi, buku akademik, dan abstrak makalah ilmiah lintas disiplin.',
    accessGuide: 'Terhubung langsung ke repositori institusi.',
    keywords: ['google scholar', 'cendekia', 'sitasi', 'skripsi', 'tesis', 'disertasi', 'pdf', 'karya ilmiah'],
    url: 'https://scholar.google.com',
  },
];

const filteredResources = computed(() => {
  const qRaw = searchQuery.value.toLowerCase().trim();
  if (!qRaw) {
    return eResources.filter(res => selectedCategory.value === 'all' || res.category === selectedCategory.value);
  }

  // Tokenize search query into individual words (e.g. "scopus jurnal")
  const tokens = qRaw.split(/\s+/).filter(Boolean);

  return eResources.filter(res => {
    // If user is searching, check across category if category doesn't match or default to all
    const matchCategory = selectedCategory.value === 'all' || res.category === selectedCategory.value;

    const searchableText = [
      res.name,
      res.shortName,
      res.publisher,
      res.description,
      res.badge,
      res.accessGuide,
      ...(res.keywords || [])
    ].join(' ').toLowerCase();

    // Check if every token matches searchable text
    const matchTokens = tokens.every(token => searchableText.includes(token));

    return matchTokens && (selectedCategory.value === 'all' || matchCategory);
  });
});

const setSearchQuery = (query: string) => {
  searchQuery.value = query;
  if (selectedCategory.value !== 'all') {
    selectedCategory.value = 'all';
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  if (searchInputRef.value) {
    searchInputRef.value.focus();
  }
};

const getCategoryCount = (categoryId: string) => {
  if (categoryId === 'all') return eResources.length;
  return eResources.filter(r => r.category === categoryId).length;
};

const openResourceModal = (res: any) => {
  selectedResourceModal.value = res;
};

const fetchUser = async () => {
  if (!tokenCookie.value) {
    loadingUser.value = false;
    return;
  }

  try {
    const res = await getProfile();
    if (res?.data?.user) {
      currentUser.value = res.data.user;
    }
  } catch (e) {
  } finally {
    loadingUser.value = false;
  }
};

onMounted(() => {
  fetchUser();

  // Add ESC key listener to clear search
  if (process.client) {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchQuery.value) {
        clearSearch();
      }
    });
  }
});
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

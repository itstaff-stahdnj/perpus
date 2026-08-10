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
              <span>Mesin Pencari Jurnal & Artikel Ilmiah Global</span>
            </div>

            <h1 class="text-3xl sm:text-5xl font-black leading-tight text-white tracking-tight">
              Meta-Search <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-blue-300 to-emerald-300">Jurnal & E-Resources</span>
            </h1>

            <p class="text-xs sm:text-base text-slate-300 leading-relaxed font-medium">
              Mesin pencari terpadu untuk menemukan artikel riset dari <strong>OJS Jurnal Pasupati STAH DNJ</strong>, Crossref, DOAJ, Scopus, Garuda, Google Scholar, dan Perpusnas secara langsung.
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

        <!-- GLOBAL JOURNAL META-SEARCH ENGINE BAR -->
        <div class="pt-6 space-y-4">
          <form @submit.prevent="executeArticleSearch" class="flex flex-col sm:flex-row gap-3">
            
            <!-- Live Search Input -->
            <div class="relative flex-1">
              <span class="material-symbols-outlined absolute left-4 top-3.5 text-slate-400 text-xl">search</span>
              <input 
                ref="searchInputRef"
                v-model="searchQuery" 
                type="text" 
                placeholder="Cari artikel di OJS Jurnal Pasupati, Crossref, Garuda (contoh: Kebudayaan Hindu, Agama, Pasupati)..."
                class="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white/95 dark:bg-zinc-900/95 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary shadow-2xl font-medium"
              />
              <button 
                v-if="searchQuery" 
                type="button"
                @click="clearSearch"
                class="absolute right-3.5 top-4 text-slate-400 hover:text-slate-600 text-xs bg-slate-200 dark:bg-zinc-700 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                title="Bersihkan pencarian (Esc)"
              >
                ✕
              </button>
            </div>

            <!-- Submit Button for Meta Search -->
            <button 
              type="submit"
              :disabled="isSearchingArticles"
              class="px-6 py-3.5 bg-gradient-to-r from-blue-600 via-primary to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              <span v-if="isSearchingArticles" class="material-symbols-outlined animate-spin text-base">sync</span>
              <span v-else class="material-symbols-outlined text-base">travel_explore</span>
              <span>{{ isSearchingArticles ? 'Mencari Artikel...' : 'Cari Artikel Jurnal' }}</span>
            </button>
          </form>

          <!-- Quick Search Suggestion Chips -->
          <div class="flex items-center gap-2 flex-wrap text-xs">
            <span class="text-slate-300 font-bold text-[11px]">💡 Topik Populer:</span>
            <button 
              v-for="chip in popularChips" 
              :key="chip"
              @click="setSearchQuery(chip)"
              class="px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/30 text-white text-[11px] font-semibold transition-all cursor-pointer border border-white/15"
            >
              {{ chip }}
            </button>
          </div>

          <!-- Category Filter Tabs for Portal Databases -->
          <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
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
      
      <!-- LIVE ACADEMIC JOURNAL ARTICLES SEARCH RESULTS SECTION -->
      <section v-if="articlesList.length > 0 || isSearchingArticles" class="space-y-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div class="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 dark:border-zinc-800 pb-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                🌐 Live Journal Meta-Search
              </span>
              <h2 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Hasil Pencarian Artikel & Jurnal Ilmiah
              </h2>
            </div>
            <p class="text-xs text-slate-500 dark:text-zinc-400">
              Menampilkan {{ articlesList.length }} artikel riset dari OJS Pasupati & portal jurnal untuk kata kunci: <strong class="text-primary">"{{ activeSearchKeyword }}"</strong>
            </p>
          </div>

          <!-- Direct External Search Launchers -->
          <div class="flex items-center gap-2 flex-wrap">
            <a 
              :href="`https://ojs.stahdnj.ac.id/pasupati/search/search?query=${encodeURIComponent(activeSearchKeyword)}`" 
              target="_blank"
              class="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <span>📜 OJS Jurnal Pasupati STAH</span>
              <span class="material-symbols-outlined text-xs">open_in_new</span>
            </a>

            <a 
              :href="`https://garuda.kemdikbud.go.id/documents?q=${encodeURIComponent(activeSearchKeyword)}`" 
              target="_blank"
              class="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-900 dark:text-emerald-300 text-xs font-bold transition-all flex items-center gap-1 border border-emerald-300 dark:border-emerald-800"
            >
              <span>🇮🇩 GARUDA SINTA</span>
              <span class="material-symbols-outlined text-xs">open_in_new</span>
            </a>

            <a 
              :href="`https://scholar.google.com/scholar?q=${encodeURIComponent(activeSearchKeyword)}`" 
              target="_blank"
              class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-700 dark:text-zinc-300 text-xs font-bold transition-all flex items-center gap-1 border border-slate-300 dark:border-zinc-700"
            >
              <span>🎓 Google Scholar</span>
              <span class="material-symbols-outlined text-xs">open_in_new</span>
            </a>
          </div>
        </div>

        <!-- Loading Skeleton for Live Articles -->
        <div v-if="isSearchingArticles" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="i in 4" :key="i" class="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 animate-pulse space-y-3 border border-slate-200/80 dark:border-zinc-800">
            <div class="h-4 w-3/4 bg-slate-200 dark:bg-zinc-700 rounded-md"></div>
            <div class="h-3 w-1/2 bg-slate-200 dark:bg-zinc-700 rounded-md"></div>
            <div class="h-12 w-full bg-slate-200 dark:bg-zinc-700 rounded-xl"></div>
          </div>
        </div>

        <!-- Live Articles Grid Cards -->
        <div v-else v-auto-animate class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div 
            v-for="article in articlesList" 
            :key="article.id"
            class="p-5 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all space-y-3 flex flex-col justify-between group shadow-sm hover:shadow-md"
            :class="article.id.includes('pasupati') ? 'ring-2 ring-amber-400/50 bg-amber-500/5' : ''"
          >
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-2">
                <span 
                  class="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase"
                  :class="article.id.includes('pasupati') ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-300' : 'bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300'"
                >
                  📄 {{ article.publisher || article.source || 'Journal Article' }}
                </span>
                <span class="text-xs text-slate-400 font-mono font-bold">{{ article.year || '2024' }}</span>
              </div>

              <h3 class="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug">
                {{ article.title }}
              </h3>

              <p class="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                ✍️ Penulis: <span class="text-slate-700 dark:text-zinc-200 font-bold">{{ article.author || 'Tim Peneliti' }}</span>
              </p>

              <p v-if="article.journal" class="text-[11px] text-slate-500 dark:text-zinc-400 italic">
                📖 Jurnal: {{ article.journal }}
              </p>

              <p v-if="article.abstract" class="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-3 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-slate-200/60 dark:border-zinc-800">
                {{ article.abstract }}
              </p>
            </div>

            <!-- Article Action Buttons -->
            <div class="pt-2 flex items-center justify-between gap-2 border-t border-slate-200/60 dark:border-zinc-800">
              <span v-if="article.doi" class="text-[10px] font-mono text-slate-400 truncate max-w-[180px]">
                DOI: {{ article.doi }}
              </span>
              <span v-else class="text-[10px] font-mono text-emerald-600 font-bold">
                Akses Terbuka (Full-Text)
              </span>

              <a 
                :href="article.url" 
                target="_blank" 
                rel="noopener noreferrer"
                class="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Baca / Unduh Artikel</span>
                <span class="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            </div>
          </div>
        </div>

      </section>

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
            <span>Filter database untuk: "<span class="text-primary">{{ searchQuery }}</span>"</span>
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
            Tidak ada portal e-resource yang cocok dengan kata kunci "{{ searchQuery }}". Cobalah kata kunci lain seperti Scopus, Pasupati, Garuda, atau Weda.
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
const activeSearchKeyword = ref('');
const selectedCategory = ref('all');
const selectedResourceModal = ref<any>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);

const isSearchingArticles = ref(false);
const articlesList = ref<any[]>([]);

const popularChips = [
  'Jurnal Pasupati STAH',
  'Pendidikan Agama Hindu',
  'Scopus',
  'Garuda Sinta',
  'Sanskrit & Weda',
  'Perpusnas',
  'Artificial Intelligence',
  'Data Mining',
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
    name: 'Jurnal PASUPATI (Jurnal Komunikasi & Kebudayaan STAH DNJ)',
    shortName: 'Jurnal Pasupati',
    publisher: 'STAH Dharma Nusantara Jakarta',
    icon: '📜',
    badge: 'OJS Resmi STAH DNJ',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    description: 'Jurnal ilmiah resmi STAH Dharma Nusantara Jakarta memuat hasil riset kebudayaan Hindu, komunikasi keagamaan, filsafat, pendidikan, dan keilmuan kebudayaan.',
    accessGuide: 'Akses langsung Open Access full-text PDF.',
    keywords: ['pasupati', 'jurnal pasupati', 'ojs stah', 'stahdnj', 'hindu', 'komunikasi', 'kebudayaan', 'agama', 'filsafat'],
    url: 'https://ojs.stahdnj.ac.id/pasupati',
  },
  {
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
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
    id: 11,
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
    id: 12,
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

// Execute Live Journal Meta-Search API (OJS Jurnal Pasupati STAH DNJ & Crossref API for real scientific papers & journals)
const executeArticleSearch = async () => {
  const q = searchQuery.value.trim();
  if (!q) return;

  activeSearchKeyword.value = q;
  isSearchingArticles.value = true;
  articlesList.value = [];

  const pasupatiMatches = [
    {
      id: `pasupati-${Date.now()}`,
      title: `Hasil Penelusuran OJS Jurnal PASUPATI: "${q}"`,
      author: 'Dosen & Tim Peneliti STAH DNJ',
      journal: 'Jurnal PASUPATI (Jurnal Komunikasi & Kebudayaan STAH DNJ)',
      publisher: 'STAH Dharma Nusantara Jakarta',
      year: '2024',
      abstract: `Temukan seluruh artikel ilmiah dan hasil riset kebudayaan, komunikasi, serta filsafat keagamaan Hindu terkait "${q}" di Open Journal System (OJS) Pasupati STAH DNJ.`,
      url: `https://ojs.stahdnj.ac.id/pasupati/search/search?query=${encodeURIComponent(q)}&authors=&title=&abstract=&galleyFullText=&suppFiles=&dateFromMonth=&dateFromDay=&dateFromYear=&dateToMonth=&dateToDay=&dateToYear=&dateToHour=23&dateToMinute=59&dateToSecond=59&discipline=&subject=&type=&coverage=&indexTerms=`,
    }
  ];

  try {
    const res = await $fetch<any>(`https://api.crossref.org/works?query=${encodeURIComponent(q)}&rows=10`).catch(() => null);
    let crossrefItems: any[] = [];
    if (res?.message?.items && Array.isArray(res.message.items)) {
      crossrefItems = res.message.items.map((item: any) => {
        const title = Array.isArray(item.title) ? item.title[0] : (item.title || 'Judul Artikel Ilmiah');
        const authors = Array.isArray(item.author) 
          ? item.author.map((a: any) => `${a.given || ''} ${a.family || ''}`.trim()).join(', ') 
          : 'Tim Peneliti';
        const journal = Array.isArray(item['container-title']) ? item['container-title'][0] : (item['container-title'] || '');
        const year = item['published-print']?.['date-parts']?.[0]?.[0] || item['published-online']?.['date-parts']?.[0]?.[0] || item.created?.['date-parts']?.[0]?.[0] || '2024';
        const doi = item.DOI || '';
        const landingUrl = item.URL || (doi ? `https://doi.org/${doi}` : `https://scholar.google.com/scholar?q=${encodeURIComponent(title)}`);

        return {
          id: doi || Math.random().toString(),
          title,
          author: authors,
          journal,
          publisher: item.publisher || 'Jurnal Terindeks',
          year,
          doi,
          abstract: item.abstract ? item.abstract.replace(/<[^>]*>?/gm, '').slice(0, 200) + '...' : null,
          url: landingUrl,
        };
      });
    }

    articlesList.value = [...pasupatiMatches, ...crossrefItems];
  } catch (e) {
    articlesList.value = pasupatiMatches;
  } finally {
    isSearchingArticles.value = false;
  }
};

const filteredResources = computed(() => {
  const qRaw = searchQuery.value.toLowerCase().trim();
  if (!qRaw) {
    return eResources.filter(res => selectedCategory.value === 'all' || res.category === selectedCategory.value);
  }

  const tokens = qRaw.split(/\s+/).filter(Boolean);

  return eResources.filter(res => {
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

    const matchTokens = tokens.every(token => searchableText.includes(token));

    return matchTokens && (selectedCategory.value === 'all' || matchCategory);
  });
});

const setSearchQuery = (query: string) => {
  searchQuery.value = query;
  if (selectedCategory.value !== 'all') {
    selectedCategory.value = 'all';
  }
  executeArticleSearch();
};

const clearSearch = () => {
  searchQuery.value = '';
  activeSearchKeyword.value = '';
  articlesList.value = [];
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

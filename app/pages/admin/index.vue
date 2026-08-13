<template>
  <div class="bg-surface text-on-surface font-body-md min-h-screen md:h-screen md:overflow-hidden flex flex-col md:flex-row relative">

    <!-- Mobile Admin Bottom Action Sheet -->
    <div v-if="showMobileAdminSheet" class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 md:hidden flex flex-col justify-end" @click.self="showMobileAdminSheet = false">
      <div class="bg-slate-900 text-white rounded-t-3xl p-6 shadow-2xl border-t border-slate-800 animate-in slide-in-from-bottom duration-300 space-y-5">
        <div class="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-1"></div>
        <div class="flex justify-between items-center pb-3 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0">
              <span class="material-symbols-outlined text-xl">shield_person</span>
            </div>
            <div>
              <h3 class="font-bold text-sm text-white leading-tight">{{ userProfile?.name || 'Administrator' }}</h3>
              <p class="text-[10px] text-amber-400 font-bold uppercase tracking-wider">{{ userProfile?.role || 'Admin Panel' }}</p>
            </div>
          </div>
          <button @click="showMobileAdminSheet = false" class="p-1 text-slate-400 hover:text-white">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Admin Quick Actions Grid -->
        <div class="grid grid-cols-2 gap-3 text-xs">
          <button @click="openAddBookModal(); showMobileAdminSheet = false" class="p-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black flex items-center gap-2.5 shadow-md">
            <span class="material-symbols-outlined text-xl">add_circle</span>
            <span>Tambah Buku Baru</span>
          </button>

          <NuxtLink to="/reservasi" class="p-3.5 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 rounded-2xl font-black flex items-center gap-2.5">
            <span class="material-symbols-outlined text-amber-800 text-xl">collections_bookmark</span>
            <span>Portal Reservasi</span>
          </NuxtLink>

          <NuxtLink to="/absensi" target="_blank" class="p-3.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-2xl font-bold flex items-center gap-2.5">
            <span class="material-symbols-outlined text-xl">tv</span>
            <span>Kiosk Absensi</span>
          </NuxtLink>

          <button @click="handleSyncD1(); showMobileAdminSheet = false" class="p-3.5 bg-blue-900/80 hover:bg-blue-800 text-blue-200 border border-blue-700/80 rounded-2xl font-bold flex items-center gap-2.5">
            <span class="material-symbols-outlined text-blue-400 text-xl">database</span>
            <span>Sync DB D1</span>
          </button>

          <button @click="handlePrintReport(); showMobileAdminSheet = false" class="p-3.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-2xl font-bold flex items-center gap-2.5">
            <span class="material-symbols-outlined text-xl">print</span>
            <span>Cetak Laporan</span>
          </button>
        </div>

        <div class="pt-2 border-t border-slate-800">
          <button @click="handleLogout" class="w-full py-3 px-4 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-lg">logout</span>
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </div>
    </div>

    <!-- SideNavBar (Desktop Only) -->
    <aside class="hidden md:flex flex-col h-screen w-72 bg-surface-container-lowest shadow-md border-r border-outline-variant py-6 shrink-0 z-40">
      <div class="px-6 mb-6 flex flex-col gap-1">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-black shadow-sm">
              <span class="material-symbols-outlined text-xl">local_library</span>
            </div>
            <div>
              <h1 class="font-headline-md text-base font-bold text-primary leading-tight">STAH DNJ</h1>
              <p class="text-[10px] text-on-surface-variant uppercase font-semibold tracking-wider">Admin Panel</p>
            </div>
          </div>
        </div>
        <div class="mt-3 flex items-center gap-2">
          <span class="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">shield_person</span>
            <span>{{ userProfile?.role || 'Administrator' }}</span>
          </span>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 overflow-y-auto px-3 space-y-1">
        <button 
          @click="activeTab = 'statistics'"
          class="w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all cursor-pointer"
          :class="activeTab === 'statistics' ? 'bg-primary text-white font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-highest'"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined">monitoring</span>
            <span class="text-xs font-semibold">Statistik &amp; Ringkasan</span>
          </div>
          <span v-if="activeTab === 'statistics'" class="w-2 h-2 rounded-full bg-amber-400"></span>
        </button>

        <button 
          @click="activeTab = 'books'"
          class="w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all cursor-pointer"
          :class="activeTab === 'books' ? 'bg-primary text-white font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-highest'"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined">menu_book</span>
            <span class="text-xs font-semibold">Manajemen Buku</span>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="activeTab === 'books' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'">
            {{ booksList.length }}
          </span>
        </button>

        <button 
          @click="activeTab = 'members'"
          class="w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all cursor-pointer"
          :class="activeTab === 'members' ? 'bg-primary text-white font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-highest'"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined">group</span>
            <span class="text-xs font-semibold">Manajemen Anggota</span>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="activeTab === 'members' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'">
            {{ usersList.length }}
          </span>
        </button>

        <button 
          @click="activeTab = 'circulation'"
          class="w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all cursor-pointer"
          :class="activeTab === 'circulation' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-highest'"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined">sync_alt</span>
            <span class="text-xs font-semibold">Sirkulasi &amp; Pinjaman</span>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="activeTab === 'circulation' ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-900'">
            {{ loansList.length }}
          </span>
        </button>

        <NuxtLink 
          to="/reservasi" 
          class="w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all text-amber-900 bg-amber-100/90 font-bold hover:bg-amber-200 border border-amber-300/80 shadow-xs"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-amber-800">collections_bookmark</span>
            <span class="text-xs">Manajemen Reservasi</span>
          </div>
          <span v-if="reservationsCount > 0" class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-600 text-white">
            {{ reservationsCount }}
          </span>
        </NuxtLink>

        <button 
          @click="activeTab = 'reports'"
          class="w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all cursor-pointer"
          :class="activeTab === 'reports' ? 'bg-primary text-white font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-highest'"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined">assessment</span>
            <span class="text-xs font-semibold">Laporan Eksekutif</span>
          </div>
        </button>
      </nav>

      <div class="px-4 mt-4">
        <button 
          @click="openAddBookModal" 
          class="w-full bg-[#C89B3C] hover:bg-[#b08732] text-slate-950 font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
        >
          <span class="material-symbols-outlined text-lg">add_circle</span>
          <span>Tambah Buku Baru</span>
        </button>
      </div>

      <div class="mt-auto pt-4 border-t border-outline-variant px-3 space-y-1">
        <NuxtLink to="/tata-tertib" class="flex items-center gap-3 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl px-4 py-2.5 text-xs font-medium">
          <span class="material-symbols-outlined text-base">gavel</span>
          <span>Tata Tertib</span>
        </NuxtLink>

        <button @click="handleLogout" class="w-full flex items-center gap-3 text-rose-700 hover:bg-rose-50 transition-colors rounded-xl px-4 py-2.5 text-xs text-left cursor-pointer font-bold">
          <span class="material-symbols-outlined text-rose-600 text-base">logout</span>
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col min-h-screen md:h-screen md:overflow-hidden relative">
      <!-- Native App-Style Top Header Bar (NO BURGER MENU) -->
      <header class="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-outline-variant/60 flex justify-between items-center h-14 sm:h-16 px-4 md:px-8 shrink-0 shadow-xs">
        <div class="flex items-center gap-2.5 min-w-0">
          <NuxtLink to="/" class="flex items-center gap-1 text-primary hover:text-secondary font-black text-xs shrink-0 p-1 rounded-lg hover:bg-slate-100 transition-colors" title="Ke Beranda Utama">
            <span class="material-symbols-outlined text-xl">arrow_back</span>
            <span class="hidden sm:inline">Beranda</span>
          </NuxtLink>

          <!-- Brand Pill Badge -->
          <div class="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full shrink-0">
            <span class="material-symbols-outlined text-primary text-base">shield_person</span>
            <h1 class="text-xs font-black text-primary truncate max-w-[130px] sm:max-w-none">Admin STAH DNJ</h1>
          </div>

          <!-- Live Sync Status Badge -->
          <div class="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300/80 rounded-full text-[10px] font-bold shrink-0">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Realtime Sync</span>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Refresh API Data Button -->
          <button 
            @click="loadAdminData(true)" 
            :disabled="refreshing"
            class="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-primary/20 shrink-0 font-bold text-xs shadow-2xs"
            title="Refresh & Sinkronkan Data API Realtime"
          >
            <span class="material-symbols-outlined text-base" :class="refreshing ? 'animate-spin' : ''">sync</span>
            <span>Sinkron Data</span>
          </button>

          <!-- D1 Backup Database Sync Button -->
          <button 
            @click="handleSyncD1" 
            :disabled="syncingD1"
            class="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 font-bold text-xs active:scale-95"
            title="Sinkronisasi ke Cloudflare D1 Failover Database"
          >
            <span class="material-symbols-outlined text-base" :class="syncingD1 ? 'animate-spin' : ''">cloud_sync</span>
            <span class="hidden sm:inline">Sync DB D1</span>
          </button>

          <NuxtLink to="/reservasi" class="px-3 py-1.5 text-amber-900 hover:bg-amber-100 transition-colors flex items-center gap-1 text-xs font-black bg-amber-50 border border-amber-300 rounded-xl shadow-xs shrink-0" title="Portal Reservasi">
            <span class="material-symbols-outlined text-base text-amber-800">collections_bookmark</span>
            <span class="hidden lg:inline">Portal Reservasi</span>
          </NuxtLink>

          <div class="flex items-center gap-2.5 border-l border-outline-variant pl-3">
            <div class="text-right hidden sm:block">
              <p class="font-label-md text-xs font-bold text-primary leading-tight">{{ userProfile?.name || 'Administrator' }}</p>
              <p class="text-[10px] text-on-surface-variant uppercase font-semibold">{{ userProfile?.role || 'Admin Panel' }}</p>
            </div>
            <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-primary/30 bg-primary-container text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <img v-if="userProfile?.avatar_url" :src="userProfile.avatar_url" alt="Avatar" class="w-full h-full object-cover"/>
              <span v-else class="material-symbols-outlined text-lg sm:text-xl">person</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Toast Alert Notification -->
      <div v-if="toastMessage" class="fixed top-16 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
        <span class="material-symbols-outlined text-amber-400">info</span>
        <span class="text-xs font-semibold">{{ toastMessage }}</span>
      </div>

      <!-- Main Scrollable Content Area -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-surface pb-28 md:pb-8">
        <div class="max-w-[1340px] mx-auto space-y-8">

          <!-- TAB 1: STATISTICS & OVERVIEW -->
          <div v-if="activeTab === 'statistics'" class="space-y-8">
            <!-- Section 1: Ringkasan KPI Realtime -->
            <section>
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 class="font-headline-md text-lg sm:text-xl font-extrabold text-primary">Statistik Realtime Perpustakaan</h2>
                  <p class="text-xs text-on-surface-variant mt-0.5">Pemantauan data koleksi, anggota, sirkulasi, dan kunjungan hari ini secara live.</p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <button @click="loadAdminData(true)" :disabled="refreshing" class="px-3 py-2 bg-surface-container-high hover:bg-surface-container-highest text-primary rounded-xl font-bold text-xs flex items-center gap-1.5 border border-outline-variant cursor-pointer transition-colors shadow-2xs">
                    <span class="material-symbols-outlined text-base" :class="refreshing ? 'animate-spin' : ''">sync</span>
                    <span>Sinkronkan API</span>
                  </button>
                  <button @click="handleSyncD1" :disabled="syncingD1" class="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs active:scale-95">
                    <span class="material-symbols-outlined text-base" :class="syncingD1 ? 'animate-spin' : ''">cloud_sync</span>
                    <span>Sync DB D1</span>
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                <!-- Stat Card 1: Total Books -->
                <div class="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant shadow-xs hover:shadow-md transition-all flex items-start justify-between">
                  <div>
                    <p class="font-body-md text-[11px] sm:text-xs text-on-surface-variant mb-1 font-semibold">Total Koleksi Buku</p>
                    <p class="font-display-lg text-2xl sm:text-3xl font-black text-primary">{{ booksList.length }}</p>
                    <span class="text-[10px] sm:text-[11px] text-emerald-700 font-bold mt-1 inline-flex items-center gap-0.5">
                      <span class="material-symbols-outlined text-xs">check_circle</span> {{ availableBooksCount }} Tersedia
                    </span>
                  </div>
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold shadow-xs shrink-0">
                    <span class="material-symbols-outlined text-xl sm:text-2xl">library_books</span>
                  </div>
                </div>

                <!-- Stat Card 2: Active Loans -->
                <div class="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant shadow-xs hover:shadow-md transition-all flex items-start justify-between">
                  <div>
                    <p class="font-body-md text-[11px] sm:text-xs text-on-surface-variant mb-1 font-semibold">Peminjaman Aktif</p>
                    <p class="font-display-lg text-2xl sm:text-3xl font-black text-amber-700">{{ loansList.length }}</p>
                    <span class="text-[10px] sm:text-[11px] text-amber-800 font-bold mt-1 inline-flex items-center gap-0.5">
                      <span class="material-symbols-outlined text-xs">pending</span> Dipinjam
                    </span>
                  </div>
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shadow-xs shrink-0">
                    <span class="material-symbols-outlined text-xl sm:text-2xl">import_contacts</span>
                  </div>
                </div>

                <!-- Stat Card 3: Total Members -->
                <div class="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant shadow-xs hover:shadow-md transition-all flex items-start justify-between">
                  <div>
                    <p class="font-body-md text-[11px] sm:text-xs text-on-surface-variant mb-1 font-semibold">Total Anggota</p>
                    <p class="font-display-lg text-2xl sm:text-3xl font-black text-primary">{{ usersList.length }}</p>
                    <span class="text-[10px] sm:text-[11px] text-primary font-bold mt-1 inline-flex items-center gap-0.5">
                      <span class="material-symbols-outlined text-xs">verified</span> Mahasiswa/Dosen
                    </span>
                  </div>
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold shadow-xs shrink-0">
                    <span class="material-symbols-outlined text-xl sm:text-2xl">group_add</span>
                  </div>
                </div>

                <!-- Stat Card 4: Visitors Today -->
                <div class="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant shadow-xs hover:shadow-md transition-all flex items-start justify-between">
                  <div>
                    <p class="font-body-md text-[11px] sm:text-xs text-on-surface-variant mb-1 font-semibold">Pengunjung Hari Ini</p>
                    <p class="font-display-lg text-2xl sm:text-3xl font-black text-emerald-700">{{ todayAttendanceCount }}</p>
                    <span class="text-[10px] sm:text-[11px] text-emerald-700 font-bold mt-1 inline-flex items-center gap-0.5">
                      <span class="material-symbols-outlined text-xs">co_present</span> Presensi Kiosk
                    </span>
                  </div>
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold shadow-xs shrink-0">
                    <span class="material-symbols-outlined text-xl sm:text-2xl">badge</span>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 2: Live Activity Feed & Category Distribution -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Live Activity Feed -->
              <section class="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant shadow-xs space-y-4">
                <div class="flex justify-between items-center pb-3 border-b border-outline-variant/60">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-xl">bolt</span>
                    <h3 class="font-bold text-sm sm:text-base text-primary">Aktivitas Terkini (Realtime Stream)</h3>
                  </div>
                  <button @click="loadAdminData(true)" class="text-xs font-bold text-secondary hover:underline cursor-pointer">Refresh</button>
                </div>

                <div class="space-y-3 max-h-96 overflow-y-auto pr-1">
                  <div v-for="(act, idx) in recentActivities" :key="idx" class="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/40 flex items-center justify-between text-xs hover:bg-surface-container-high transition-colors">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary-container text-white flex items-center justify-center font-bold shrink-0">
                        <span class="material-symbols-outlined text-base">person</span>
                      </div>
                      <div>
                        <p class="font-bold text-primary">{{ act.user_name || 'Pemustaka' }}</p>
                        <p class="text-on-surface-variant text-[11px]">
                          {{ act.action_title || 'Melakukan transaksi' }}: <strong class="text-on-surface">{{ act.book_title || 'Buku Perpustakaan' }}</strong>
                        </p>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 bg-surface-container-high text-on-surface-variant text-[10px] font-mono rounded-lg shrink-0">
                      {{ act.time_formatted || 'Baru saja' }}
                    </span>
                  </div>

                  <div v-if="recentActivities.length === 0" class="py-8 text-center text-on-surface-variant text-xs space-y-1">
                    <span class="material-symbols-outlined text-3xl opacity-40">history</span>
                    <p class="font-bold">Belum Ada Catatan Aktivitas Realtime</p>
                  </div>
                </div>
              </section>

              <!-- Category Distribution -->
              <section class="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant shadow-xs space-y-4">
                <div class="pb-3 border-b border-outline-variant/60">
                  <h3 class="font-bold text-sm sm:text-base text-primary">Kategori Buku</h3>
                  <p class="text-[11px] text-on-surface-variant">Sebaran statistik koleksi pustaka STAH DNJ.</p>
                </div>

                <div class="space-y-3 text-xs">
                  <div v-for="cat in categoriesList" :key="cat.id" class="space-y-1">
                    <div class="flex justify-between font-bold text-on-surface">
                      <span>{{ cat.nama_kategori }}</span>
                      <span class="text-primary font-mono">{{ getCategoryBookCount(cat.id) }} Buku</span>
                    </div>
                    <div class="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                      <div class="h-full bg-primary rounded-full transition-all duration-500" :style="{ width: getCategoryPercentage(cat.id) + '%' }"></div>
                    </div>
                  </div>

                  <div v-if="categoriesList.length === 0" class="py-6 text-center text-on-surface-variant text-xs">
                    Memuat daftar kategori...
                  </div>
                </div>
              </section>
            </div>
          </div>

          <!-- TAB 2: BOOK MANAGEMENT -->
          <div v-if="activeTab === 'books'" class="space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 class="font-headline-md text-lg sm:text-xl font-extrabold text-primary">Manajemen Koleksi Buku</h2>
                <p class="text-xs text-on-surface-variant">Kelola seluruh item pustaka cetak dan digital dalam katalog.</p>
              </div>
              <button @click="openAddBookModal" class="bg-primary text-white font-bold text-xs py-2.5 px-5 rounded-xl flex items-center gap-2 hover:bg-primary-container transition-all cursor-pointer shadow-md active:scale-95">
                <span class="material-symbols-outlined text-base">add</span>
                <span>Tambah Buku Baru</span>
              </button>
            </div>

            <!-- Search & Filters Bar -->
            <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div class="relative w-full sm:w-80">
                <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">search</span>
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  placeholder="Cari judul, penulis, ISBN..." 
                  class="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-body-md focus:outline-none focus:border-primary"
                />
              </div>

              <div class="flex items-center gap-3 w-full sm:w-auto">
                <select v-model="selectedCategoryFilter" class="px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-bold text-primary focus:outline-none w-full sm:w-auto">
                  <option value="all">Semua Kategori</option>
                  <option v-for="cat in categoriesList" :key="cat.id" :value="cat.id">{{ cat.nama_kategori }}</option>
                </select>

                <select v-model="selectedStockFilter" class="px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-bold text-primary focus:outline-none w-full sm:w-auto">
                  <option value="all">Semua Status Stok</option>
                  <option value="available">Tersedia (>0)</option>
                  <option value="out">Stok Habis / Dipinjam</option>
                </select>

                <select v-model="itemsPerPage" class="px-3 py-2 bg-primary-container text-white border border-primary rounded-xl text-xs font-bold focus:outline-none w-full sm:w-auto cursor-pointer shadow-xs">
                  <option value="all">Tampilkan Semua Buku ({{ filteredBooks.length }})</option>
                  <option :value="10">10 Per Halaman</option>
                  <option :value="25">25 Per Halaman</option>
                  <option :value="50">50 Per Halaman</option>
                  <option :value="100">100 Per Halaman</option>
                </select>
              </div>
            </div>

            <!-- Book Table Card -->
            <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xs overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead class="bg-surface-container-low border-b border-outline-variant">
                    <tr>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase">Buku &amp; Penulis</th>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase">ISBN / Kode</th>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase">Kategori</th>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase">Status Stok</th>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-outline-variant text-xs">
                    <tr v-for="book in paginatedBooks" :key="book.id" class="hover:bg-surface-container-low/60 transition-colors">
                      <td class="p-4">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-14 bg-surface-container-high rounded overflow-hidden shrink-0 border border-outline-variant flex items-center justify-center text-on-surface-variant font-bold">
                            <img v-if="book.cover_image || book.cover_image_url" :src="book.cover_image || book.cover_image_url" alt="Cover" class="w-full h-full object-cover"/>
                            <span v-else class="material-symbols-outlined text-lg">book</span>
                          </div>
                          <div>
                            <p class="font-bold text-primary leading-tight">{{ book.judul }}</p>
                            <p class="text-[11px] text-on-surface-variant mt-0.5">Penulis: {{ book.penulis || '-' }} | Penerbit: {{ book.penerbit || '-' }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="p-4 text-on-surface-variant font-mono text-[11px]">{{ book.isbn || '-' }}</td>
                      <td class="p-4">
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary-fixed text-on-primary-fixed-variant">
                          {{ getCategoryName(book) }}
                        </span>
                      </td>
                      <td class="p-4">
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold" :class="(book.stok ?? 1) > 0 ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'">
                          {{ (book.stok ?? 1) > 0 ? `Tersedia (${book.stok ?? 1})` : 'Habis / Dipinjam' }}
                        </span>
                      </td>
                      <td class="p-4 text-right space-x-2">
                        <button @click="openEditBookModal(book)" class="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer" title="Edit Buku">
                          <span class="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button @click="confirmDeleteBook(book)" class="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer" title="Hapus Buku">
                          <span class="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </td>
                    </tr>
                    <tr v-if="filteredBooks.length === 0">
                      <td colspan="5" class="p-12 text-center text-on-surface-variant space-y-2">
                        <span class="material-symbols-outlined text-4xl opacity-40">search_off</span>
                        <p class="font-bold">Tidak Ada Data Buku Sesuai Filter</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination Controls -->
              <div class="bg-surface-container-low px-6 py-3 flex items-center justify-between border-t border-outline-variant text-xs">
                <p class="text-on-surface-variant font-medium">
                  Menampilkan <span class="font-bold text-primary">{{ paginatedBooks.length }}</span> dari <span class="font-bold text-primary">{{ filteredBooks.length }}</span> total buku
                </p>
                <div class="flex items-center gap-2">
                  <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1.5 border border-outline-variant rounded-lg font-bold disabled:opacity-40 hover:bg-surface-container-high transition-colors cursor-pointer">
                    Sebelumnya
                  </button>
                  <span class="font-bold text-primary">Halaman {{ currentPage }} dari {{ totalPages || 1 }}</span>
                  <button @click="currentPage++" :disabled="currentPage >= totalPages" class="px-3 py-1.5 border border-outline-variant rounded-lg font-bold disabled:opacity-40 hover:bg-surface-container-high transition-colors cursor-pointer">
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 3: MEMBER MANAGEMENT -->
          <div v-if="activeTab === 'members'" class="space-y-6">
            <div class="flex justify-between items-center">
              <div>
                <h2 class="font-headline-md text-lg sm:text-xl font-extrabold text-primary">Manajemen Anggota Perpustakaan</h2>
                <p class="text-xs text-on-surface-variant">Daftar mahasiswa, dosen, dan staf terdaftar dalam sistem.</p>
              </div>
            </div>

            <!-- Search Bar -->
            <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-xs">
              <div class="relative max-w-md">
                <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">search</span>
                <input 
                  v-model="memberSearchQuery" 
                  type="text" 
                  placeholder="Cari nama, NIM/NIDN, email, prodi..." 
                  class="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-body-md focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xs overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead class="bg-surface-container-low border-b border-outline-variant">
                    <tr>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase">Anggota</th>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase">NIM / NIDN</th>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase">Peran / Role</th>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase">Program Studi</th>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase">Status Bebas Pustaka</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-outline-variant text-xs">
                    <tr v-for="user in filteredMembers" :key="user.id" class="hover:bg-surface-container-low/60 transition-colors">
                      <td class="p-4">
                        <div class="flex items-center gap-3">
                          <div class="w-9 h-9 rounded-full bg-primary-container text-white flex items-center justify-center font-bold shrink-0 overflow-hidden border border-outline-variant">
                            <img v-if="user.avatar_url" :src="user.avatar_url" alt="Avatar" class="w-full h-full object-cover"/>
                            <span v-else class="material-symbols-outlined text-lg">person</span>
                          </div>
                          <div>
                            <p class="font-bold text-primary">{{ user.name }}</p>
                            <p class="text-[11px] text-on-surface-variant">{{ user.email || 'Email tidak diset' }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="p-4 font-mono font-bold text-on-surface">{{ user.nim || user.nidn || '-' }}</td>
                      <td class="p-4">
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase" :class="user.role === 'admin' ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-blue-100 text-blue-900 border border-blue-300'">
                          {{ user.role || 'Mahasiswa' }}
                        </span>
                      </td>
                      <td class="p-4 text-on-surface-variant font-medium">{{ user.prodi || 'STAH DNJ' }}</td>
                      <td class="p-4">
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold" :class="user.bebas_pustaka ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'">
                          {{ user.bebas_pustaka ? 'Bebas Pustaka' : 'Aktif Peminjam' }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="filteredMembers.length === 0">
                      <td colspan="5" class="p-12 text-center text-on-surface-variant font-bold">
                        Tidak ada data anggota yang sesuai penelusuran.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- TAB 4: CIRCULATION & LOANS -->
          <div v-if="activeTab === 'circulation'" class="space-y-6">
            <div class="flex justify-between items-center">
              <div>
                <h2 class="font-headline-md text-lg sm:text-xl font-extrabold text-primary">Sirkulasi &amp; Peminjaman Aktif</h2>
                <p class="text-xs text-on-surface-variant">Pantau seluruh peminjaman yang sedang berlangsung dan tenggat waktunya.</p>
              </div>
            </div>

            <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xs overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead class="bg-surface-container-low border-b border-outline-variant">
                    <tr>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase">Peminjam</th>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase">Judul Pustaka</th>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase">Tanggal Pinjam</th>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase">Tenggat Kembali</th>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase text-right">Aksi Pustakawan</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-outline-variant text-xs">
                    <tr v-for="loan in loansList" :key="loan.id" class="hover:bg-surface-container-low/60 transition-colors">
                      <td class="p-4 font-bold text-primary">
                        {{ loan.user?.name || loan.nama_peminjam || 'Pemustaka STAH' }}
                        <span class="block text-[11px] text-on-surface-variant font-mono font-normal">({{ loan.user?.nim || 'NIM' }})</span>
                      </td>
                      <td class="p-4 font-bold text-on-surface">
                        {{ loan.buku?.judul || loan.judul || 'Buku Perpustakaan' }}
                      </td>
                      <td class="p-4 text-on-surface-variant">{{ formatDate(loan.tanggal_pinjam || loan.created_at) }}</td>
                      <td class="p-4 font-bold text-amber-800">{{ formatDate(loan.tanggal_kembali || loan.due_date) }}</td>
                      <td class="p-4 text-right space-x-2">
                        <button @click="handleAdminReturn(loan.id)" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs">
                          Proses Pengembalian
                        </button>
                      </td>
                    </tr>
                    <tr v-if="loansList.length === 0">
                      <td colspan="5" class="p-12 text-center text-on-surface-variant font-bold">
                        Tidak ada transaksi peminjaman aktif saat ini.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- TAB 5: REPORTS -->
          <div v-if="activeTab === 'reports'" class="space-y-6">
            <div class="flex justify-between items-center">
              <div>
                <h2 class="font-headline-md text-lg sm:text-xl font-extrabold text-primary">Laporan Eksekutif Perpustakaan</h2>
                <p class="text-xs text-on-surface-variant">Ringkasan performa operasional dan pencetakan dokumen resmi.</p>
              </div>
              <button @click="handlePrintReport" class="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md">
                <span class="material-symbols-outlined text-base">print</span>
                <span>Cetak Laporan Admin</span>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-2">
                <p class="text-xs text-on-surface-variant font-bold">Total Buku Katalog</p>
                <p class="text-3xl font-black text-primary">{{ booksList.length }} Judul</p>
                <p class="text-[11px] text-emerald-700 font-semibold">Tersedia secara cetak &amp; e-book digital</p>
              </div>

              <div class="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-2">
                <p class="text-xs text-on-surface-variant font-bold">Total Presensi Hari Ini</p>
                <p class="text-3xl font-black text-emerald-700">{{ todayAttendanceCount }} Pengunjung</p>
                <p class="text-[11px] text-emerald-600 font-semibold">Data realtime dari Kiosk Absensi</p>
              </div>

              <div class="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-2">
                <p class="text-xs text-on-surface-variant font-bold">Status Layanan Sirkulasi</p>
                <p class="text-3xl font-black text-amber-700">{{ loansList.length }} Dipinjam</p>
                <p class="text-[11px] text-amber-800 font-semibold">Aktif dalam penanganan perpustakaan</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <!-- App-Style Mobile Bottom Navigation Bar with Centered Main Admin Action Button (md:hidden) -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 text-slate-300 shadow-[0_-4px_24px_rgba(0,0,0,0.5)]" style="padding-bottom: env(safe-area-inset-bottom);">
        <div class="flex items-center justify-around px-2 h-16 max-w-md mx-auto relative">
          
          <!-- Tab 1: Statistik -->
          <button 
            @click="activeTab = 'statistics'"
            class="flex flex-col items-center justify-center gap-1 w-14 py-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95"
            :class="activeTab === 'statistics' ? 'text-amber-400 font-black' : 'text-slate-400 font-medium'"
          >
            <div class="flex items-center justify-center w-10 h-7 rounded-full transition-all" :class="activeTab === 'statistics' ? 'bg-amber-400/20 text-amber-400 scale-110 shadow-xs' : ''">
              <span class="material-symbols-outlined text-[20px]">monitoring</span>
            </div>
            <span class="text-[10px] leading-none tracking-tight">Statistik</span>
          </button>

          <!-- Tab 2: Buku -->
          <button 
            @click="activeTab = 'books'"
            class="flex flex-col items-center justify-center gap-1 w-14 py-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 relative"
            :class="activeTab === 'books' ? 'text-amber-400 font-black' : 'text-slate-400 font-medium'"
          >
            <div class="flex items-center justify-center w-10 h-7 rounded-full transition-all" :class="activeTab === 'books' ? 'bg-amber-400/20 text-amber-400 scale-110 shadow-xs' : ''">
              <span class="material-symbols-outlined text-[20px]">menu_book</span>
            </div>
            <span class="text-[10px] leading-none tracking-tight">Buku</span>
            <span class="absolute top-0.5 right-1 px-1.5 py-0.2 bg-slate-800 text-slate-200 font-black text-[9px] rounded-full border border-slate-700">
              {{ booksList.length }}
            </span>
          </button>

          <!-- CENTER HIGHLIGHTED MAIN ADMIN MENU BUTTON -->
          <div class="relative -top-4 flex flex-col items-center">
            <button 
              @click="showMobileAdminSheet = true"
              class="w-13 h-13 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-500 text-slate-950 shadow-xl border-4 border-slate-950 flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300 hover:rotate-45"
              title="Buka Menu Aksi Admin"
            >
              <span class="material-symbols-outlined text-2xl font-black">widgets</span>
            </button>
            <span class="text-[9px] font-extrabold text-amber-400 uppercase tracking-tighter mt-0.5">Admin</span>
          </div>

          <!-- Tab 3: Anggota -->
          <button 
            @click="activeTab = 'members'"
            class="flex flex-col items-center justify-center gap-1 w-14 py-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 relative"
            :class="activeTab === 'members' ? 'text-amber-400 font-black' : 'text-slate-400 font-medium'"
          >
            <div class="flex items-center justify-center w-10 h-7 rounded-full transition-all" :class="activeTab === 'members' ? 'bg-amber-400/20 text-amber-400 scale-110 shadow-xs' : ''">
              <span class="material-symbols-outlined text-[20px]">group</span>
            </div>
            <span class="text-[10px] leading-none tracking-tight">Anggota</span>
            <span class="absolute top-0.5 right-1 px-1.5 py-0.2 bg-slate-800 text-slate-200 font-black text-[9px] rounded-full border border-slate-700">
              {{ usersList.length }}
            </span>
          </button>

          <!-- Tab 4: Sirkulasi -->
          <button 
            @click="activeTab = 'circulation'"
            class="flex flex-col items-center justify-center gap-1 w-14 py-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 relative"
            :class="activeTab === 'circulation' ? 'text-amber-400 font-black' : 'text-slate-400 font-medium'"
          >
            <div class="flex items-center justify-center w-10 h-7 rounded-full transition-all" :class="activeTab === 'circulation' ? 'bg-amber-400/20 text-amber-400 scale-110 shadow-xs' : ''">
              <span class="material-symbols-outlined text-[20px]">sync_alt</span>
            </div>
            <span class="text-[10px] leading-none tracking-tight">Sirkulasi</span>
            <span v-if="loansList.length > 0" class="absolute top-0.5 right-1 px-1.5 py-0.2 bg-amber-500 text-slate-950 font-black text-[9px] rounded-full">
              {{ loansList.length }}
            </span>
          </button>

        </div>
      </nav>
    </div>

    <!-- Modal Form: Tambah / Edit Buku -->
    <div v-if="showBookModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-outline-variant text-slate-800 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-5 pb-3 border-b border-outline-variant/60">
          <h3 class="font-extrabold text-lg text-primary">{{ isEditing ? 'Edit Data Buku' : 'Tambah Buku Baru' }}</h3>
          <button @click="showBookModal = false" class="text-on-surface-variant hover:text-primary cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form @submit.prevent="saveBook" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-primary mb-1">Judul Buku *</label>
            <input v-model="bookForm.judul" type="text" required class="w-full px-3.5 py-2.5 bg-slate-50 border border-outline-variant rounded-xl text-primary font-medium outline-none focus:border-secondary"/>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-primary mb-1">Penulis</label>
              <input v-model="bookForm.penulis" type="text" class="w-full px-3.5 py-2 bg-slate-50 border border-outline-variant rounded-xl text-primary font-medium outline-none focus:border-secondary"/>
            </div>
            <div>
              <label class="block font-bold text-primary mb-1">Penerbit</label>
              <input v-model="bookForm.penerbit" type="text" class="w-full px-3.5 py-2 bg-slate-50 border border-outline-variant rounded-xl text-primary font-medium outline-none focus:border-secondary"/>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-primary mb-1">ISBN</label>
              <input v-model="bookForm.isbn" type="text" class="w-full px-3.5 py-2 bg-slate-50 border border-outline-variant rounded-xl text-primary font-medium outline-none focus:border-secondary"/>
            </div>
            <div>
              <label class="block font-bold text-primary mb-1">Jumlah Stok</label>
              <input v-model.number="bookForm.stok" type="number" min="0" class="w-full px-3.5 py-2 bg-slate-50 border border-outline-variant rounded-xl text-primary font-medium outline-none focus:border-secondary"/>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-primary mb-1">Kategori Buku</label>
              <select v-model="bookForm.kategori_id" class="w-full px-3.5 py-2 bg-slate-50 border border-outline-variant rounded-xl text-primary font-bold outline-none focus:border-secondary">
                <option :value="null">-- Pilih Kategori --</option>
                <option v-for="cat in categoriesList" :key="cat.id" :value="cat.id">{{ cat.nama_kategori }}</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-primary mb-1">Tahun Terbit</label>
              <input v-model="bookForm.tahun_terbit" type="text" placeholder="2024" class="w-full px-3.5 py-2 bg-slate-50 border border-outline-variant rounded-xl text-primary font-medium outline-none focus:border-secondary"/>
            </div>
          </div>

          <div>
            <label class="block font-bold text-primary mb-1">URL Cover Image (Gambar Sampul)</label>
            <input v-model="bookForm.cover_image" type="url" placeholder="https://..." class="w-full px-3.5 py-2 bg-slate-50 border border-outline-variant rounded-xl text-primary font-medium outline-none focus:border-secondary"/>
          </div>

          <div>
            <label class="block font-bold text-primary mb-1">Deskripsi Ringkas</label>
            <textarea v-model="bookForm.deskripsi" rows="3" class="w-full px-3.5 py-2 bg-slate-50 border border-outline-variant rounded-xl text-primary font-medium outline-none focus:border-secondary resize-none"></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-outline-variant/60">
            <button type="button" @click="showBookModal = false" class="px-4 py-2 border border-outline-variant rounded-xl text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors cursor-pointer">
              Batal
            </button>
            <button type="submit" :disabled="savingBook" class="px-5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl font-extrabold transition-all cursor-pointer disabled:opacity-50 shadow-md">
              {{ savingBook ? 'Menyimpan...' : 'Simpan Buku' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
});

const { getBooks, createBook, updateBook, deleteBook, getLoans, getUsers, getAttendanceToday, getCategories, getRecentActivities, getReservations, returnLoan, getProfile, logout } = usePustakaApi();
const { saveCatalogCache, getCatalogCache } = useIndexedDB();
const router = useRouter();

const activeTab = ref('statistics');
const searchQuery = ref('');
const memberSearchQuery = ref('');
const selectedCategoryFilter = ref('all');
const selectedStockFilter = ref('all');
const showMobileAdminSheet = ref(false);
const userProfile = ref<any>(null);

const booksList = ref<any[]>([]);
const usersList = ref<any[]>([]);
const loansList = ref<any[]>([]);
const categoriesList = ref<any[]>([]);
const recentActivities = ref<any[]>([]);
const reservationsCount = ref(0);
const todayAttendanceCount = ref(0);

const refreshing = ref(false);
const lastUpdatedTime = ref('');
const toastMessage = ref('');

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref<number | string>('all');

// Modal state
const showBookModal = ref(false);
const isEditing = ref(false);
const savingBook = ref(false);
const editingBookId = ref<any>(null);

const bookForm = reactive({
  judul: '',
  penulis: '',
  penerbit: '',
  tahun_terbit: '',
  isbn: '',
  stok: 1,
  kategori_id: null as any,
  cover_image: '',
  deskripsi: ''
});

let pollTimer: any = null;

const triggerToast = (msg: string) => {
  toastMessage.value = msg;
  setTimeout(() => {
    toastMessage.value = '';
  }, 4000);
};

const syncingD1 = ref(false);
const handleSyncD1 = async () => {
  syncingD1.value = true;
  triggerToast('Memulai sinkronisasi data ke Cloudflare D1 Database...');
  try {
    const res: any = await $fetch('/api/backup/sync', { method: 'POST' });
    if (res?.success) {
      triggerToast('✅ Sinkronisasi Cloudflare D1 Berhasil!');
    } else {
      triggerToast('ℹ️ ' + (res?.message || 'Proses sinkronisasi D1 selesai.'));
    }
  } catch (err: any) {
    triggerToast('❌ Error D1: ' + (err?.message || 'Gagal terhubung ke Cloudflare D1.'));
  } finally {
    syncingD1.value = false;
  }
};

const availableBooksCount = computed(() => {
  return booksList.value.filter(b => (b.stok ?? 1) > 0).length;
});

const getCategoryName = (book: any) => {
  if (typeof book.kategori === 'object' && book.kategori?.nama_kategori) {
    return book.kategori.nama_kategori;
  }
  if (typeof book.category === 'object' && book.category?.nama_kategori) {
    return book.category.nama_kategori;
  }
  const match = categoriesList.value.find(c => String(c.id) === String(book.kategori_id));
  return match?.nama_kategori || 'Umum';
};

const getCategoryBookCount = (catId: number) => {
  return booksList.value.filter(b => {
    const bCatId = b.kategori?.id || b.category?.id || b.kategori_id;
    return String(bCatId) === String(catId);
  }).length;
};

const getCategoryPercentage = (catId: number) => {
  if (!booksList.value.length) return 0;
  const count = getCategoryBookCount(catId);
  return Math.round((count / booksList.value.length) * 100);
};

const filteredBooks = computed(() => {
  let list = booksList.value;

  if (selectedCategoryFilter.value !== 'all') {
    list = list.filter(b => {
      const bCatId = b.kategori?.id || b.category?.id || b.kategori_id;
      return String(bCatId) === String(selectedCategoryFilter.value);
    });
  }

  if (selectedStockFilter.value === 'available') {
    list = list.filter(b => (b.stok ?? 1) > 0);
  } else if (selectedStockFilter.value === 'out') {
    list = list.filter(b => (b.stok ?? 0) <= 0);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(b => 
      b.judul.toLowerCase().includes(q) ||
      (b.penulis && b.penulis.toLowerCase().includes(q)) ||
      (b.isbn && b.isbn.toLowerCase().includes(q))
    );
  }

  return list;
});

const effectiveItemsPerPage = computed(() => {
  if (itemsPerPage.value === 'all') return Math.max(filteredBooks.value.length, 1);
  return Number(itemsPerPage.value) || 10;
});

const totalPages = computed(() => {
  return Math.ceil(filteredBooks.value.length / effectiveItemsPerPage.value);
});

const paginatedBooks = computed(() => {
  if (itemsPerPage.value === 'all') return filteredBooks.value;
  const start = (currentPage.value - 1) * effectiveItemsPerPage.value;
  return filteredBooks.value.slice(start, start + effectiveItemsPerPage.value);
});

const filteredMembers = computed(() => {
  if (!memberSearchQuery.value.trim()) return usersList.value;
  const q = memberSearchQuery.value.toLowerCase();
  return usersList.value.filter(u => 
    (u.name && u.name.toLowerCase().includes(q)) ||
    (u.email && u.email.toLowerCase().includes(q)) ||
    (u.nim && u.nim.toLowerCase().includes(q)) ||
    (u.prodi && u.prodi.toLowerCase().includes(q))
  );
});

const openAddBookModal = () => {
  isEditing.value = false;
  editingBookId.value = null;
  bookForm.judul = '';
  bookForm.penulis = '';
  bookForm.penerbit = '';
  bookForm.tahun_terbit = '';
  bookForm.isbn = '';
  bookForm.stok = 1;
  bookForm.kategori_id = categoriesList.value[0]?.id || null;
  bookForm.cover_image = '';
  bookForm.deskripsi = '';
  showBookModal.value = true;
};

const openEditBookModal = (book: any) => {
  isEditing.value = true;
  editingBookId.value = book.id;
  bookForm.judul = book.judul || '';
  bookForm.penulis = book.penulis || '';
  bookForm.penerbit = book.penerbit || '';
  bookForm.tahun_terbit = book.tahun_terbit || '';
  bookForm.isbn = book.isbn || '';
  bookForm.stok = book.stok ?? 1;
  bookForm.kategori_id = book.kategori?.id || book.category?.id || book.kategori_id || null;
  bookForm.cover_image = book.cover_image || book.cover_image_url || '';
  bookForm.deskripsi = book.deskripsi || '';
  showBookModal.value = true;
};

const saveBook = async () => {
  if (!bookForm.judul.trim()) return;
  savingBook.value = true;
  try {
    if (isEditing.value && editingBookId.value) {
      await updateBook(editingBookId.value, { ...bookForm });
      triggerToast('Buku berhasil diperbarui!');
    } else {
      await createBook({ ...bookForm });
      triggerToast('Buku baru berhasil ditambahkan!');
    }
    showBookModal.value = false;
    await loadAdminData(false);
  } catch (e) {
    console.error('Error saving book:', e);
    triggerToast('Gagal menyimpan data buku.');
  } finally {
    savingBook.value = false;
  }
};

const confirmDeleteBook = async (book: any) => {
  if (confirm(`Apakah Anda yakin ingin menghapus buku "${book.judul}"?`)) {
    try {
      await deleteBook(book.id);
      triggerToast(`Buku "${book.judul}" berhasil dihapus.`);
      await loadAdminData(false);
    } catch (e) {
      console.error('Error deleting book:', e);
    }
  }
};

const handleAdminReturn = async (loanId: number | string) => {
  if (confirm('Proses pengembalian fisik buku ini ke rak perpustakaan?')) {
    const res = await returnLoan(loanId);
    triggerToast(res.message || 'Pengembalian buku berhasil diproses!');
    await loadAdminData(false);
  }
};

const formatDate = (dateStr: any) => {
  if (!dateStr) return 'Hari Ini';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
};

const handlePrintReport = () => {
  window.print();
};

const handleLogout = async () => {
  await logout();
  router.push('/login');
};

const loadAdminData = async (manual = false) => {
  refreshing.value = true;
  
  // STEP 1: Restore from IndexedDB cache for instant display
  if (!manual && booksList.value.length === 0) {
    try {
      const [cachedProfile, cachedBooks, cachedUsers, cachedLoans, cachedCat, cachedAttCount] = await Promise.all([
        getCatalogCache('admin_profile'),
        getCatalogCache('admin_books'),
        getCatalogCache('admin_users'),
        getCatalogCache('admin_loans_list'),
        getCatalogCache('admin_categories'),
        getCatalogCache('admin_attendance_count')
      ]);
      if (cachedProfile) userProfile.value = cachedProfile;
      if (cachedBooks && cachedBooks.length > 0) booksList.value = cachedBooks;
      if (cachedUsers && cachedUsers.length > 0) usersList.value = cachedUsers;
      if (cachedLoans && cachedLoans.length > 0) loansList.value = cachedLoans;
      if (cachedCat && cachedCat.length > 0) categoriesList.value = cachedCat;
      if (typeof cachedAttCount === 'number') todayAttendanceCount.value = cachedAttCount;
    } catch (e) {}
  }

  // STEP 2: Fetch fresh data from Realtime API
  try {
    const [profileRes, booksRes, loansRes, usersRes, attRes, catRes, actRes, resRes] = await Promise.all([
      getProfile().catch(() => null),
      getBooks({ per_page: 1000, limit: 1000, all: 1 }).catch(() => null),
      getLoans().catch(() => null),
      getUsers().catch(() => null),
      getAttendanceToday().catch(() => null),
      getCategories().catch(() => null),
      getRecentActivities().catch(() => null),
      getReservations(false).catch(() => null)
    ]);

    if (profileRes?.data || profileRes?.user) {
      userProfile.value = profileRes.data || profileRes.user;
      saveCatalogCache('admin_profile', userProfile.value);
    }

    if (booksRes?.success && booksRes.data) {
      booksList.value = booksRes.data;
      saveCatalogCache('admin_books', booksRes.data);
    }

    if (loansRes?.success && loansRes.data) {
      loansList.value = loansRes.data;
      saveCatalogCache('admin_loans_list', loansRes.data);
    }

    if (usersRes?.success && usersRes.data) {
      usersList.value = usersRes.data;
      saveCatalogCache('admin_users', usersRes.data);
    }

    if (catRes?.success && catRes.data) {
      categoriesList.value = catRes.data;
      saveCatalogCache('admin_categories', catRes.data);
    }

    if (attRes?.success && attRes.data) {
      todayAttendanceCount.value = attRes.data.total_hadir || (attRes.data.daftar_hadir || []).length;
      saveCatalogCache('admin_attendance_count', todayAttendanceCount.value);
    }

    if (actRes?.success && actRes.data) {
      recentActivities.value = actRes.data;
    }

    if (resRes?.data && Array.isArray(resRes.data)) {
      reservationsCount.value = resRes.data.filter((r: any) => r.status === 'pending' || r.status === 'proses_pengambilan').length;
    }

    lastUpdatedTime.value = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (manual) triggerToast('Data admin berhasil diperbarui dari API!');
  } catch (e) {
    console.error('Admin data load error:', e);
  } finally {
    refreshing.value = false;
  }
};

onMounted(() => {
  loadAdminData();

  // Setup auto-polling every 15 seconds for realtime API synchronization
  pollTimer = setInterval(() => {
    loadAdminData(false);
  }, 15000);
});

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer);
});

useHead({
  title: 'Admin Dashboard - Perpustakaan STAH Dharma Nusantara',
  meta: [
    { name: 'description', content: 'Dashboard administrasi perpustakaan STAH Dharma Nusantara Jakarta.' }
  ]
});
</script>

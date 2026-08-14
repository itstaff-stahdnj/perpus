<template>
  <div class="bg-surface text-on-surface font-body-md min-h-screen md:h-screen md:overflow-hidden flex flex-col md:flex-row relative">
    
    <!-- Action Sheet Drawer / Backdrop (Desktop & Mobile) -->
    <div v-if="showMobileMenuSheet" class="fixed inset-0 bg-black/70 backdrop-blur-xs z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" @click.self="showMobileMenuSheet = false">
      <div class="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-300 space-y-5 text-slate-800">
        <div class="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-1 sm:hidden"></div>
        <div class="flex justify-between items-center pb-3 border-b border-slate-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold overflow-hidden border border-primary/20 shrink-0">
              <img v-if="userProfile?.avatar_url" :src="userProfile.avatar_url" alt="Avatar" class="w-full h-full object-cover"/>
              <span v-else class="material-symbols-outlined text-xl">person</span>
            </div>
            <div>
              <h3 class="font-bold text-sm text-primary leading-tight">{{ userProfile?.name || 'Pemustaka' }}</h3>
              <p class="text-[11px] text-slate-500 font-mono">NIM/NIDN: {{ userProfile?.nim || userProfile?.nidn || '-' }}</p>
            </div>
          </div>
          <button @click="showMobileMenuSheet = false" class="p-1 text-slate-400 hover:text-slate-700">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Full Quick Actions Grid -->
        <div class="grid grid-cols-2 gap-2.5 text-xs">
          <button @click="showQrModal = true; showMobileMenuSheet = false" class="col-span-2 p-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-2xl flex items-center justify-between font-black shadow-md">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-slate-950 text-2xl">qr_code_2</span>
              <div class="text-left">
                <p class="font-extrabold text-xs">QR Presensi Digital Kiosk</p>
                <p class="text-[10px] text-slate-900/80 font-normal">Tunjukkan QR ke scanner perpustakaan</p>
              </div>
            </div>
            <span class="material-symbols-outlined text-slate-950 text-base">arrow_forward</span>
          </button>

          <button @click="loadDashboardData(true); showMobileMenuSheet = false" class="col-span-2 p-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-2xl flex items-center justify-between font-bold">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-primary text-xl" :class="refreshing ? 'animate-spin' : ''">sync</span>
              <span>Sinkronkan Data Realtime</span>
            </div>
            <span class="text-[10px] bg-primary/20 px-2 py-0.5 rounded-full font-bold">Refresh</span>
          </button>

          <button @click="activeSection = 'loans'; showMobileMenuSheet = false" class="p-3 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200/80 rounded-2xl flex items-center gap-2.5 font-bold">
            <span class="material-symbols-outlined text-primary text-xl">pending_actions</span>
            <span>Pinjaman Aktif</span>
          </button>

          <button @click="activeSection = 'reservations'; showMobileMenuSheet = false" class="p-3 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200/80 rounded-2xl flex items-center gap-2.5 font-bold">
            <span class="material-symbols-outlined text-primary text-xl">collections_bookmark</span>
            <span>Reservasi Saya</span>
          </button>

          <button @click="activeSection = 'history'; showMobileMenuSheet = false" class="p-3 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200/80 rounded-2xl flex items-center gap-2.5 font-bold">
            <span class="material-symbols-outlined text-primary text-xl">history_edu</span>
            <span>Riwayat Transaksi</span>
          </button>

          <NuxtLink to="/buku" class="p-3 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200/80 rounded-2xl flex items-center gap-2.5 font-bold">
            <span class="material-symbols-outlined text-primary text-xl">menu_book</span>
            <span>Katalog Pustaka</span>
          </NuxtLink>

          <NuxtLink to="/tata-tertib" class="p-3 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200/80 rounded-2xl flex items-center gap-2.5 font-bold">
            <span class="material-symbols-outlined text-slate-700 text-xl">gavel</span>
            <span>Tata Tertib</span>
          </NuxtLink>

          <NuxtLink to="/bantuan" class="p-3 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200/80 rounded-2xl flex items-center gap-2.5 font-bold">
            <span class="material-symbols-outlined text-amber-600 text-xl">support_agent</span>
            <span>Bantuan Pustaka</span>
          </NuxtLink>
        </div>

        <div class="pt-2 border-t border-slate-200 flex items-center justify-between">
          <NuxtLink to="/" @click="showMobileMenuSheet = false" class="text-xs text-slate-600 hover:text-primary font-bold flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">home</span>
            <span>Beranda Utama</span>
          </NuxtLink>
          
          <button @click="handleLogout" class="text-xs text-rose-700 hover:text-rose-900 font-bold flex items-center gap-1 cursor-pointer">
            <span class="material-symbols-outlined text-sm">logout</span>
            <span>Keluar Akun</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal QR Code Presensi Kiosk -->
    <div v-if="showQrModal" class="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4" @click.self="showQrModal = false">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-4 border border-outline-variant text-slate-800">
        <div class="flex justify-between items-center pb-2 border-b border-slate-200">
          <h3 class="font-extrabold text-base text-primary">Kartu Presensi Digital</h3>
          <button @click="showQrModal = false" class="text-slate-400 hover:text-slate-700">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div class="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div class="w-48 h-48 mx-auto bg-white p-3 rounded-xl shadow-inner border border-slate-200 flex items-center justify-center">
            <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(userProfile?.qr_token || userProfile?.nim || 'STAH-MEMBER')}`" alt="QR Code" class="w-full h-full object-contain" />
          </div>
          <p class="font-mono text-xs font-bold text-slate-900">{{ userProfile?.nim || userProfile?.nidn || 'ID PEMUSTAKA' }}</p>
          <p class="font-bold text-sm text-primary">{{ userProfile?.name }}</p>
        </div>

        <p class="text-[11px] text-slate-500 leading-relaxed">
          Tunjukkan QR Code ini ke kamera atau pemindai di <strong>Kiosk Absensi Kedatangan Perpustakaan STAH DNJ</strong>.
        </p>

        <button @click="showQrModal = false" class="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs">
          Tutup Kartu Presensi
        </button>
      </div>
    </div>

    <!-- Desktop SideNavBar (Hidden on Mobile) -->
    <aside class="hidden md:flex flex-col h-screen w-72 bg-surface border-r border-outline-variant shadow-md py-6 shrink-0">
      <!-- Library Branding -->
      <div class="px-6 mb-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-black shadow-sm shrink-0">
            <span class="material-symbols-outlined text-2xl">account_balance</span>
          </div>
          <div>
            <h2 class="font-headline-md text-xs sm:text-sm font-extrabold text-primary leading-tight">STAH Dharma Nusantara</h2>
            <p class="font-caption text-[11px] text-on-surface-variant">Academic Portal &amp; Library</p>
          </div>
        </div>
      </div>

      <!-- Member Quick Profile Card -->
      <div class="px-4 mb-6">
        <div class="bg-gradient-to-br from-[#0A2540] to-[#1B4B79] text-white rounded-2xl p-4 shadow-sm border border-slate-700/50 space-y-3 relative overflow-hidden">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center font-bold overflow-hidden shrink-0 border border-white/30">
              <img v-if="userProfile?.avatar_url" :src="userProfile.avatar_url" alt="Avatar" class="w-full h-full object-cover"/>
              <span v-else class="material-symbols-outlined text-xl">person</span>
            </div>
            <div class="min-w-0">
              <p class="font-bold text-xs truncate text-white">{{ userProfile?.name || 'Pemustaka' }}</p>
              <p class="text-[10px] text-slate-300 font-mono">NIM/NIDN: {{ userProfile?.nim || userProfile?.nidn || '-' }}</p>
            </div>
          </div>
          <div class="flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
            <span class="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold border border-emerald-400/30">
              {{ userProfile?.status_keanggotaan || 'Anggota Aktif' }}
            </span>
            <button @click="showQrModal = true" class="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer">
              <span class="material-symbols-outlined text-xs">qr_code_2</span>
              <span>QR Presensi</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar Navigation Menu -->
      <nav class="flex-1 px-3 space-y-1 overflow-y-auto">
        <button 
          @click="activeSection = 'loans'" 
          class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all text-xs font-bold cursor-pointer"
          :class="activeSection === 'loans' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-high'"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-lg">pending_actions</span>
            <span>Pinjaman Aktif</span>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-black" :class="activeSection === 'loans' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'">
            {{ activeLoans.length }}
          </span>
        </button>

        <button 
          @click="activeSection = 'reservations'" 
          class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all text-xs font-bold cursor-pointer"
          :class="activeSection === 'reservations' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-high'"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-lg">collections_bookmark</span>
            <span>Reservasi Saya</span>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-black" :class="activeSection === 'reservations' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-900'">
            {{ myReservations.length }}
          </span>
        </button>

        <button 
          @click="activeSection = 'history'" 
          class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all text-xs font-bold cursor-pointer"
          :class="activeSection === 'history' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-high'"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-lg">history_edu</span>
            <span>Riwayat Pengembalian</span>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-black" :class="activeSection === 'history' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'">
            {{ historyList.length }}
          </span>
        </button>

        <button 
          @click="activeSection = 'wishlist'" 
          class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all text-xs font-bold cursor-pointer"
          :class="activeSection === 'wishlist' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-high'"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-lg">bookmark</span>
            <span>Wishlist Saya</span>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-black" :class="activeSection === 'wishlist' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'">
            {{ wishlistList.length }}
          </span>
        </button>

        <NuxtLink 
          to="/buku" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors text-xs font-semibold"
        >
          <span class="material-symbols-outlined text-lg">library_books</span>
          <span>Katalog Pustaka</span>
        </NuxtLink>

        <NuxtLink 
          to="/tata-tertib" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors text-xs font-semibold"
        >
          <span class="material-symbols-outlined text-lg">gavel</span>
          <span>Tata Tertib</span>
        </NuxtLink>
      </nav>

      <div class="px-4 mb-4">
        <NuxtLink to="/bantuan" class="w-full py-2.5 px-4 bg-secondary text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2">
          <span class="material-symbols-outlined text-base">support_agent</span>
          <span>Bantuan Pustakawan</span>
        </NuxtLink>
      </div>

      <div class="px-3 border-t border-outline-variant pt-3 space-y-1">
        <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-700 hover:bg-rose-50 transition-colors text-xs font-bold cursor-pointer">
          <span class="material-symbols-outlined text-base">logout</span>
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-h-screen md:h-screen md:overflow-hidden relative">
      <!-- Clean Native App-Style Header Bar (NO BURGER MENU) -->
      <header class="flex justify-between items-center px-4 lg:px-8 sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs w-full h-14 sm:h-16 border-b border-outline-variant/60 shrink-0">
        <div class="flex items-center gap-2.5 min-w-0">
          <NuxtLink to="/" class="flex items-center gap-1.5 text-primary hover:text-secondary font-black text-xs shrink-0 p-1.5 rounded-xl hover:bg-slate-100 transition-colors" title="Kembali ke Beranda">
            <span class="material-symbols-outlined text-xl">arrow_back</span>
            <span class="hidden sm:inline">Beranda</span>
          </NuxtLink>

          <!-- App Title / Brand Pill -->
          <div class="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full shrink-0">
            <span class="material-symbols-outlined text-primary text-base">account_balance</span>
            <h1 class="text-xs font-black text-primary truncate max-w-[130px] sm:max-w-none">STAH DNJ Library</h1>
          </div>

          <!-- Realtime Sync Pill -->
          <div class="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300/80 rounded-full text-[10px] font-bold shrink-0">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Realtime Sync</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- User Avatar -->
          <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold overflow-hidden border border-primary/30 shrink-0">
            <img v-if="userProfile?.avatar_url" :src="userProfile.avatar_url" alt="Avatar" class="w-full h-full object-cover"/>
            <span v-else class="text-xs">{{ (userProfile?.name || 'P').charAt(0) }}</span>
          </div>
        </div>
      </header>

      <!-- Toast Alert Notification -->
      <div v-if="toastMessage" class="fixed top-16 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
        <span class="material-symbols-outlined text-amber-400">check_circle</span>
        <span class="text-xs font-semibold">{{ toastMessage }}</span>
      </div>

      <!-- Scrollable Dashboard Content Area -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-surface pb-28 md:pb-8">
        <div class="max-w-[1280px] mx-auto space-y-8">
          
          <!-- Welcome Banner Section -->
          <section class="bg-gradient-to-r from-primary-container/10 via-surface-container-low to-surface border border-outline-variant/60 rounded-3xl p-5 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
            <div class="space-y-1">
              <span class="px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-primary/10 text-primary uppercase tracking-wider">
                Portal Pemustaka STAH DNJ
              </span>
              <h1 class="font-headline-lg text-lg sm:text-2xl font-black text-primary">
                Selamat Datang, {{ userProfile?.name || 'Pemustaka' }}!
              </h1>
              <p class="font-body-lg text-xs text-on-surface-variant">Pantau pinjaman aktif, reservasi, riwayat baca, dan perpanjang buku secara realtime.</p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button @click="loadDashboardData(true)" :disabled="refreshing" class="px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95">
                <span class="material-symbols-outlined text-lg" :class="refreshing ? 'animate-spin' : ''">sync</span>
                <span>Sinkronkan Data</span>
              </button>
              <button @click="showQrModal = true" class="px-4 py-2.5 bg-primary hover:bg-primary-container text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95">
                <span class="material-symbols-outlined text-lg">badge</span>
                <span>Kartu Digital</span>
              </button>
            </div>
          </section>

          <!-- Stat Cards Grid -->
          <section class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div 
              @click="activeSection = 'loans'"
              class="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-28 sm:h-32 cursor-pointer"
              :class="activeSection === 'loans' ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant'"
            >
              <div class="flex justify-between items-start">
                <span class="font-label-md text-[10px] sm:text-xs text-on-surface-variant uppercase font-bold tracking-wider">Pinjaman Aktif</span>
                <span class="material-symbols-outlined text-primary text-xl sm:text-2xl">pending_actions</span>
              </div>
              <div class="font-display-lg text-2xl sm:text-3xl font-black text-primary">{{ activeLoans.length }}</div>
            </div>

            <div 
              @click="activeSection = 'reservations'"
              class="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-28 sm:h-32 cursor-pointer"
              :class="activeSection === 'reservations' ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant'"
            >
              <div class="flex justify-between items-start">
                <span class="font-label-md text-[10px] sm:text-xs text-on-surface-variant uppercase font-bold tracking-wider">Reservasi Saya</span>
                <span class="material-symbols-outlined text-blue-600 text-xl sm:text-2xl">collections_bookmark</span>
              </div>
              <div class="font-display-lg text-2xl sm:text-3xl font-black text-blue-900">{{ myReservations.length }}</div>
            </div>

            <div 
              @click="activeSection = 'history'"
              class="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-28 sm:h-32 cursor-pointer"
              :class="activeSection === 'history' ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant'"
            >
              <div class="flex justify-between items-start">
                <span class="font-label-md text-[10px] sm:text-xs text-on-surface-variant uppercase font-bold tracking-wider">Riwayat Baca</span>
                <span class="material-symbols-outlined text-emerald-600 text-xl sm:text-2xl">history_edu</span>
              </div>
              <div class="font-display-lg text-2xl sm:text-3xl font-black text-emerald-800">{{ historyList.length }}</div>
            </div>

            <div 
              @click="activeSection = 'wishlist'"
              class="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-28 sm:h-32 cursor-pointer"
              :class="activeSection === 'wishlist' ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant'"
            >
              <div class="flex justify-between items-start">
                <span class="font-label-md text-[10px] sm:text-xs text-on-surface-variant uppercase font-bold tracking-wider">Wishlist Buku</span>
                <span class="material-symbols-outlined text-rose-600 text-xl sm:text-2xl">bookmark</span>
              </div>
              <div class="font-display-lg text-2xl sm:text-3xl font-black text-rose-700">{{ wishlistList.length }}</div>
            </div>
          </section>

          <!-- Main Layout Grid: Active Content View & Right Sidebar -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            <!-- Left Column: Dynamic Tab Sections -->
            <section class="lg:col-span-2 space-y-6">
              
              <!-- SECTION 1: ACTIVE LOANS TAB -->
              <div v-if="activeSection === 'loans'" class="bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant overflow-hidden">
                <div class="p-4 sm:p-5 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
                  <div>
                    <h3 class="font-headline-md text-sm sm:text-base font-extrabold text-primary">Buku Dalam Peminjaman (Active Loans)</h3>
                    <p class="text-[11px] text-on-surface-variant">Anda dapat melakukan perpanjangan tenggat waktu 1 kali via portal ini.</p>
                  </div>
                  <NuxtLink to="/buku" class="font-bold text-xs text-primary hover:text-secondary transition-colors">
                    + Cari Buku
                  </NuxtLink>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="border-b border-outline-variant bg-surface-container-low text-xs">
                        <th class="py-3 px-4 sm:px-5 font-bold text-on-surface-variant uppercase">Judul Pustaka</th>
                        <th class="py-3 px-4 sm:px-5 font-bold text-on-surface-variant uppercase">Tenggat Waktu</th>
                        <th class="py-3 px-4 sm:px-5 font-bold text-on-surface-variant uppercase">Status Urgensi</th>
                        <th class="py-3 px-4 sm:px-5 font-bold text-on-surface-variant uppercase text-right">Aksi Realtime</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-outline-variant text-xs">
                      <tr v-for="loan in activeLoans" :key="loan.id" class="hover:bg-surface-container-low/60 transition-colors">
                        <td class="py-4 px-4 sm:px-5">
                          <p class="font-bold text-primary">{{ loan.buku?.judul || loan.judul || 'Buku Perpustakaan' }}</p>
                          <p class="text-[11px] text-on-surface-variant mt-0.5">Penulis: {{ loan.buku?.penulis || 'STAH DNJ' }}</p>
                        </td>
                        <td class="py-4 px-4 sm:px-5 font-bold text-on-surface">{{ formatDate(loan.tanggal_kembali || loan.due_date) }}</td>
                        <td class="py-4 px-4 sm:px-5">
                          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold" :class="getLoanUrgencyBadge(loan).class">
                            {{ getLoanUrgencyBadge(loan).label }}
                          </span>
                        </td>
                        <td class="py-4 px-4 sm:px-5 text-right">
                          <button 
                            @click="handleExtendLoan(loan)" 
                            :disabled="extendingId === loan.id"
                            class="px-3.5 py-1.5 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                          >
                            {{ extendingId === loan.id ? 'Memproses...' : 'Perpanjang 7 Hari' }}
                          </button>
                        </td>
                      </tr>
                      <tr v-if="activeLoans.length === 0">
                        <td colspan="4" class="py-12 px-6 text-center text-on-surface-variant">
                          <span class="material-symbols-outlined text-4xl opacity-40 mb-2 block">menu_book</span>
                          <p class="font-bold">Belum Ada Pinjaman Aktif Saat Ini</p>
                          <p class="text-[11px] opacity-80 mt-0.5">Jelajahi katalog perpustakaan untuk meminjam buku fisik atau e-book digital.</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- SECTION 2: MY RESERVATIONS TAB -->
              <div v-if="activeSection === 'reservations'" class="bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant overflow-hidden">
                <div class="p-4 sm:p-5 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
                  <div>
                    <h3 class="font-headline-md text-sm sm:text-base font-extrabold text-primary">Antrean Reservasi Saya</h3>
                    <p class="text-[11px] text-on-surface-variant">Pantau status penyiapan buku fisik oleh petugas counter.</p>
                  </div>
                  <NuxtLink to="/buku" class="font-bold text-xs text-primary hover:text-secondary">Reservasi Baru</NuxtLink>
                </div>

                <div class="p-4 sm:p-5 space-y-4">
                  <div v-for="res in myReservations" :key="res.id" class="p-4 rounded-xl border border-outline-variant bg-surface-container-low/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                    <div>
                      <span class="font-mono text-[10px] text-on-surface-variant font-bold">ID Reservasi: #{{ res.id }}</span>
                      <h4 class="font-bold text-primary text-sm mt-0.5">{{ res.buku?.judul || res.book?.judul || 'Buku Perpustakaan' }}</h4>
                      <p class="text-on-surface-variant text-[11px]">Penulis: {{ res.buku?.penulis || res.book?.penulis || 'STAH DNJ' }}</p>
                    </div>

                    <div class="flex items-center gap-3">
                      <span class="px-3 py-1 rounded-full text-xs font-extrabold" :class="getReservationBadge(res.status).class">
                        {{ getReservationBadge(res.status).label }}
                      </span>
                    </div>
                  </div>

                  <div v-if="myReservations.length === 0" class="py-12 text-center text-on-surface-variant space-y-2">
                    <span class="material-symbols-outlined text-4xl opacity-40">collections_bookmark</span>
                    <p class="font-bold">Belum Ada Antrean Reservasi</p>
                    <p class="text-[11px]">Reservasi buku lewat katalog agar pustakawan menyiapkan buku di meja layanan.</p>
                  </div>
                </div>
              </div>

              <!-- SECTION 3: READING HISTORY TAB -->
              <div v-if="activeSection === 'history'" class="bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant overflow-hidden">
                <div class="p-4 sm:p-5 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
                  <div>
                    <h3 class="font-headline-md text-sm sm:text-base font-extrabold text-primary">Riwayat Pengembalian Buku</h3>
                    <p class="text-[11px] text-on-surface-variant">Daftar buku yang pernah Anda pinjam dan telah dikembalikan.</p>
                  </div>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr class="border-b border-outline-variant bg-surface-container-low">
                        <th class="py-3 px-4 sm:px-5 font-bold text-on-surface-variant uppercase">Judul Pustaka</th>
                        <th class="py-3 px-4 sm:px-5 font-bold text-on-surface-variant uppercase">Tanggal Pengembalian</th>
                        <th class="py-3 px-4 sm:px-5 font-bold text-on-surface-variant uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-outline-variant">
                      <tr v-for="item in historyList" :key="item.id" class="hover:bg-surface-container-low/60 transition-colors">
                        <td class="py-4 px-4 sm:px-5">
                          <p class="font-bold text-primary">{{ item.buku?.judul || item.judul || 'Buku Perpustakaan' }}</p>
                          <p class="text-[11px] text-on-surface-variant mt-0.5">Penulis: {{ item.buku?.penulis || 'STAH DNJ' }}</p>
                        </td>
                        <td class="py-4 px-4 sm:px-5 font-medium text-on-surface">{{ formatDate(item.tanggal_dikembalikan || item.updated_at) }}</td>
                        <td class="py-4 px-4 sm:px-5">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            Selesai Dikembalikan
                          </span>
                        </td>
                      </tr>
                      <tr v-if="historyList.length === 0">
                        <td colspan="3" class="py-12 text-center text-on-surface-variant font-bold">
                          Belum ada riwayat pengembalian buku.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- SECTION 4: WISHLIST TAB -->
              <div v-if="activeSection === 'wishlist'" class="bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant overflow-hidden">
                <div class="p-4 sm:p-5 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
                  <div>
                    <h3 class="font-headline-md text-sm sm:text-base font-extrabold text-primary">Wishlist &amp; Buku Favorit</h3>
                    <p class="text-[11px] text-on-surface-variant">Buku yang Anda simpan untuk dibaca di lain waktu.</p>
                  </div>
                </div>

                <div class="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div v-for="book in wishlistList" :key="book.id" class="p-4 rounded-xl border border-outline-variant bg-surface-container-low/40 flex items-start gap-4 text-xs">
                    <div class="w-12 h-16 bg-surface-container-high rounded overflow-hidden shrink-0 border border-outline-variant flex items-center justify-center text-on-surface-variant font-bold">
                      <img v-if="book.cover_image || book.cover_image_url" :src="book.cover_image || book.cover_image_url" alt="Cover" class="w-full h-full object-cover"/>
                      <span v-else class="material-symbols-outlined text-lg">book</span>
                    </div>
                    <div class="min-w-0 flex-1 space-y-1">
                      <h4 class="font-bold text-primary truncate">{{ book.judul }}</h4>
                      <p class="text-on-surface-variant text-[11px] truncate">{{ book.penulis || 'STAH DNJ' }}</p>
                      <div class="pt-2 flex items-center justify-between">
                        <NuxtLink :to="getBookUrl(book)" class="px-2.5 py-1 bg-primary text-white rounded-lg text-[10px] font-bold">Detail</NuxtLink>
                        <button @click="handleRemoveWishlist(book.id)" class="text-rose-600 hover:text-rose-800 text-[10px] font-bold cursor-pointer">Hapus</button>
                      </div>
                    </div>
                  </div>

                  <div v-if="wishlistList.length === 0" class="col-span-2 py-12 text-center text-on-surface-variant font-bold">
                    Wishlist Anda masih kosong. Simpan buku dari katalog!
                  </div>
                </div>
              </div>

            </section>

            <!-- Right Column: Academic Alerts & Recommendations -->
            <section class="space-y-6">
              <!-- Pengumuman Pustaka -->
              <div class="bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant p-5 sm:p-6 space-y-4">
                <div class="flex items-center gap-2 border-b border-outline-variant/60 pb-3">
                  <span class="material-symbols-outlined text-secondary text-2xl">campaign</span>
                  <h3 class="font-headline-md text-base font-extrabold text-primary">Pengumuman Pustaka</h3>
                </div>
                <ul class="space-y-4 text-xs">
                  <li v-for="item in announcements" :key="item.id" class="pb-3 border-b border-outline-variant/40 last:border-0 last:pb-0">
                    <p class="font-bold text-primary">{{ item.title }}</p>
                    <p class="text-[11px] text-on-surface-variant mt-1 leading-relaxed">{{ item.content }}</p>
                  </li>
                  <li v-if="announcements.length === 0" class="text-on-surface-variant text-[11px]">
                    Tidak ada pengumuman terbaru saat ini.
                  </li>
                </ul>
              </div>

              <!-- Recommended Catalog Books -->
              <div class="bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant p-5 sm:p-6 space-y-4">
                <div>
                  <h3 class="font-headline-md text-base font-extrabold text-primary mb-0.5">Rekomendasi Koleksi</h3>
                  <p class="text-[11px] text-on-surface-variant">Buku populer untuk mendukung studi Anda.</p>
                </div>

                <div class="space-y-3 max-h-96 overflow-y-auto pr-1">
                  <NuxtLink v-for="book in recommendedBooks" :key="book.id" :to="getBookUrl(book)" class="flex gap-3 group cursor-pointer p-2 rounded-xl hover:bg-surface-container-low transition-colors">
                    <div class="w-12 h-16 shrink-0 rounded bg-primary-container/10 flex items-center justify-center text-primary font-bold overflow-hidden shadow-xs border border-outline-variant">
                      <img v-if="book.cover_image || book.cover_image_url" :src="book.cover_image || book.cover_image_url" alt="Cover" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                      <span v-else class="material-symbols-outlined text-xl">book</span>
                    </div>
                    <div class="flex flex-col justify-center text-xs min-w-0">
                      <h4 class="font-bold text-primary group-hover:text-secondary transition-colors truncate">{{ book.judul }}</h4>
                      <p class="text-[11px] text-on-surface-variant mt-0.5 truncate">{{ book.penulis || 'STAH DNJ' }}</p>
                      <span class="mt-1 text-[10px] font-bold text-emerald-800 uppercase">Tersedia</span>
                    </div>
                  </NuxtLink>
                </div>

                <NuxtLink to="/buku" class="block w-full text-center py-2.5 px-4 border border-outline-variant text-on-surface-variant rounded-xl font-bold text-xs hover:bg-surface-container-high transition-colors">
                  Jelajahi Semua Katalog Buku
                </NuxtLink>
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>

    <!-- App-Style Mobile Bottom Navigation Bar (md:hidden, FIXED HIGH Z-INDEX AT ROOT) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(10,37,64,0.15)]" style="padding-bottom: env(safe-area-inset-bottom);">
      <div class="flex items-center justify-around px-2 h-16 max-w-md mx-auto relative">
        
        <!-- Tab 1: Pinjaman -->
        <button 
          @click="activeSection = 'loans'"
          class="flex flex-col items-center justify-center gap-1 w-14 py-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 relative"
          :class="activeSection === 'loans' ? 'text-primary font-black' : 'text-slate-500 font-medium'"
        >
          <div class="flex items-center justify-center w-10 h-7 rounded-full transition-all" :class="activeSection === 'loans' ? 'bg-primary/10 text-primary scale-110 shadow-xs' : ''">
            <span class="material-symbols-outlined text-[20px]">pending_actions</span>
          </div>
          <span class="text-[10px] leading-none tracking-tight">Pinjaman</span>
          <span v-if="activeLoans.length > 0" class="absolute top-0.5 right-1 px-1.5 py-0.2 bg-amber-500 text-slate-950 font-black text-[9px] rounded-full">
            {{ activeLoans.length }}
          </span>
        </button>

        <!-- Tab 2: Reservasi -->
        <button 
          @click="activeSection = 'reservations'"
          class="flex flex-col items-center justify-center gap-1 w-14 py-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 relative"
          :class="activeSection === 'reservations' ? 'text-primary font-black' : 'text-slate-500 font-medium'"
        >
          <div class="flex items-center justify-center w-10 h-7 rounded-full transition-all" :class="activeSection === 'reservations' ? 'bg-primary/10 text-primary scale-110 shadow-xs' : ''">
            <span class="material-symbols-outlined text-[20px]">collections_bookmark</span>
          </div>
          <span class="text-[10px] leading-none tracking-tight">Reservasi</span>
          <span v-if="myReservations.length > 0" class="absolute top-0.5 right-1 px-1.5 py-0.2 bg-blue-600 text-white font-black text-[9px] rounded-full">
            {{ myReservations.length }}
          </span>
        </button>

        <!-- CENTER HIGHLIGHTED MAIN MENU ACTION BUTTON -->
        <div class="relative -top-4 flex flex-col items-center">
          <button 
            @click="showMobileMenuSheet = true"
            class="w-13 h-13 rounded-full bg-gradient-to-tr from-primary to-[#1B4B79] text-amber-300 shadow-xl border-4 border-white flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300 hover:rotate-45"
            title="Buka Menu Utama &amp; QR Presensi"
          >
            <span class="material-symbols-outlined text-2xl">widgets</span>
          </button>
          <span class="text-[9px] font-extrabold text-primary uppercase tracking-tighter mt-0.5">Menu</span>
        </div>

        <!-- Tab 3: Riwayat -->
        <button 
          @click="activeSection = 'history'"
          class="flex flex-col items-center justify-center gap-1 w-14 py-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95"
          :class="activeSection === 'history' ? 'text-primary font-black' : 'text-slate-500 font-medium'"
        >
          <div class="flex items-center justify-center w-10 h-7 rounded-full transition-all" :class="activeSection === 'history' ? 'bg-primary/10 text-primary scale-110 shadow-xs' : ''">
            <span class="material-symbols-outlined text-[20px]">history_edu</span>
          </div>
          <span class="text-[10px] leading-none tracking-tight">Riwayat</span>
        </button>

        <!-- Tab 4: Wishlist -->
        <button 
          @click="activeSection = 'wishlist'"
          class="flex flex-col items-center justify-center gap-1 w-14 py-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 relative"
          :class="activeSection === 'wishlist' ? 'text-primary font-black' : 'text-slate-500 font-medium'"
        >
          <div class="flex items-center justify-center w-10 h-7 rounded-full transition-all" :class="activeSection === 'wishlist' ? 'bg-primary/10 text-primary scale-110 shadow-xs' : ''">
            <span class="material-symbols-outlined text-[20px]">bookmark</span>
          </div>
          <span class="text-[10px] leading-none tracking-tight">Wishlist</span>
        </button>

      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
});

const { getProfile, getLoans, getReturns, getReservations, getWishlist, removeFromWishlist, extendLoan, getBooks, getAnnouncements, logout, tokenCookie } = usePustakaApi();
const { saveCatalogCache, getCatalogCache } = useIndexedDB();
const router = useRouter();

const activeSection = ref('loans');
const showMobileMenuSheet = ref(false);
const userProfile = ref<any>(null);
const activeLoans = ref<any[]>([]);
const historyList = ref<any[]>([]);
const myReservations = ref<any[]>([]);
const wishlistList = ref<any[]>([]);
const booksList = ref<any[]>([]);
const announcements = ref<any[]>([]);

const showQrModal = ref(false);
const refreshing = ref(false);
const extendingId = ref<any>(null);
const lastUpdatedTime = ref('');
const toastMessage = ref('');

let pollTimer: any = null;

const triggerToast = (msg: string) => {
  toastMessage.value = msg;
  setTimeout(() => {
    toastMessage.value = '';
  }, 4000);
};

const slugifyTitle = (text: any) => {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

const getBookUrl = (b: any) => {
  if (!b) return '/buku';
  const titleSlug = slugifyTitle(b.judul);
  return `/buku/${titleSlug}-${b.id}`;
};

const recommendedBooks = computed(() => {
  return booksList.value;
});

const formatDate = (dateStr: any) => {
  if (!dateStr) return '7 Hari Kerja';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
};

const getLoanUrgencyBadge = (loan: any) => {
  if (!loan.tanggal_kembali && !loan.due_date) {
    return { label: 'Dipinjam Normal', class: 'bg-amber-100 text-amber-900 border border-amber-300' };
  }
  const dueDate = new Date(loan.tanggal_kembali || loan.due_date).getTime();
  const now = Date.now();
  const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: `Terlambat ${Math.abs(diffDays)} Hari`, class: 'bg-rose-100 text-rose-900 border border-rose-300 animate-pulse' };
  }
  if (diffDays <= 2) {
    return { label: `H-${diffDays} Segera Kembalikan`, class: 'bg-amber-100 text-amber-950 border border-amber-300' };
  }
  return { label: `Sisa ${diffDays} Hari`, class: 'bg-emerald-100 text-emerald-900 border border-emerald-300' };
};

const getReservationBadge = (status?: string) => {
  const s = String(status || '').toLowerCase();
  if (s === 'siap_diambil' || s === 'siap') {
    return { label: '🟢 Siap Diambil di Meja', class: 'bg-emerald-100 text-emerald-900 border border-emerald-300 animate-pulse' };
  }
  if (s === 'proses_pengambilan') {
    return { label: '🔵 Sedang Diambil di Rak', class: 'bg-blue-100 text-blue-900 border border-blue-300' };
  }
  if (s === 'selesai') {
    return { label: '✅ Selesai (Diserahkan)', class: 'bg-purple-100 text-purple-900 border border-purple-300' };
  }
  return { label: '🟡 Perlu Pengambilan Rak', class: 'bg-amber-100 text-amber-950 border border-amber-300' };
};

const handleExtendLoan = async (loan: any) => {
  extendingId.value = loan.id;
  try {
    const res = await extendLoan(loan.id);
    triggerToast(res.message || `Tenggat peminjaman buku "${loan.buku?.judul || 'Pustaka'}" berhasil diperpanjang!`);
    await loadDashboardData(false);
  } catch (e) {
    triggerToast('Gagal mengajukan perpanjangan peminjaman.');
  } finally {
    extendingId.value = null;
  }
};

const handleRemoveWishlist = async (bookId: number | string) => {
  const res = await removeFromWishlist(bookId);
  triggerToast(res.message || 'Buku dihapus dari Wishlist');
  await loadDashboardData(false);
};

const handleLogout = async () => {
  await logout();
  router.push('/login');
};

const loadDashboardData = async (manual = false) => {
  refreshing.value = true;
  
  // STEP 1: Restore from IndexedDB cache for instant display
  if (!manual && activeLoans.value.length === 0) {
    try {
      const [cachedProfile, cachedLoans, cachedBooks, cachedAnn, cachedRes, cachedRet, cachedWish] = await Promise.all([
        getCatalogCache('dashboard_profile'),
        getCatalogCache('dashboard_loans'),
        getCatalogCache('dashboard_books'),
        getCatalogCache('dashboard_announcements'),
        getCatalogCache('dashboard_reservations'),
        getCatalogCache('dashboard_returns'),
        getCatalogCache('dashboard_wishlist')
      ]);
      if (cachedProfile) userProfile.value = cachedProfile;
      if (cachedLoans && cachedLoans.length > 0) activeLoans.value = cachedLoans;
      if (cachedBooks && cachedBooks.length > 0) booksList.value = cachedBooks;
      if (cachedAnn && cachedAnn.length > 0) announcements.value = cachedAnn;
      if (cachedRes && cachedRes.length > 0) myReservations.value = cachedRes;
      if (cachedRet && cachedRet.length > 0) historyList.value = cachedRet;
      if (cachedWish && cachedWish.length > 0) wishlistList.value = cachedWish;
    } catch (e) {}
  }

  // STEP 2: Fetch fresh data from Realtime API
  try {
    const [profileRes, loansRes, booksRes, annRes, resRes, retRes, wishRes] = await Promise.all([
      getProfile().catch(() => null),
      getLoans().catch(() => null),
      getBooks().catch(() => null),
      getAnnouncements().catch(() => null),
      getReservations(true).catch(() => null),
      getReturns().catch(() => null),
      getWishlist().catch(() => null)
    ]);

    if (profileRes?.data || profileRes?.user) {
      userProfile.value = profileRes.data || profileRes.user;
      saveCatalogCache('dashboard_profile', userProfile.value);
    }

    if (loansRes?.success && loansRes.data) {
      activeLoans.value = loansRes.data;
      saveCatalogCache('dashboard_loans', loansRes.data);
    }

    if (booksRes?.success && booksRes.data) {
      booksList.value = booksRes.data;
      saveCatalogCache('dashboard_books', booksRes.data);
    }

    if (annRes?.success && annRes.data) {
      announcements.value = annRes.data;
      saveCatalogCache('dashboard_announcements', announcements.value);
    }

    if (resRes?.success && resRes.data) {
      myReservations.value = resRes.data;
      saveCatalogCache('dashboard_reservations', resRes.data);
    }

    if (retRes?.success && retRes.data) {
      historyList.value = retRes.data;
      saveCatalogCache('dashboard_returns', retRes.data);
    }

    if (wishRes?.success && wishRes.data) {
      wishlistList.value = wishRes.data;
      saveCatalogCache('dashboard_wishlist', wishRes.data);
    }

    lastUpdatedTime.value = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (manual) triggerToast('Data dashboard berhasil diperbarui!');
  } catch (e) {
    console.error('Failed to load dashboard data:', e);
  } finally {
    refreshing.value = false;
  }
};

onMounted(async () => {
  // STRICT ROLE GUARD: Admin, Kepala Pustaka, and Pustakawan CANNOT access Member Dashboard
  if (process.client) {
    let currentRole = '';
    try {
      const storedUser = localStorage.getItem('pustaka_user');
      if (storedUser) {
        currentRole = (JSON.parse(storedUser)?.role || '').toLowerCase();
      }
    } catch (e) {}

    if (tokenCookie.value) {
      const prof = await getProfile().catch(() => null);
      if (prof?.data?.role || prof?.user?.role) {
        currentRole = (prof.data?.role || prof.user?.role || '').toLowerCase();
      }
    }

    const adminStaffRoles = ['admin', 'administrator', 'kepala_pustaka', 'kepala_perpustakaan', 'pustakawan', 'staf', 'petugas', 'operator', 'super_admin'];
    if (adminStaffRoles.includes(currentRole)) {
      triggerToast('ℹ️ Anda login sebagai Admin Staff. Pengalihan otomatis ke Panel Admin.');
      setTimeout(() => {
        router.push('/admin');
      }, 500);
      return;
    }
  }

  loadDashboardData();

  // Setup auto-polling every 15 seconds for realtime API synchronization
  pollTimer = setInterval(() => {
    loadDashboardData(false);
  }, 15000);
});

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer);
});

useHead({
  title: 'Member Library Dashboard - STAH Dharma Nusantara Jakarta',
  meta: [
    { name: 'description', content: 'Dashboard anggota perpustakaan untuk Mahasiswa, Dosen, dan Pemustaka STAH Dharma Nusantara Jakarta.' }
  ]
});
</script>

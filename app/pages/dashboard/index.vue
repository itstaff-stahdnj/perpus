<template>
  <div class="bg-surface text-on-surface font-body-md h-screen overflow-hidden flex">
    <!-- Sidebar Navigation -->
    <aside class="hidden md:flex flex-col h-screen py-8 border-r border-outline-variant bg-surface shadow-sm w-72 shrink-0 z-30">
      <div class="px-6 mb-8 flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center shrink-0 text-on-primary-container">
          <span class="material-symbols-outlined text-2xl">account_balance</span>
        </div>
        <div>
          <h2 class="font-headline-md text-sm font-bold text-primary leading-tight">STAH Dharma Nusantara</h2>
          <p class="font-caption text-xs text-on-surface-variant mt-0.5">Academic Library</p>
        </div>
      </div>

      <nav class="flex-1 px-4 space-y-1 overflow-y-auto">
        <button 
          @click="activeSection = 'loans'" 
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-body-md text-xs font-semibold cursor-pointer"
          :class="activeSection === 'loans' ? 'bg-surface-container-high text-primary border-r-4 border-secondary' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'"
        >
          <span class="material-symbols-outlined text-xl">pending_actions</span>
          <span>Active Loans</span>
        </button>

        <NuxtLink 
          to="/buku" 
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors font-body-md text-xs font-semibold"
        >
          <span class="material-symbols-outlined text-xl">library_books</span>
          <span>Katalog Pustaka</span>
        </NuxtLink>

        <button 
          @click="activeSection = 'history'" 
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-body-md text-xs font-semibold cursor-pointer"
          :class="activeSection === 'history' ? 'bg-surface-container-high text-primary border-r-4 border-secondary' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'"
        >
          <span class="material-symbols-outlined text-xl">history_edu</span>
          <span>Reading History</span>
        </button>

        <NuxtLink 
          to="/tata-tertib" 
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors font-body-md text-xs font-semibold"
        >
          <span class="material-symbols-outlined text-xl">gavel</span>
          <span>Tata Tertib</span>
        </NuxtLink>
      </nav>

      <div class="px-6 mb-6">
        <NuxtLink to="/bantuan" class="w-full py-3 px-4 bg-secondary text-white font-label-md text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2">
          <span class="material-symbols-outlined text-lg">support_agent</span>
          <span>Bantuan Pustakawan</span>
        </NuxtLink>
      </div>

      <div class="px-4 mt-auto border-t border-outline-variant pt-4 space-y-1">
        <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors text-xs font-bold cursor-pointer">
          <span class="material-symbols-outlined text-lg">logout</span>
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      <!-- Top Header Bar -->
      <header class="flex justify-between items-center px-4 lg:px-10 sticky top-0 z-40 bg-surface-container-lowest shadow-xs w-full h-16 border-b border-outline-variant">
        <div class="flex items-center gap-3 lg:gap-6 flex-1">
          <NuxtLink to="/" class="flex items-center gap-1.5 text-primary hover:text-secondary font-bold text-xs shrink-0" title="Kembali ke Beranda Utama">
            <span class="material-symbols-outlined text-lg">arrow_back</span>
            <span class="hidden sm:inline">Beranda</span>
          </NuxtLink>
          <h1 class="font-headline-md text-sm lg:text-lg font-black text-primary hidden lg:block">Library Member Dashboard</h1>
          <div class="relative max-w-md w-full">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-base">search</span>
            <input 
              v-model="catalogSearch" 
              type="text" 
              placeholder="Cari buku / peminjaman..." 
              class="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-surface border border-outline-variant rounded-full font-body-md text-xs text-on-surface focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex items-center gap-3 border-l border-outline-variant pl-3">
            <div class="text-right hidden sm:block">
              <p class="font-bold text-xs text-primary">{{ userProfile?.name || 'Mahasiswa / Pemustaka' }}</p>
              <p class="text-[11px] text-on-surface-variant uppercase">{{ userProfile?.role || 'Anggota Perpustakaan' }}</p>
            </div>
            <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary-container text-white flex items-center justify-center font-bold overflow-hidden border border-outline-variant shrink-0">
              <img v-if="userProfile?.avatar_url" :src="userProfile.avatar_url" alt="Avatar" class="w-full h-full object-cover"/>
              <span v-else class="material-symbols-outlined text-lg sm:text-xl">account_circle</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Scrollable Area -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 pb-24 bg-surface">
        <div class="max-w-container-max mx-auto space-y-8">
          
          <!-- Welcome Section -->
          <section>
            <h2 class="font-headline-lg text-xl sm:text-2xl font-bold text-primary mb-1">
              Selamat Datang, {{ userProfile?.name || 'Pemustaka STAH DNJ' }}
            </h2>
            <p class="font-body-lg text-xs text-on-surface-variant">Pantau aktivitas peminjaman buku dan layanan pustaka Anda.</p>
          </section>

          <!-- Stat Cards Grid -->
          <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div class="bg-surface-container-lowest rounded-xl p-5 sm:p-6 shadow-xs border border-surface-variant flex flex-col justify-between h-32">
              <div class="flex justify-between items-start">
                <span class="font-label-md text-xs text-on-surface-variant uppercase font-bold tracking-wider">Buku Dipinjam</span>
                <span class="material-symbols-outlined text-primary-container text-2xl">book</span>
              </div>
              <div class="font-display-lg text-2xl sm:text-3xl font-extrabold text-primary">{{ activeLoans.length }}</div>
            </div>

            <div class="bg-surface-container-lowest rounded-xl p-5 sm:p-6 shadow-xs border border-surface-variant flex flex-col justify-between h-32">
              <div class="flex justify-between items-start">
                <span class="font-label-md text-xs text-on-surface-variant uppercase font-bold tracking-wider">Katalog Tersedia</span>
                <span class="material-symbols-outlined text-secondary text-2xl">library_add_check</span>
              </div>
              <div class="font-display-lg text-2xl sm:text-3xl font-extrabold text-primary">{{ totalBooksAvailable }}</div>
            </div>

            <div class="bg-surface-container-lowest rounded-xl p-5 sm:p-6 shadow-xs border border-surface-variant flex flex-col justify-between h-32">
              <div class="flex justify-between items-start">
                <span class="font-label-md text-xs text-on-surface-variant uppercase font-bold tracking-wider">Denda Tertunda</span>
                <span class="material-symbols-outlined text-rose-600 text-2xl">report</span>
              </div>
              <div class="font-display-lg text-2xl sm:text-3xl font-extrabold text-rose-700">Rp 0</div>
            </div>

            <div class="bg-surface-container-lowest rounded-xl p-5 sm:p-6 shadow-xs border border-surface-variant flex flex-col justify-between h-32">
              <div class="flex justify-between items-start">
                <span class="font-label-md text-xs text-on-surface-variant uppercase font-bold tracking-wider">Status Keanggotaan</span>
                <span class="material-symbols-outlined text-amber-700 text-2xl">verified</span>
              </div>
              <div class="font-display-lg text-xs sm:text-sm font-bold text-emerald-700 uppercase">
                {{ userProfile?.status_keanggotaan || 'Aktif' }}
              </div>
            </div>
          </section>

          <!-- Main Layout Grid: Active Loans & Right Sidebar -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Left Column: Active Loans Table -->
            <section class="lg:col-span-2 space-y-6">
              <div class="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-variant overflow-hidden">
                <div class="p-4 sm:p-6 border-b border-surface-variant flex justify-between items-center bg-surface-bright">
                  <h3 class="font-headline-md text-sm sm:text-base font-bold text-primary">Pinjaman Aktif (Active Loans)</h3>
                  <NuxtLink to="/buku" class="font-label-md text-xs font-bold text-primary-container hover:text-primary transition-colors">
                    Cari Buku Lain
                  </NuxtLink>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="border-b border-surface-variant bg-surface text-xs">
                        <th class="py-3 px-6 font-bold text-on-surface-variant uppercase">Judul Pustaka</th>
                        <th class="py-3 px-6 font-bold text-on-surface-variant uppercase">Tenggat Waktu</th>
                        <th class="py-3 px-6 font-bold text-on-surface-variant uppercase">Status</th>
                        <th class="py-3 px-6 font-bold text-on-surface-variant uppercase text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-surface-variant text-xs">
                      <tr v-for="loan in activeLoans" :key="loan.id" class="hover:bg-surface-container-low transition-colors">
                        <td class="py-4 px-6">
                          <p class="font-bold text-primary">{{ loan.buku?.judul || loan.judul || 'Buku Perpustakaan' }}</p>
                          <p class="text-[11px] text-on-surface-variant mt-0.5">Oleh: {{ loan.buku?.penulis || 'Pustakawan STAH' }}</p>
                        </td>
                        <td class="py-4 px-6 font-medium text-on-surface">{{ formatDate(loan.tanggal_kembali || loan.due_date) }}</td>
                        <td class="py-4 px-6">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                            Dipinjam
                          </span>
                        </td>
                        <td class="py-4 px-6 text-right">
                          <button @click="extendLoan(loan)" class="px-3 py-1.5 border border-primary text-primary rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-colors cursor-pointer">
                            Perpanjang
                          </button>
                        </td>
                      </tr>
                      <tr v-if="activeLoans.length === 0">
                        <td colspan="4" class="py-12 px-6 text-center text-on-surface-variant">
                          <span class="material-symbols-outlined text-4xl opacity-40 mb-2 block">menu_book</span>
                          <p class="font-bold">Belum Ada Pinjaman Aktif</p>
                          <p class="text-[11px] opacity-80 mt-0.5">Anda sedang tidak meminjam buku saat ini.</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <!-- Right Column: Academic Alerts & Recommendations -->
            <section class="space-y-6">
              <!-- Academic Alerts / Announcements -->
              <div class="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-variant p-6">
                <div class="flex items-center gap-2 mb-4">
                  <span class="material-symbols-outlined text-secondary text-2xl">campaign</span>
                  <h3 class="font-headline-md text-base font-bold text-primary">Pengumuman Pustaka</h3>
                </div>
                <ul class="space-y-4 text-xs">
                  <li v-for="item in announcements" :key="item.id" class="pb-3 border-b border-surface-variant last:border-0 last:pb-0">
                    <p class="font-bold text-primary">{{ item.title }}</p>
                    <p class="text-[11px] text-on-surface-variant mt-1 leading-relaxed">{{ item.content }}</p>
                  </li>
                  <li v-if="announcements.length === 0" class="text-on-surface-variant text-[11px]">
                    Tidak ada pengumuman terbaru saat ini.
                  </li>
                </ul>
              </div>

              <!-- Recommended Catalog Books -->
              <div class="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-variant p-6">
                <h3 class="font-headline-md text-base font-bold text-primary mb-1">Rekomendasi Buku</h3>
                <p class="text-[11px] text-on-surface-variant mb-4">Koleksi terpopuler di perpustakaan STAH DNJ.</p>

                <div class="space-y-4">
                  <NuxtLink v-for="book in recommendedBooks" :key="book.id" :to="`/buku/${book.id}`" class="flex gap-4 group cursor-pointer">
                    <div class="w-14 h-20 shrink-0 rounded bg-primary-container/10 flex items-center justify-center text-primary font-bold overflow-hidden shadow-xs">
                      <img v-if="book.cover_image" :src="book.cover_image" alt="Cover" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                      <span v-else class="material-symbols-outlined text-2xl">book</span>
                    </div>
                    <div class="flex flex-col justify-center text-xs">
                      <h4 class="font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2">{{ book.judul }}</h4>
                      <p class="text-[11px] text-on-surface-variant mt-0.5">{{ book.penulis || 'STAH DNJ' }}</p>
                      <div class="mt-1 flex gap-2">
                        <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">Tersedia</span>
                      </div>
                    </div>
                  </NuxtLink>
                </div>

                <NuxtLink to="/buku" class="block w-full text-center mt-6 py-2 px-4 border border-outline-variant text-on-surface-variant rounded-lg font-bold text-xs hover:bg-surface-variant transition-colors">
                  Lihat Semua Katalog Buku
                </NuxtLink>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
});

const { getProfile, getLoans, getBooks, getAnnouncements, logout } = usePustakaApi();
const router = useRouter();

const activeSection = ref('loans');
const catalogSearch = ref('');
const userProfile = ref(null);
const activeLoans = ref([]);
const booksList = ref([]);
const announcements = ref([]);

const totalBooksAvailable = computed(() => {
  return booksList.value.filter(b => (b.stok ?? 1) > 0).length || booksList.value.length;
});

const recommendedBooks = computed(() => {
  return booksList.value.slice(0, 3);
});

const formatDate = (dateStr) => {
  if (!dateStr) return '7 Hari Kerja';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
};

const extendLoan = async (loan) => {
  alert(`Permintaan perpanjangan untuk buku "${loan.buku?.judul || 'Pustaka'}" telah diajukan ke pustakawan.`);
};

const handleLogout = async () => {
  await logout();
  router.push('/login');
};

onMounted(async () => {
  try {
    const profileRes = await getProfile().catch(() => null);
    if (profileRes?.data || profileRes?.user) {
      userProfile.value = profileRes.data || profileRes.user;
    }

    const loansRes = await getLoans().catch(() => null);
    if (loansRes?.success && loansRes.data) {
      activeLoans.value = loansRes.data;
    }

    const booksRes = await getBooks().catch(() => null);
    if (booksRes?.success && booksRes.data) {
      booksList.value = booksRes.data;
    }

    const annRes = await getAnnouncements().catch(() => null);
    if (annRes?.success && annRes.data) {
      announcements.value = annRes.data.slice(0, 3);
    }
  } catch (e) {
    console.error('Failed to load dashboard data:', e);
  }
});

useHead({
  title: 'Member Library Dashboard - STAH Dharma Nusantara Jakarta',
  meta: [
    { name: 'description', content: 'Dashboard anggota perpustakaan untuk Mahasiswa, Dosen, dan Pemustaka STAH Dharma Nusantara Jakarta.' }
  ]
});
</script>

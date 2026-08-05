<template>
  <div class="bg-surface text-on-surface font-body-md h-screen overflow-hidden flex">
    <!-- Mobile Overlay Backdrop -->
    <div v-if="showMobileSidebar" class="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden" @click="showMobileSidebar = false"></div>

    <!-- SideNavBar -->
    <aside 
      class="fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest shadow-md border-r border-outline-variant flex flex-col py-6 z-50 transition-transform duration-300"
      :class="showMobileSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    >
      <div class="px-6 mb-8 flex flex-col gap-1">
        <div class="flex justify-between items-center">
          <h1 class="font-headline-md text-xl font-bold text-primary">STAH Dharma Nusantara</h1>
          <button @click="showMobileSidebar = false" class="md:hidden p-1 text-on-surface-variant hover:text-primary">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-secondary-container text-on-secondary-container">
            {{ userProfile?.role || 'Admin Panel' }}
          </span>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto px-2 space-y-1">
        <button 
          @click="activeTab = 'statistics'; showMobileSidebar = false"
          class="w-full flex items-center gap-3 rounded-xl px-4 py-3 mx-2 text-left transition-all cursor-pointer"
          :class="activeTab === 'statistics' ? 'bg-secondary-container text-on-secondary-container font-semibold scale-[0.98]' : 'text-on-surface-variant hover:bg-surface-container-highest'"
        >
          <span class="material-symbols-outlined">monitoring</span>
          <span class="font-label-md text-label-md">Statistics</span>
        </button>

        <button 
          @click="activeTab = 'books'; showMobileSidebar = false"
          class="w-full flex items-center gap-3 rounded-xl px-4 py-3 mx-2 text-left transition-all cursor-pointer"
          :class="activeTab === 'books' ? 'bg-secondary-container text-on-secondary-container font-semibold scale-[0.98]' : 'text-on-surface-variant hover:bg-surface-container-highest'"
        >
          <span class="material-symbols-outlined">menu_book</span>
          <span class="font-label-md text-label-md">Book Management</span>
        </button>

        <button 
          @click="activeTab = 'members'; showMobileSidebar = false"
          class="w-full flex items-center gap-3 rounded-xl px-4 py-3 mx-2 text-left transition-all cursor-pointer"
          :class="activeTab === 'members' ? 'bg-secondary-container text-on-secondary-container font-semibold scale-[0.98]' : 'text-on-surface-variant hover:bg-surface-container-highest'"
        >
          <span class="material-symbols-outlined">group</span>
          <span class="font-label-md text-label-md">Member Management</span>
        </button>

        <button 
          @click="activeTab = 'reports'; showMobileSidebar = false"
          class="w-full flex items-center gap-3 rounded-xl px-4 py-3 mx-2 text-left transition-all cursor-pointer"
          :class="activeTab === 'reports' ? 'bg-secondary-container text-on-secondary-container font-semibold scale-[0.98]' : 'text-on-surface-variant hover:bg-surface-container-highest'"
        >
          <span class="material-symbols-outlined">assessment</span>
          <span class="font-label-md text-label-md">Reports</span>
        </button>
      </nav>

      <div class="px-6 mt-4">
        <button 
          @click="openAddBookModal(); showMobileSidebar = false" 
          class="w-full bg-[#C89B3C] hover:bg-secondary text-white font-label-md text-label-md py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
        >
          <span class="material-symbols-outlined text-lg">add</span>
          <span>Add New Book</span>
        </button>
      </div>

      <div class="mt-auto pt-4 border-t border-outline-variant px-2 space-y-1">
        <NuxtLink to="/tata-tertib" class="flex items-center gap-3 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl px-4 py-3 mx-2">
          <span class="material-symbols-outlined">gavel</span>
          <span class="font-label-md text-label-md">Tata Tertib</span>
        </NuxtLink>

        <button @click="handleLogout" class="w-full flex items-center gap-3 text-rose-700 hover:bg-rose-50 transition-colors rounded-xl px-4 py-3 mx-2 text-left cursor-pointer">
          <span class="material-symbols-outlined text-rose-600">logout</span>
          <span class="font-label-md text-label-md font-bold">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Wrapper -->
    <div class="flex-1 ml-0 md:ml-72 flex flex-col h-screen overflow-hidden">
      <!-- TopNavBar -->
      <header class="sticky top-0 z-40 w-full bg-surface border-b border-outline-variant flex justify-between items-center h-16 px-4 md:px-8">
        <div class="flex items-center gap-2 sm:gap-4">
          <button @click="showMobileSidebar = !showMobileSidebar" class="p-2 text-primary md:hidden cursor-pointer rounded-lg hover:bg-surface-container-high" title="Buka Menu Admin">
            <span class="material-symbols-outlined text-2xl">menu</span>
          </button>

          <NuxtLink to="/" class="flex items-center gap-1.5 text-primary hover:text-secondary font-bold text-xs shrink-0" title="Ke Beranda Utama">
            <span class="material-symbols-outlined text-lg">arrow_back</span>
            <span class="hidden sm:inline">Beranda</span>
          </NuxtLink>

          <div class="relative flex items-center">
            <span class="material-symbols-outlined absolute left-3 text-on-surface-variant text-base">search</span>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Cari buku, penulis, anggota..." 
              class="pl-9 pr-3 py-1.5 sm:py-2 bg-surface-container-lowest border border-outline-variant rounded-full text-xs font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-40 sm:w-64 md:w-72 transition-shadow"
            />
          </div>
        </div>

        <div class="flex items-center gap-3 sm:gap-6">
          <div class="flex items-center gap-3">
            <NuxtLink to="/absensi" target="_blank" class="p-1.5 sm:p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5 text-xs font-bold bg-surface-container-high px-2.5 sm:px-3 rounded-full" title="Buka Display Kiosk">
              <span class="material-symbols-outlined text-base">tv</span>
              <span class="hidden sm:inline">Kiosk Absensi</span>
            </NuxtLink>
          </div>

          <div class="flex items-center gap-3 border-l border-outline-variant pl-3 sm:pl-6">
            <div class="text-right hidden sm:block">
              <p class="font-label-md text-xs font-bold text-primary">{{ userProfile?.name || 'Administrator' }}</p>
              <p class="text-[11px] text-on-surface-variant uppercase">{{ userProfile?.role || 'Admin Panel' }}</p>
            </div>
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-outline-variant bg-primary-container text-white flex items-center justify-center font-bold shrink-0">
              <img v-if="userProfile?.avatar_url" :src="userProfile.avatar_url" alt="Avatar" class="w-full h-full object-cover"/>
              <span v-else class="material-symbols-outlined text-lg sm:text-xl">person</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Scrollable Area -->
      <main class="flex-1 overflow-y-auto p-8 bg-surface">
        <div class="max-w-[1280px] mx-auto space-y-10">
          
          <!-- Section 1: Ringkasan Statistik -->
          <section>
            <h2 class="font-headline-md text-xl font-bold text-primary mb-6">Ringkasan Statistik</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <!-- Stat Card 1: Total Books -->
              <div class="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant card-shadow card-shadow-hover transition-shadow flex items-start justify-between">
                <div>
                  <p class="font-body-md text-xs text-on-surface-variant mb-1 font-semibold">Total Books</p>
                  <p class="font-display-lg text-3xl font-extrabold text-primary">{{ booksList.length || '12,450' }}</p>
                </div>
                <div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary-fixed-variant">
                  <span class="material-symbols-outlined text-2xl">library_books</span>
                </div>
              </div>

              <!-- Stat Card 2: Active Loans -->
              <div class="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant card-shadow card-shadow-hover transition-shadow flex items-start justify-between">
                <div>
                  <p class="font-body-md text-xs text-on-surface-variant mb-1 font-semibold">Active Loans</p>
                  <p class="font-display-lg text-3xl font-extrabold text-amber-700">{{ activeLoansCount || '842' }}</p>
                </div>
                <div class="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                  <span class="material-symbols-outlined text-2xl">import_contacts</span>
                </div>
              </div>

              <!-- Stat Card 3: New Members -->
              <div class="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant card-shadow card-shadow-hover transition-shadow flex items-start justify-between">
                <div>
                  <p class="font-body-md text-xs text-on-surface-variant mb-1 font-semibold">Total Members</p>
                  <p class="font-display-lg text-3xl font-extrabold text-primary">{{ usersList.length || '156' }}</p>
                </div>
                <div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary-fixed-variant">
                  <span class="material-symbols-outlined text-2xl">person_add</span>
                </div>
              </div>

              <!-- Stat Card 4: Pengunjung Hari Ini -->
              <div class="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant card-shadow card-shadow-hover transition-shadow flex items-start justify-between">
                <div>
                  <p class="font-body-md text-xs text-on-surface-variant mb-1 font-semibold">Today's Visitors</p>
                  <p class="font-display-lg text-3xl font-extrabold text-emerald-700">{{ todayAttendanceCount }}</p>
                </div>
                <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <span class="material-symbols-outlined text-2xl">groups</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Section 2: Manajemen Koleksi Buku -->
          <section>
            <div class="flex justify-between items-center mb-6">
              <h2 class="font-headline-md text-xl font-bold text-primary">Manajemen Koleksi Buku</h2>
              <button @click="openAddBookModal" class="bg-primary text-white font-label-md text-xs py-2.5 px-5 rounded-lg flex items-center gap-2 hover:bg-primary-container transition-colors cursor-pointer shadow-xs">
                <span class="material-symbols-outlined text-base">add</span>
                <span>Tambah Buku Baru</span>
              </button>
            </div>

            <div class="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead class="bg-surface-container-low border-b border-outline-variant">
                    <tr>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase">Judul Buku</th>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase">Penulis</th>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase">ISBN</th>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase">Kategori</th>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase">Stok Status</th>
                      <th class="p-4 font-label-md text-xs font-bold text-on-surface-variant uppercase text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-outline-variant text-xs">
                    <tr v-for="book in filteredBooks" :key="book.id" class="hover:bg-surface-container-low/50 transition-colors">
                      <td class="p-4 text-primary font-bold">{{ book.judul }}</td>
                      <td class="p-4 text-on-surface-variant font-medium">{{ book.penulis || '-' }}</td>
                      <td class="p-4 text-on-surface-variant font-mono text-[11px]">{{ book.isbn || '-' }}</td>
                      <td class="p-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-fixed text-on-primary-fixed-variant">
                          {{ book.kategori?.nama_kategori || 'Umum' }}
                        </span>
                      </td>
                      <td class="p-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold" :class="(book.stok ?? 1) > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'">
                          {{ (book.stok ?? 1) > 0 ? `Tersedia (${book.stok ?? 1})` : 'Dipinjam' }}
                        </span>
                      </td>
                      <td class="p-4 text-right space-x-2">
                        <button @click="openEditBookModal(book)" class="text-primary hover:text-secondary transition-colors cursor-pointer p-1" title="Edit Buku">
                          <span class="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button @click="confirmDeleteBook(book)" class="text-rose-600 hover:text-rose-900 transition-colors cursor-pointer p-1" title="Hapus Buku">
                          <span class="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </td>
                    </tr>
                    <tr v-if="filteredBooks.length === 0">
                      <td colspan="6" class="p-8 text-center text-on-surface-variant">
                        Tidak ada data buku yang sesuai penelusuran.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination Footer -->
              <div class="bg-surface-container-low px-4 py-3 flex items-center justify-between border-t border-outline-variant">
                <p class="text-xs text-on-surface-variant">
                  Menampilkan <span class="font-bold text-primary">{{ filteredBooks.length }}</span> buku
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>

    <!-- Modal Form: Tambah / Edit Buku -->
    <div v-if="showBookModal" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-outline-variant">
        <div class="flex justify-between items-center mb-6 pb-3 border-b border-outline-variant/60">
          <h3 class="font-bold text-lg text-primary">{{ isEditing ? 'Edit Data Buku' : 'Tambah Buku Baru' }}</h3>
          <button @click="showBookModal = false" class="text-on-surface-variant hover:text-primary cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form @submit.prevent="saveBook" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-primary mb-1">Judul Buku *</label>
            <input v-model="bookForm.judul" type="text" required class="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-primary outline-none focus:border-secondary"/>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-primary mb-1">Penulis</label>
              <input v-model="bookForm.penulis" type="text" class="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-primary outline-none focus:border-secondary"/>
            </div>
            <div>
              <label class="block font-bold text-primary mb-1">Penerbit</label>
              <input v-model="bookForm.penerbit" type="text" class="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-primary outline-none focus:border-secondary"/>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-primary mb-1">ISBN</label>
              <input v-model="bookForm.isbn" type="text" class="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-primary outline-none focus:border-secondary"/>
            </div>
            <div>
              <label class="block font-bold text-primary mb-1">Jumlah Stok</label>
              <input v-model.number="bookForm.stok" type="number" min="0" class="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-primary outline-none focus:border-secondary"/>
            </div>
          </div>

          <div>
            <label class="block font-bold text-primary mb-1">Deskripsi Ringkas</label>
            <textarea v-model="bookForm.deskripsi" rows="3" class="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-primary outline-none focus:border-secondary resize-none"></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-outline-variant/60">
            <button type="button" @click="showBookModal = false" class="px-4 py-2 border border-outline-variant rounded-xl text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors cursor-pointer">
              Batal
            </button>
            <button type="submit" :disabled="savingBook" class="px-5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl font-bold transition-colors cursor-pointer disabled:opacity-50">
              {{ savingBook ? 'Menyimpan...' : 'Simpan Buku' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
});

const { getBooks, createBook, updateBook, deleteBook, getLoans, getUsers, getAttendanceToday, getProfile, logout } = usePustakaApi();
const router = useRouter();

const activeTab = ref('statistics');
const searchQuery = ref('');
const showMobileSidebar = ref(false);
const userProfile = ref(null);

const booksList = ref([]);
const usersList = ref([]);
const activeLoansCount = ref(0);
const todayAttendanceCount = ref(0);

// Modal state
const showBookModal = ref(false);
const isEditing = ref(false);
const savingBook = ref(false);
const editingBookId = ref(null);

const bookForm = reactive({
  judul: '',
  penulis: '',
  penerbit: '',
  isbn: '',
  stok: 1,
  deskripsi: ''
});

const filteredBooks = computed(() => {
  if (!searchQuery.value.trim()) return booksList.value;
  const q = searchQuery.value.toLowerCase();
  return booksList.value.filter(b => 
    b.judul.toLowerCase().includes(q) ||
    (b.penulis && b.penulis.toLowerCase().includes(q)) ||
    (b.isbn && b.isbn.toLowerCase().includes(q))
  );
});

const openAddBookModal = () => {
  isEditing.value = false;
  editingBookId.value = null;
  bookForm.judul = '';
  bookForm.penulis = '';
  bookForm.penerbit = '';
  bookForm.isbn = '';
  bookForm.stok = 1;
  bookForm.deskripsi = '';
  showBookModal.value = true;
};

const openEditBookModal = (book) => {
  isEditing.value = true;
  editingBookId.value = book.id;
  bookForm.judul = book.judul || '';
  bookForm.penulis = book.penulis || '';
  bookForm.penerbit = book.penerbit || '';
  bookForm.isbn = book.isbn || '';
  bookForm.stok = book.stok ?? 1;
  bookForm.deskripsi = book.deskripsi || '';
  showBookModal.value = true;
};

const saveBook = async () => {
  if (!bookForm.judul.trim()) return;
  savingBook.value = true;
  try {
    if (isEditing.value && editingBookId.value) {
      await updateBook(editingBookId.value, { ...bookForm });
    } else {
      await createBook({ ...bookForm });
    }
    showBookModal.value = false;
    await loadAdminData();
  } catch (e) {
    console.error('Error saving book:', e);
  } finally {
    savingBook.value = false;
  }
};

const confirmDeleteBook = async (book) => {
  if (confirm(`Apakah Anda yakin ingin menghapus buku "${book.judul}"?`)) {
    try {
      await deleteBook(book.id);
      await loadAdminData();
    } catch (e) {
      console.error('Error deleting book:', e);
    }
  }
};

const handleLogout = async () => {
  await logout();
  router.push('/login');
};

const loadAdminData = async () => {
  try {
    // 1. Get profile
    const profileRes = await getProfile().catch(() => null);
    if (profileRes?.data || profileRes?.user) {
      userProfile.value = profileRes.data || profileRes.user;
    }

    // 2. Get books
    const booksRes = await getBooks().catch(() => null);
    if (booksRes?.success && booksRes.data) {
      booksList.value = booksRes.data;
    }

    // 3. Get loans
    const loansRes = await getLoans().catch(() => null);
    if (loansRes?.success && loansRes.data) {
      activeLoansCount.value = loansRes.data.length;
    }

    // 4. Get users
    const usersRes = await getUsers().catch(() => null);
    if (usersRes?.success && usersRes.data) {
      usersList.value = usersRes.data;
    }

    // 5. Get attendance today
    const attRes = await getAttendanceToday().catch(() => null);
    if (attRes?.success && attRes.data) {
      todayAttendanceCount.value = attRes.data.total_hadir || (attRes.data.daftar_hadir || []).length;
    }
  } catch (e) {
    console.error('Admin data load error:', e);
  }
};

onMounted(() => {
  loadAdminData();
});

useHead({
  title: 'Admin Dashboard - Perpustakaan STAH Dharma Nusantara',
  meta: [
    { name: 'description', content: 'Dashboard administrasi perpustakaan STAH Dharma Nusantara Jakarta.' }
  ]
});
</script>

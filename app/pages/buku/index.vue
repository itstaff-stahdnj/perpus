<template>
  <div class="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
    <div class="flex-1 flex max-w-container-max w-full mx-auto py-4 md:py-6">
      <!-- SideNavBar Filter -->
      <aside class="w-64 h-[calc(100vh-110px)] sticky top-24 bg-surface-container-low border-r border-outline-variant flex flex-col p-gutter gap-4 shrink-0 overflow-y-auto rounded-r-2xl hidden md:flex">
        <div>
          <h2 class="text-primary font-bold font-label-md text-label-md mb-1">Filter Katalog Buku</h2>
          <p class="text-on-surface-variant text-caption font-caption mb-4">Sesuaikan pencarian koleksi</p>
        </div>

        <!-- Search Input in Sidebar -->
        <div class="relative mb-2">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="w-full pl-9 pr-3 py-2 bg-white border border-outline-variant rounded-lg text-xs font-body-md focus:ring-2 focus:ring-primary outline-none" 
            placeholder="Cari judul/penulis/ISBN..." 
          />
        </div>

        <!-- Category Filters -->
        <div class="space-y-1">
          <p class="font-caption text-[11px] uppercase tracking-wider text-outline font-bold mb-2">Kategori Pustaka</p>
          
          <button 
            class="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-label-md transition-all"
            :class="selectedCategory === 'all' ? 'bg-secondary-fixed text-primary font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'"
            @click="selectedCategory = 'all'"
          >
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-lg">library_books</span>
              <span>Semua Buku</span>
            </div>
            <span class="text-[10px] bg-white/60 px-2 py-0.5 rounded-full font-mono">{{ books.length }}</span>
          </button>

          <button 
            v-for="cat in categories" 
            :key="cat.id" 
            class="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-label-md transition-all cursor-pointer"
            :class="isCategoryActive(cat) ? 'bg-secondary-fixed text-primary font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'"
            @click="selectedCategory = cat.nama_kategori"
          >
            <div class="flex items-center gap-2.5 truncate">
              <span class="material-symbols-outlined text-lg">menu_book</span>
              <span class="truncate">{{ cat.nama_kategori }}</span>
            </div>
            <span class="text-[10px] bg-black/5 px-2 py-0.5 rounded-full font-mono">{{ getCategoryCount(cat) }}</span>
          </button>
        </div>

        <!-- Availability Filter -->
        <div class="mt-4 pt-4 border-t border-outline-variant">
          <p class="font-caption text-[11px] uppercase tracking-wider text-outline font-bold mb-2">Status Ketersediaan</p>
          <div class="space-y-1">
            <button 
              class="w-full flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-label-md transition-all"
              :class="statusFilter === 'all' ? 'bg-primary-fixed text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'"
              @click="statusFilter = 'all'"
            >
              <span class="material-symbols-outlined text-lg">apps</span>
              <span>Semua Status</span>
            </button>
            <button 
              class="w-full flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-label-md transition-all"
              :class="statusFilter === 'available' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'"
              @click="statusFilter = 'available'"
            >
              <span class="material-symbols-outlined text-lg text-emerald-600">check_circle</span>
              <span>Buku Tersedia</span>
            </button>
          </div>
        </div>

        <!-- External E-Repository Link -->
        <div class="mt-4 pt-4 border-t border-outline-variant">
          <p class="font-caption text-[11px] uppercase tracking-wider text-outline font-bold mb-2">Repository STAH DNJ</p>
          <a 
            :href="repositorySearchUrl" 
            target="_blank" 
            class="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-label-md bg-secondary-container/60 hover:bg-secondary-container text-on-secondary-container font-semibold transition-all group"
          >
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-lg">database</span>
              <span>Cari di Repository STAH</span>
            </div>
            <span class="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">open_in_new</span>
          </a>
        </div>

        <button class="mt-auto bg-primary text-on-primary py-2.5 px-4 rounded-lg font-label-md text-xs hover:bg-primary-container transition-all active:scale-95" @click="resetFilters">
          Reset Filter
        </button>
      </aside>

      <!-- Main Content Canvas -->
      <main class="flex-1 p-4 md:p-margin-desktop overflow-y-auto">
        <header class="mb-8">
          <!-- E-Repository Info Alert -->
          <div class="mb-6 p-4 rounded-xl bg-primary-container text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm border border-primary-fixed-dim/30">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-secondary-fixed text-2xl shrink-0">database</span>
              <div>
                <p class="font-label-md text-xs sm:text-sm font-bold text-white">Mencari Skripsi, Tugas Akhir, atau Jurnal Digital?</p>
                <p class="text-caption text-[11px] sm:text-caption opacity-80">Akses langsung koleksi repositori akademik digital kampus di repository.stahdnj.ac.id</p>
              </div>
            </div>
            <a 
              :href="repositorySearchUrl" 
              target="_blank" 
              class="bg-secondary text-white px-4 py-2 rounded-lg font-label-md text-xs hover:bg-on-secondary-container transition-all flex items-center gap-1.5 shrink-0 font-bold"
            >
              <span>Cari di Repository STAH DNJ</span>
              <span class="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 class="font-headline-lg text-headline-lg text-primary mb-2">Katalog Buku Koleksi</h1>
              <p class="text-on-surface-variant text-body-md font-body-md">
                Menampilkan <strong class="text-primary">{{ filteredBooks.length }}</strong> judul buku akademik dan pustaka keagamaan.
              </p>
            </div>

            <!-- Mobile Search, Sort & View Mode Toggle -->
            <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap sm:flex-nowrap">
              <div class="relative sm:hidden flex-1 min-w-[140px]">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                <input v-model="searchQuery" type="text" class="w-full pl-9 pr-3 py-2 bg-surface-container rounded-full text-xs outline-none" placeholder="Cari buku..." />
              </div>

              <!-- Sorting Dropdown -->
              <div class="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-outline-variant shadow-sm text-xs font-body-md text-on-surface">
                <span class="material-symbols-outlined text-sm text-on-surface-variant">sort</span>
                <select v-model="sortBy" class="bg-transparent border-none outline-none cursor-pointer py-1 font-label-md text-xs text-primary font-medium">
                  <option value="default">Urutkan: Default</option>
                  <option value="judul-asc">Judul (A - Z)</option>
                  <option value="judul-desc">Judul (Z - A)</option>
                  <option value="tahun-desc">Tahun (Terbaru)</option>
                  <option value="tahun-asc">Tahun (Terlama)</option>
                </select>
              </div>

              <div class="flex items-center gap-1 bg-white p-1 rounded-lg border border-outline-variant shadow-sm">
                <button 
                  class="p-1.5 rounded transition-colors"
                  :class="viewMode === 'grid' ? 'bg-primary-fixed text-primary' : 'text-on-surface-variant hover:bg-surface-container'"
                  title="Tampilan Grid"
                  @click="viewMode = 'grid'"
                >
                  <span class="material-symbols-outlined text-xl">grid_view</span>
                </button>
                <button 
                  class="p-1.5 rounded transition-colors"
                  :class="viewMode === 'list' ? 'bg-primary-fixed text-primary' : 'text-on-surface-variant hover:bg-surface-container'"
                  title="Tampilan Daftar"
                  @click="viewMode = 'list'"
                >
                  <span class="material-symbols-outlined text-xl">list</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Active Filter Pills -->
          <div v-if="selectedCategory !== 'all' || searchQuery || statusFilter !== 'all' || sortBy !== 'default'" class="flex items-center gap-2 mt-4 flex-wrap">
            <span class="text-xs text-on-surface-variant font-medium">Filter Aktif:</span>
            <span v-if="selectedCategory !== 'all'" class="bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              Kategori: {{ selectedCategory }}
              <button class="hover:text-error cursor-pointer" @click="selectedCategory = 'all'">×</button>
            </span>
            <span v-if="searchQuery" class="bg-primary-fixed text-on-primary-fixed text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              Cari: "{{ searchQuery }}"
              <button class="hover:text-error cursor-pointer" @click="searchQuery = ''">×</button>
            </span>
            <span v-if="statusFilter !== 'all'" class="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              Status: Tersedia
              <button class="hover:text-error cursor-pointer" @click="statusFilter = 'all'">×</button>
            </span>
            <span v-if="sortBy !== 'default'" class="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              Urutkan: {{ sortLabels[sortBy] }}
              <button class="hover:text-error cursor-pointer" @click="sortBy = 'default'">×</button>
            </span>
            <button class="text-xs text-error font-bold hover:underline ml-2 cursor-pointer" @click="resetFilters">Reset Semua</button>
          </div>
        </header>

        <!-- Mobile Filter Quick Chips & Modal Trigger (Visible on md:hidden) -->
        <div class="md:hidden mb-6 space-y-3">
          <div class="flex items-center justify-between gap-2">
            <span class="font-label-md text-xs font-bold text-primary">Kategori Pustaka</span>
            <button 
              @click="showMobileFilterModal = true" 
              class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-outline-variant rounded-full text-xs font-bold text-primary shadow-xs active:scale-95 cursor-pointer"
            >
              <span class="material-symbols-outlined text-sm">tune</span>
              <span>Filter & Status</span>
              <span v-if="selectedCategory !== 'all' || statusFilter !== 'all'" class="w-2 h-2 bg-secondary rounded-full"></span>
            </button>
          </div>

          <!-- Horizontal Scrollable Category Pills -->
          <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button 
              class="px-3.5 py-1.5 rounded-full text-xs font-label-md transition-all whitespace-nowrap shrink-0 cursor-pointer"
              :class="selectedCategory === 'all' ? 'bg-primary text-white font-bold' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'"
              @click="selectedCategory = 'all'"
            >
              Semua ({{ books.length }})
            </button>
            <button 
              v-for="cat in categories" 
              :key="cat.id" 
              class="px-3.5 py-1.5 rounded-full text-xs font-label-md transition-all whitespace-nowrap shrink-0 cursor-pointer"
              :class="isCategoryActive(cat) ? 'bg-primary text-white font-bold' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'"
              @click="selectedCategory = cat.nama_kategori"
            >
              {{ cat.nama_kategori }} ({{ getCategoryCount(cat) }})
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="py-20 text-center">
          <div class="inline-block w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p class="font-body-md text-on-surface-variant">Memuat katalog koleksi dari database perpustakaan...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredBooks.length === 0" class="bg-surface-container-low border border-outline-variant p-8 md:p-12 rounded-2xl text-center my-8">
          <span class="material-symbols-outlined text-6xl text-outline mb-4">search_off</span>
          <h3 class="font-headline-md text-primary mb-2 font-bold">
            {{ selectedCategory !== 'all' ? `Belum Ada Buku di Kategori "${selectedCategory}"` : 'Koleksi Tidak Ditemukan' }}
          </h3>
          <p class="font-body-md text-on-surface-variant max-w-lg mx-auto mb-6">
            {{ selectedCategory !== 'all' 
                ? `Saat ini belum ada koleksi buku fisik terdaftar untuk kategori "${selectedCategory}". Anda bisa mencari karya ilmiah di Repository STAH DNJ atau menampilkan semua koleksi.` 
                : 'Tidak ada buku yang sesuai dengan pencarian atau filter yang dipilih. Silakan atur ulang kata kunci.' }}
          </p>
          <div class="flex flex-wrap items-center justify-center gap-3">
            <button class="bg-primary text-white px-6 py-2.5 rounded-xl font-label-md text-xs sm:text-sm hover:bg-primary-container transition-colors cursor-pointer font-bold" @click="resetFilters">
              Tampilkan Semua Buku ({{ books.length }})
            </button>
            <a 
              :href="repositorySearchUrl" 
              target="_blank" 
              class="bg-secondary text-white px-6 py-2.5 rounded-xl font-label-md text-xs sm:text-sm hover:bg-on-secondary-container transition-colors font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Cari di Repository STAH</span>
              <span class="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
        </div>

        <!-- Book Grid View -->
        <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter mb-12">
          <div 
            v-for="(book, index) in paginatedBooks" 
            :key="book.id" 
            class="bg-white rounded-xl card-elevation overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <NuxtLink :to="getBookUrl(book)" class="block relative aspect-[3/4] overflow-hidden bg-surface-container-high">
                <img 
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  :src="getBookCover(book, index)" 
                  :alt="book.judul"
                  @error="handleImageError($event, index)"
                />
                <div class="absolute top-3 left-3">
                  <span class="bg-primary-container/90 text-on-primary-container px-3 py-1 rounded-full text-caption font-label-md backdrop-blur-sm shadow-sm">
                    {{ book.tahun_terbit || 'STAH DNJ' }}
                  </span>
                </div>
              </NuxtLink>

              <div class="p-5">
                <span v-if="getBookCategoryName(book)" class="inline-block text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary-fixed/80 px-2 py-0.5 rounded-md mb-1.5">
                  {{ getBookCategoryName(book) }}
                </span>
                <div class="flex justify-between items-start mb-2 gap-2">
                  <NuxtLink :to="getBookUrl(book)" class="font-label-md text-label-md text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-snug font-bold">
                    {{ book.judul }}
                  </NuxtLink>
                  <button 
                    class="material-symbols-outlined text-on-surface-variant hover:text-secondary transition-colors text-xl cursor-pointer"
                    :class="{ 'text-secondary font-fill': bookmarkedIds.has(book.id) }"
                    title="Simpan Buku"
                    @click.stop="toggleBookmark(book.id)"
                  >
                    bookmark
                  </button>
                </div>
                <p class="text-on-surface-variant text-caption font-caption mb-4 line-clamp-1">
                  ✍️ {{ book.penulis || 'Penulis Tidak Diketahui' }}
                </p>
              </div>
            </div>

            <div class="p-5 pt-0">
              <div class="flex items-center gap-1.5 mb-4">
                <span class="w-2 h-2 rounded-full" :class="(book.stok === undefined || book.stok > 0) ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                <span class="text-caption font-label-md font-semibold" :class="(book.stok === undefined || book.stok > 0) ? 'text-emerald-700' : 'text-rose-700'">
                  {{ (book.stok === undefined || book.stok > 0) ? `Tersedia (${book.stok ?? 1})` : 'Sedang Dipinjam' }}
                </span>
              </div>
              <div class="flex gap-2">
                <NuxtLink 
                  :to="getBookUrl(book)" 
                  class="flex-1 py-2 rounded-lg border border-primary text-primary font-label-md text-xs hover:bg-primary-fixed transition-colors font-semibold text-center"
                >
                  Detail
                </NuxtLink>
                <a 
                  :href="getBookPortalUrl(book)" 
                  target="_blank" 
                  class="bg-secondary text-white px-3 py-2 rounded-lg font-label-md text-xs hover:opacity-90 transition-opacity font-semibold text-center flex items-center justify-center gap-1 shrink-0"
                  title="Pinjam Buku di Portal Perpustakaan"
                >
                  <span>Pinjam</span>
                  <span class="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Book List View -->
        <div v-else class="space-y-4 mb-12">
          <div 
            v-for="(book, index) in paginatedBooks" 
            :key="book.id" 
            class="bg-white p-4 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div class="flex items-center gap-4">
              <NuxtLink :to="getBookUrl(book)" class="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high block">
                <img 
                  :src="getBookCover(book, index)" 
                  :alt="book.judul" 
                  class="w-full h-full object-cover"
                  @error="handleImageError($event, index)"
                />
              </NuxtLink>
              <div>
                <span class="text-[10px] font-bold uppercase text-secondary bg-secondary-fixed px-2 py-0.5 rounded mb-1 inline-block">
                  {{ getBookCategoryName(book) ? `${getBookCategoryName(book)} • ` : '' }}{{ book.tahun_terbit || '2021' }}
                </span>
                <NuxtLink :to="getBookUrl(book)" class="font-headline-md text-base text-primary font-bold leading-tight mb-1 hover:text-secondary block">
                  {{ book.judul }}
                </NuxtLink>
                <p class="text-xs text-on-surface-variant">✍️ {{ book.penulis || 'Penulis Tidak Diketahui' }} • Penerbit: {{ book.penerbit || 'Pustaka STAH' }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full" :class="(book.stok === undefined || book.stok > 0) ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                <span class="text-xs font-semibold" :class="(book.stok === undefined || book.stok > 0) ? 'text-emerald-700' : 'text-rose-700'">
                  {{ (book.stok === undefined || book.stok > 0) ? `Tersedia (${book.stok ?? 1})` : 'Sedang Dipinjam' }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <NuxtLink :to="getBookUrl(book)" class="px-4 py-2 border border-primary text-primary rounded-lg text-xs font-semibold hover:bg-primary-fixed">
                  Detail
                </NuxtLink>
                <a 
                  :href="getBookPortalUrl(book)" 
                  target="_blank" 
                  class="px-4 py-2 bg-secondary text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1"
                  title="Pinjam Buku di Portal Perpustakaan"
                >
                  <span>Pinjam</span>
                  <span class="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More / Pagination -->
        <div v-if="filteredBooks.length > itemsPerPage" class="flex flex-col items-center gap-4 py-8 border-t border-outline-variant">
          <p class="text-on-surface-variant text-caption font-caption italic">
            Menampilkan {{ Math.min(displayedCount, filteredBooks.length) }} dari {{ filteredBooks.length }} buku
          </p>
          <button 
            v-if="displayedCount < filteredBooks.length"
            class="bg-white border-2 border-primary text-primary px-8 py-3 rounded-full font-label-md text-label-md hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2 shadow-sm cursor-pointer"
            @click="loadMore"
          >
            <span class="material-symbols-outlined">expand_more</span>
            <span>Muat Lebih Banyak</span>
          </button>
        </div>

        <!-- Mobile Filter Sheet / Modal -->
        <div v-if="showMobileFilterModal" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 md:hidden" @click.self="showMobileFilterModal = false">
          <div class="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-outline-variant max-h-[85vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4 pb-3 border-b border-outline-variant">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-xl">tune</span>
                <h3 class="font-bold text-base text-primary">Filter Katalog Buku</h3>
              </div>
              <button @click="showMobileFilterModal = false" class="p-1 text-on-surface-variant hover:text-primary">
                <span class="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <!-- Filter options inside modal -->
            <div class="space-y-6 text-xs">
              <!-- Categories -->
              <div>
                <p class="font-bold text-primary mb-2 uppercase text-[11px] tracking-wider text-outline">Kategori Pustaka</p>
                <div class="grid grid-cols-2 gap-2">
                  <button 
                    class="p-2.5 rounded-xl text-left border text-xs transition-all flex justify-between items-center"
                    :class="selectedCategory === 'all' ? 'bg-primary text-white border-primary font-bold' : 'border-outline-variant text-on-surface hover:bg-surface-container-low'"
                    @click="selectedCategory = 'all'"
                  >
                    <span>Semua Buku</span>
                    <span class="text-[10px] opacity-80">{{ books.length }}</span>
                  </button>
                  <button 
                    v-for="cat in categories" 
                    :key="cat.id" 
                    class="p-2.5 rounded-xl text-left border text-xs transition-all flex justify-between items-center truncate cursor-pointer"
                    :class="isCategoryActive(cat) ? 'bg-primary text-white border-primary font-bold' : 'border-outline-variant text-on-surface hover:bg-surface-container-low'"
                    @click="selectedCategory = cat.nama_kategori"
                  >
                    <span class="truncate pr-1">{{ cat.nama_kategori }}</span>
                    <span class="text-[10px] opacity-80 shrink-0">{{ getCategoryCount(cat) }}</span>
                  </button>
                </div>
              </div>

              <!-- Status Availability -->
              <div>
                <p class="font-bold text-primary mb-2 uppercase text-[11px] tracking-wider text-outline">Status Ketersediaan</p>
                <div class="grid grid-cols-2 gap-2">
                  <button 
                    class="p-2.5 rounded-xl text-left border text-xs transition-all flex items-center gap-2"
                    :class="statusFilter === 'all' ? 'bg-primary-fixed text-primary border-primary font-bold' : 'border-outline-variant text-on-surface hover:bg-surface-container-low'"
                    @click="statusFilter = 'all'"
                  >
                    <span class="material-symbols-outlined text-base">apps</span>
                    <span>Semua Status</span>
                  </button>
                  <button 
                    class="p-2.5 rounded-xl text-left border text-xs transition-all flex items-center gap-2"
                    :class="statusFilter === 'available' ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold' : 'border-outline-variant text-on-surface hover:bg-surface-container-low'"
                    @click="statusFilter = 'available'"
                  >
                    <span class="material-symbols-outlined text-base text-emerald-600">check_circle</span>
                    <span>Tersedia</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="flex justify-between items-center gap-3 pt-6 mt-6 border-t border-outline-variant">
              <button @click="resetFilters" class="px-4 py-2.5 border border-outline-variant text-on-surface-variant rounded-xl font-bold hover:bg-surface-container transition-colors">
                Reset
              </button>
              <button @click="showMobileFilterModal = false" class="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-container transition-colors">
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  usePustakaApi, 
  type Book, 
  type Category 
} from '../../composables/usePustakaApi';

const route = useRoute();
const router = useRouter();

const { getBooks, getCategories } = usePustakaApi();

const loading = ref(true);
const searchQuery = ref('');
const selectedCategory = ref('all');
const statusFilter = ref('all');
const sortBy = ref<'default' | 'judul-asc' | 'judul-desc' | 'tahun-desc' | 'tahun-asc'>('default');
const viewMode = ref<'grid' | 'list'>('grid');
const showMobileFilterModal = ref(false);

const books = ref<Book[]>([]);
const categories = ref<Category[]>([]);
const bookmarkedIds = ref<Set<number>>(new Set());

const itemsPerPage = 8;
const displayedCount = ref(8);

const sortLabels: Record<string, string> = {
  'default': 'Default',
  'judul-asc': 'Judul (A - Z)',
  'judul-desc': 'Judul (Z - A)',
  'tahun-desc': 'Tahun (Terbaru)',
  'tahun-asc': 'Tahun (Terlama)'
};

const fallbackCovers = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBjq6J4ANKae7qsrtkuWYh2IKfolYdhdRZM2TNI8F_xfMmUy3GBNd_0lext2akY1DDQ-kI-MJSyq4i31ZLyKVJI5XFSESV6cHMr_388ebfR_LGzALybl-8R9nX2Nv2lVRN0jH5rOB6rB4RxN64zomhvv-ZvrVC3vpOOOKYyj_SposBs3k-n2AQqrjNdR8dMAqTChCdVpQ060FAavRTfCkWDIIgpXq02Vdd8ne-WzV9CGwL6DLoUheaybw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAElf4lHvPyHKSARy1FI7JoX9nUlPGcOS2dNvbSdwMaxPWRcWryz8T3KKJpzuyMG6jrTyAZ-y-SmkYHYyihTBnpiXp0S8wyZVFfYqDpT_L90rKfO7g6IXtk2VZf8SMkaHsPCcUrlvyFPiOzP3FtnygFchRAhojFKZe83RwiQYFj51Ev5V519G57hqPy31CU18xmPrlbxkcX5ezwau29gy9mBkPlaqGHV16PUX3-JX6TcO4JAvDDp97N5g',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCcT8QugJ0fdCpEvQJ_O7fef3ejlWyO3QKD18BrYf_tTxChyP-HaPX9qIdyMsNxjPUcoWvAWRMPcflN-ZE3l6MlYpxSHM6lY148obzhfOD5Z0dEayFicVHw4R_A0w00MolYHCjZFHtONz8CEUF-Imv7OY5gKCT3QQsj2zjuVm2AocdoX_tD2pvxx8c_icEAXEGWKjJhdESVU-psGL9QzdouJsYJ0ItkdMfktdm8Hqa6XuL86NbWyQnXKw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAtxh2Tjw2Jcky-k9qbAni-am-iauV-krkGreT9NGiDa84AIQi4Y1tTI08mH4mNQc8yT0qt6z2xCCJxZnQZ88W5v6bW5jrClYo8zIDMZl-UWmh9w0ZC_xbUa3gfTHE05SDMD_mh0lNyGtPTJ9KLLQ1puJHuGcwaDMTezYU1a_DwVqV03FoLTZ2BuCFZpZS5DuhVIVEpViNlrVe4W3ilf4vkvMIyr4SUny72SV-eyYPtWzt01jD2YmZMdg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCMHvivOiQ2f9XBmkY2ZKGa2D_TFfvv2m-iIIh3LxSVGPEVcvaC43svmN7LI1BKol5vzmDjqqUAKEvOwGH19G26TT59SitmrAO5ofeFKsbr9gj-vDdcvAbD7Zt6hUjsj3wzIxDEkUNNGwcL5jL4qPwkiS4udh_wipHZCoKX1tK5sEeiEqnO8mm4DuB8ev14yj4xeZAy1sKdQXNh5cWRq-z9ram0SdQUxuNJixCH0XzHpCtkf-dW7_2LwA'
];

const handleImageError = (event: Event, index: number) => {
  const img = event.target as HTMLImageElement;
  if (img) {
    img.src = fallbackCovers[Math.abs(index) % fallbackCovers.length] || '';
  }
};

const isBookMatchingCategory = (b: Book, targetCategory: string): boolean => {
  if (!targetCategory || targetCategory === 'all') return true;

  const target = targetCategory.trim().toLowerCase();
  if (target === 'all') return true;

  const catObj = b.category || b.kategori;
  if (!catObj) return false;

  let cId = '';
  let cName = '';
  let cSlug = '';

  if (typeof catObj === 'object') {
    cId = String(catObj.id || '');
    cName = (catObj.nama_kategori || (catObj as any).name || '').trim().toLowerCase();
    cSlug = (catObj.slug || '').trim().toLowerCase();
  } else if (typeof catObj === 'string') {
    cName = catObj.trim().toLowerCase();
  }

  if (target === cId || target === cName || (cSlug && target === cSlug)) {
    return true;
  }

  const cleanTarget = target.replace(/[^a-z0-9]+/g, ' ').trim();
  const cleanName = cName.replace(/[^a-z0-9]+/g, ' ').trim();
  const cleanSlug = cSlug.replace(/[^a-z0-9]+/g, ' ').trim();

  if (cleanTarget && cleanName && (cleanName.includes(cleanTarget) || cleanTarget.includes(cleanName))) {
    return true;
  }
  if (cleanTarget && cleanSlug && (cleanSlug.includes(cleanTarget) || cleanTarget.includes(cleanSlug))) {
    return true;
  }

  return false;
};

const getBookCategoryName = (b: Book): string => {
  const catObj = b.category || b.kategori;
  if (catObj && typeof catObj === 'object') {
    return catObj.nama_kategori || (catObj as any).name || '';
  }
  if (typeof catObj === 'string') {
    return catObj;
  }
  return '';
};

const getBookCategorySlug = (b: Book): string => {
  const catObj = b.category || b.kategori;
  if (catObj && typeof catObj === 'object') {
    return catObj.slug || '';
  }
  return '';
};

const getCategoryCount = (cat: Category): number => {
  if (!books.value || books.value.length === 0) {
    return cat.books_count ?? 0;
  }
  return books.value.filter(b => 
    isBookMatchingCategory(b, cat.nama_kategori) ||
    (cat.slug ? isBookMatchingCategory(b, cat.slug) : false) ||
    isBookMatchingCategory(b, String(cat.id))
  ).length;
};

const isCategoryActive = (cat: Category): boolean => {
  if (selectedCategory.value === 'all') return false;
  const sel = selectedCategory.value.trim().toLowerCase();
  const catName = cat.nama_kategori.trim().toLowerCase();
  const catSlug = (cat.slug || '').trim().toLowerCase();
  return (
    sel === catName ||
    (!!catSlug && sel === catSlug) ||
    isBookMatchingCategory({ category: cat } as any, selectedCategory.value)
  );
};

const getBookCover = (b: Book, index: number) => {
  return b.cover_image || b.cover_image_url || fallbackCovers[index % fallbackCovers.length];
};

const getBookUrl = (b: Book) => {
  const slug = b.slug || b.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  return `/buku/${slug}-${b.id}`;
};

const getBookPortalUrl = (b: Book) => {
  return `https://portal-perpus.stahdnj.ac.id/login?redirect=${encodeURIComponent(`/buku/${b.id}`)}`;
};

const repositorySearchUrl = computed(() => {
  if (searchQuery.value.trim()) {
    return `https://repository.stahdnj.ac.id/xmlui/discover?query=${encodeURIComponent(searchQuery.value)}`;
  }
  return 'https://repository.stahdnj.ac.id/xmlui/';
});

const filteredBooks = computed(() => {
  let list = books.value;

  if (selectedCategory.value !== 'all') {
    list = list.filter(b => isBookMatchingCategory(b, selectedCategory.value));
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(b => {
      const catName = getBookCategoryName(b).toLowerCase();
      return (
        (b.judul && b.judul.toLowerCase().includes(q)) ||
        (b.penulis && b.penulis.toLowerCase().includes(q)) ||
        (b.isbn && b.isbn.toLowerCase().includes(q)) ||
        (b.penerbit && b.penerbit.toLowerCase().includes(q)) ||
        (catName && catName.includes(q))
      );
    });
  }

  if (statusFilter.value === 'available') {
    list = list.filter(b => b.stok === undefined || b.stok > 0);
  }

  if (sortBy.value === 'judul-asc') {
    list = [...list].sort((a, b) => a.judul.localeCompare(b.judul));
  } else if (sortBy.value === 'judul-desc') {
    list = [...list].sort((a, b) => b.judul.localeCompare(a.judul));
  } else if (sortBy.value === 'tahun-desc') {
    list = [...list].sort((a, b) => (Number(b.tahun_terbit) || 0) - (Number(a.tahun_terbit) || 0));
  } else if (sortBy.value === 'tahun-asc') {
    list = [...list].sort((a, b) => (Number(a.tahun_terbit) || 0) - (Number(b.tahun_terbit) || 0));
  }

  return list;
});

const paginatedBooks = computed(() => {
  return filteredBooks.value.slice(0, displayedCount.value);
});

const toggleBookmark = (id: number) => {
  if (bookmarkedIds.value.has(id)) {
    bookmarkedIds.value.delete(id);
  } else {
    bookmarkedIds.value.add(id);
  }
};

const loadMore = () => {
  displayedCount.value += 8;
};

const syncFromRoute = () => {
  if (route.query.q !== undefined) {
    searchQuery.value = String(route.query.q || '');
  }
  if (route.query.kategori !== undefined) {
    selectedCategory.value = String(route.query.kategori || 'all');
  }
  if (route.query.status !== undefined) {
    statusFilter.value = String(route.query.status || 'all');
  }
  if (route.query.sort !== undefined) {
    sortBy.value = (route.query.sort as any) || 'default';
  }
};

const updateRouteQuery = () => {
  const query: Record<string, string> = {};
  if (searchQuery.value.trim()) query.q = searchQuery.value.trim();
  if (selectedCategory.value !== 'all') query.kategori = selectedCategory.value;
  if (statusFilter.value !== 'all') query.status = statusFilter.value;
  if (sortBy.value !== 'default') query.sort = sortBy.value;

  router.replace({ query });
};

watch([searchQuery, selectedCategory, statusFilter, sortBy], () => {
  updateRouteQuery();
});

watch(() => route.query, () => {
  syncFromRoute();
});

const resetFilters = () => {
  selectedCategory.value = 'all';
  searchQuery.value = '';
  statusFilter.value = 'all';
  sortBy.value = 'default';
  displayedCount.value = 8;
  updateRouteQuery();
};

const deriveCategoriesFromBooks = (bookList: Book[]): Category[] => {
  const catMap = new Map<string, Category>();
  
  for (const b of bookList) {
    const catObj = b.category || b.kategori;
    if (catObj && typeof catObj === 'object' && catObj.nama_kategori) {
      const key = catObj.nama_kategori.trim().toLowerCase();
      if (!catMap.has(key)) {
        catMap.set(key, {
          id: catObj.id || (catMap.size + 1),
          nama_kategori: catObj.nama_kategori.trim(),
          slug: catObj.slug || catObj.nama_kategori.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          deskripsi: `Koleksi ${catObj.nama_kategori.trim()}`,
          books_count: 0
        });
      }
    } else if (typeof catObj === 'string' && catObj.trim()) {
      const key = catObj.trim().toLowerCase();
      if (!catMap.has(key)) {
        catMap.set(key, {
          id: catMap.size + 1,
          nama_kategori: catObj.trim(),
          slug: catObj.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          deskripsi: `Koleksi ${catObj.trim()}`,
          books_count: 0
        });
      }
    }
  }

  return Array.from(catMap.values());
};

const loadData = async () => {
  loading.value = true;
  try {
    const [resBooks, resCat] = await Promise.all([
      getBooks(),
      getCategories()
    ]);

    if (resBooks?.data && Array.isArray(resBooks.data)) {
      books.value = resBooks.data;
    } else if (Array.isArray(resBooks)) {
      books.value = resBooks;
    }

    if (resCat?.data && Array.isArray(resCat.data) && resCat.data.length > 0) {
      categories.value = resCat.data;
    } else if (Array.isArray(resCat) && resCat.length > 0) {
      categories.value = resCat;
    }

    // Dynamic Fallback: If categories array is empty, derive from books
    if (categories.value.length === 0 && books.value.length > 0) {
      categories.value = deriveCategoriesFromBooks(books.value);
    }
  } catch (err) {
    console.error('Error fetching catalog data:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  syncFromRoute();
  loadData();
});
</script>

<style scoped>
.card-elevation {
  box-shadow: 0px 4px 12px rgba(10, 58, 90, 0.05);
  border: 1px solid #E2E8F0;
  transition: all 0.3s ease;
}

.card-elevation:hover {
  box-shadow: 0px 12px 24px rgba(10, 58, 90, 0.08);
  transform: translateY(-4px);
}

.font-fill {
  font-variation-settings: 'FILL' 1, 'wght' 400;
}
</style>

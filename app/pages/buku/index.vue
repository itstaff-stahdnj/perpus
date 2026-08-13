<template>
  <div class="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
    <!-- Main Content -->
    <main class="flex-1 max-w-container-max w-full mx-auto px-4 md:px-margin-desktop py-8 md:py-12">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-on-surface-variant font-label-md text-xs sm:text-sm mb-6">
        <NuxtLink to="/" class="hover:text-primary transition-colors">Beranda</NuxtLink>
        <span class="material-symbols-outlined text-[14px]">chevron_right</span>
        <span class="text-primary font-bold">Katalog Pustaka</span>
      </nav>

      <!-- Main Layout: Filters & Content -->
      <div class="flex flex-col lg:flex-row gap-gutter">
        <!-- Sidebar Filter (Desktop) -->
        <aside class="w-full lg:w-72 shrink-0 space-y-6 hidden lg:block">
          <div class="bg-white p-5 rounded-2xl border border-outline-variant/60 shadow-xs space-y-5">
            <div class="flex items-center justify-between border-b border-outline-variant pb-3">
              <h3 class="font-bold text-primary text-sm flex items-center gap-2">
                <span class="material-symbols-outlined text-base">filter_alt</span>
                <span>Filter Katalog</span>
              </h3>
              <button 
                class="text-[11px] text-secondary font-semibold hover:underline cursor-pointer"
                @click="resetFilters"
              >
                Reset Filter
              </button>
            </div>

            <!-- Category Filter List -->
            <div>
              <label class="block font-bold text-xs text-primary mb-2.5">Kategori Koleksi</label>
              <div class="space-y-1 max-h-60 overflow-y-auto pr-1">
                <button 
                  class="w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer"
                  :class="selectedCategory === 'all' ? 'bg-primary-container text-primary font-bold' : 'hover:bg-surface-container-high text-on-surface-variant'"
                  @click="selectedCategory = 'all'"
                >
                  <span>Semua Kategori</span>
                  <span class="text-[11px] opacity-75">({{ books.length }})</span>
                </button>
                <button 
                  v-for="cat in categories" 
                  :key="cat.id"
                  class="w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer"
                  :class="isCategoryActive(cat) ? 'bg-primary-container text-primary font-bold' : 'hover:bg-surface-container-high text-on-surface-variant'"
                  @click="selectedCategory = cat.nama_kategori"
                >
                  <span class="truncate pr-2">{{ cat.nama_kategori }}</span>
                  <span class="text-[11px] opacity-75 shrink-0">({{ getCategoryCount(cat) }})</span>
                </button>
              </div>
            </div>

            <!-- Kode DDC (Klasifikasi 3 Angka) Filter -->
            <div class="border-t border-outline-variant pt-4">
              <div class="flex items-center justify-between mb-2">
                <label class="font-bold text-xs text-primary flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-sm">tag</span>
                  <span>Kode DDC</span>
                </label>
                <span class="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono font-bold">3 Angka</span>
              </div>
              
              <div class="space-y-1 max-h-52 overflow-y-auto pr-1">
                <button 
                  class="w-full text-left px-3 py-1.5 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer"
                  :class="selectedDdc === 'all' ? 'bg-primary-container text-primary font-bold' : 'hover:bg-surface-container-high text-on-surface-variant'"
                  @click="selectedDdc = 'all'"
                >
                  <span>Semua Kode DDC</span>
                  <span class="text-[11px] opacity-75">({{ books.length }})</span>
                </button>
                <button 
                  v-for="opt in availableDdcOptions" 
                  :key="opt.code"
                  class="w-full text-left px-3 py-1.5 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer"
                  :class="selectedDdc === opt.code ? 'bg-primary-container text-primary font-bold' : 'hover:bg-surface-container-high text-on-surface-variant'"
                  @click="selectedDdc = opt.code"
                >
                  <span class="truncate pr-2 flex items-center gap-1.5">
                    <span class="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-200 shrink-0">{{ opt.code }}</span>
                    <span class="truncate text-[11px]">{{ opt.name }}</span>
                  </span>
                  <span class="text-[11px] opacity-75 shrink-0">({{ opt.count }})</span>
                </button>
              </div>
            </div>

            <!-- Availability Status Filter -->
            <div class="border-t border-outline-variant pt-4">
              <label class="block font-bold text-xs text-primary mb-2.5">Status Ketersediaan</label>
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-xs text-on-surface cursor-pointer">
                  <input type="radio" v-model="statusFilter" value="all" class="accent-primary" />
                  <span>Semua Status</span>
                </label>
                <label class="flex items-center gap-2 text-xs text-on-surface cursor-pointer">
                  <input type="radio" v-model="statusFilter" value="available" class="accent-primary" />
                  <span class="text-emerald-700 font-semibold">Tersedia di Rak</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <!-- Right Content Section -->
        <section class="flex-1 min-w-0">
          <!-- Top Control Bar -->
          <div class="bg-white p-4 rounded-2xl border border-outline-variant/60 shadow-xs mb-6 space-y-4">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
              <!-- Search Box -->
              <div class="relative w-full sm:w-80 md:w-96">
                <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  placeholder="Cari judul buku, penulis, atau ISBN..."
                  class="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
                <button v-if="searchQuery" @click="searchQuery = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <span class="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <!-- Controls: View Mode & Sorting & Mobile Filter Toggle -->
              <div class="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                <button 
                  class="lg:hidden px-3.5 py-2 bg-surface-container-high text-primary rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  @click="showMobileFilterModal = true"
                >
                  <span class="material-symbols-outlined text-base">filter_alt</span>
                  <span>Filter</span>
                </button>

                <!-- Sorting Select -->
                <div class="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <span class="hidden sm:inline">Urutkan:</span>
                  <select 
                    v-model="sortBy" 
                    class="bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer font-medium"
                  >
                    <option value="default">Default</option>
                    <option value="judul-asc">Judul (A - Z)</option>
                    <option value="judul-desc">Judul (Z - A)</option>
                    <option value="tahun-desc">Tahun (Terbaru)</option>
                    <option value="tahun-asc">Tahun (Terlama)</option>
                  </select>
                </div>

                <!-- Sync Button -->
                <SyncDataButton variant="header" />

                <!-- View Mode Buttons (Grid/List) -->
                <div class="flex items-center bg-surface-container-high p-1 rounded-xl gap-1">
                  <button 
                    class="p-1.5 rounded-lg transition-colors cursor-pointer"
                    :class="viewMode === 'grid' ? 'bg-white text-primary shadow-2xs' : 'text-on-surface-variant hover:text-primary'"
                    @click="viewMode = 'grid'"
                    title="Tampilan Grid"
                  >
                    <span class="material-symbols-outlined text-base">grid_view</span>
                  </button>
                  <button 
                    class="p-1.5 rounded-lg transition-colors cursor-pointer"
                    :class="viewMode === 'list' ? 'bg-white text-primary shadow-2xs' : 'text-on-surface-variant hover:text-primary'"
                    @click="viewMode = 'list'"
                    title="Tampilan List"
                  >
                    <span class="material-symbols-outlined text-base">view_list</span>
                  </button>
                </div>
              </div>
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
          <div v-else-if="viewMode === 'grid'" v-auto-animate class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter mb-12">
            <div 
              v-for="(book, index) in paginatedBooks" 
              :key="book.id" 
              class="bg-white rounded-2xl overflow-hidden shadow-[0px_4px_20px_rgba(10,58,90,0.06)] border border-outline-variant/60 hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <!-- Book Cover Container -->
                <NuxtLink :to="getBookUrl(book)" class="relative aspect-[3/4] bg-surface-container-high overflow-hidden block">
                  <img 
                    :src="getBookCover(book, index)" 
                    :alt="book.judul" 
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    @error="handleImageError($event, index)"
                  />
                  <div class="absolute top-3 left-3">
                    <span class="bg-primary-container/90 text-on-primary-container px-3 py-1 rounded-full text-caption font-label-md backdrop-blur-sm shadow-sm">
                      {{ book.tahun_terbit || 'STAH DNJ' }}
                    </span>
                  </div>

                  <!-- Tombol Favorit / Wishlist Animasi (HANYA DITAMPILKAN JIKA USER SUDAN LOGIN) -->
                  <button 
                    v-if="tokenCookie"
                    @click.stop.prevent="toggleWishlist(book)"
                    class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md flex items-center justify-center shadow-lg hover:scale-125 active:scale-95 transition-all duration-300 cursor-pointer z-10"
                    :title="isWishlisted(book.id) ? 'Hapus dari favorit' : 'Tambah ke favorit'"
                  >
                    <span 
                      class="text-base transition-transform duration-300"
                      :class="isWishlisted(book.id) ? 'scale-110 animate-bounce' : 'scale-100 opacity-60 hover:opacity-100'"
                    >
                      {{ isWishlisted(book.id) ? '❤️' : '🤍' }}
                    </span>
                  </button>
                </NuxtLink>

                <div class="p-5">
                  <div class="flex items-center gap-1.5 flex-wrap mb-1.5">
                    <span v-if="getBookCategoryName(book)" class="inline-block text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary-fixed/80 px-2 py-0.5 rounded-md">
                      {{ getBookCategoryName(book) }}
                    </span>
                    <span v-if="getBookDdcCode(book)" class="inline-block font-mono text-[10px] font-extrabold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded-md border border-amber-200" title="Kode DDC (3 Angka)">
                      DDC {{ getBookDdcCode(book) }}
                    </span>
                  </div>
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

              <div class="p-5 pt-0 space-y-2">
                <div v-if="isEbook(book)" class="flex items-center gap-1.5 mb-2 text-xs text-blue-700 dark:text-blue-300 font-extrabold bg-blue-50 dark:bg-blue-950/50 px-2 py-1 rounded-md border border-blue-200 dark:border-blue-800">
                  <span>⚡</span>
                  <span>Akses Digital (Online)</span>
                </div>
                <div v-else class="flex items-center gap-1.5 mb-2">
                  <span class="w-2 h-2 rounded-full" :class="(book.stok === undefined || book.stok > 0) ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                  <span class="text-caption font-label-md font-semibold" :class="(book.stok === undefined || book.stok > 0) ? 'text-emerald-700' : 'text-rose-700'">
                    {{ (book.stok === undefined || book.stok > 0) ? `Tersedia (${book.stok ?? 1})` : 'Tidak Tersedia (Dipinjam)' }}
                  </span>
                </div>

                <!-- JIKA BUKU E-BOOK DIGITAL -->
                <div v-if="isEbook(book)" class="space-y-1.5">
                  <a 
                    v-if="tokenCookie"
                    :href="`https://portal-perpus.stahdnj.ac.id/read/book/${book.id}`"
                    class="block w-full py-2 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 text-white rounded-lg font-label-md text-[11px] font-extrabold text-center shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>📖 Baca E-Book Digital</span>
                  </a>
                  <a 
                    v-else
                    href="https://portal-perpus.stahdnj.ac.id/sso/perpus"
                    class="block w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-label-md text-[11px] font-extrabold text-center shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>🔑 Login untuk Membaca E-Book Digital</span>
                  </a>
                </div>

                <!-- Action Buttons Buku Fisik (JIKA SUDAH LOGIN) -->
                <div v-else-if="tokenCookie" class="space-y-1.5">
                  <div class="grid grid-cols-2 gap-1.5">
                    <button 
                      v-if="isCampusNetwork"
                      @click="openBorrowModal(book)"
                      class="bg-[#C89B3C] text-white py-2 rounded-lg font-label-md text-[11px] hover:brightness-105 transition-all font-bold text-center flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                      title="Pinjam Buku Mandiri"
                    >
                      <span class="material-symbols-outlined text-xs">bookmark_add</span>
                      <span>Pinjam</span>
                    </button>

                    <button 
                      v-else
                      disabled
                      class="col-span-2 py-2 px-2 rounded-lg bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400 font-label-md text-[10px] font-extrabold text-center flex items-center justify-center gap-1 cursor-not-allowed border border-slate-300 dark:border-zinc-700 transition-all duration-500"
                      :title="currentSelfBorrowText"
                    >
                      <span class="material-symbols-outlined text-xs shrink-0 text-rose-500 animate-pulse">block</span>
                      <span class="truncate transition-all duration-300">{{ currentSelfBorrowText }}</span>
                    </button>

                    <button 
                      v-if="isCampusNetwork"
                      @click="toggleCart(book)"
                      class="py-2 rounded-lg font-label-md text-[11px] transition-colors font-bold text-center flex items-center justify-center gap-1 cursor-pointer"
                      :class="isInCart(book.id) ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'"
                      :title="isInCart(book.id) ? 'Hapus dari keranjang' : 'Tampung ke keranjang untuk meminjam lebih dari 1 buku sekaligus'"
                    >
                      <span class="material-symbols-outlined text-xs text-amber-700">shopping_cart</span>
                      <span>{{ isInCart(book.id) ? 'Batal' : 'Tampung' }}</span>
                    </button>
                  </div>
                </div>

                <a 
                  v-else
                  href="https://portal-perpus.stahdnj.ac.id/sso/perpus"
                  class="block w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-label-md text-[11px] font-extrabold text-center shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>🔑 Login untuk Meminjam</span>
                </a>

                <NuxtLink 
                  :to="getBookUrl(book)" 
                  class="block w-full py-1.5 rounded-lg border border-slate-300 text-slate-700 font-label-md text-[11px] hover:bg-slate-50 transition-colors font-semibold text-center mt-1"
                >
                  Detail Katalog
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Book List View -->
          <div v-else v-auto-animate class="space-y-4 mb-12">
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
                  <div class="flex items-center gap-1.5 flex-wrap mb-1">
                    <span class="text-[10px] font-bold uppercase text-secondary bg-secondary-fixed px-2 py-0.5 rounded inline-block">
                      {{ getBookCategoryName(book) ? `${getBookCategoryName(book)} • ` : '' }}{{ book.tahun_terbit || '2021' }}
                    </span>
                    <span v-if="getBookDdcCode(book)" class="font-mono text-[10px] font-extrabold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200 inline-block" title="Kode DDC (3 Angka)">
                      DDC {{ getBookDdcCode(book) }}
                    </span>
                  </div>
                  <NuxtLink :to="getBookUrl(book)" class="font-headline-md text-base text-primary font-bold leading-tight mb-1 hover:text-secondary block">
                    {{ book.judul }}
                  </NuxtLink>
                  <p class="text-xs text-on-surface-variant">✍️ {{ book.penulis || 'Penulis Tidak Diketahui' }} • Penerbit: {{ book.penerbit || 'Pustaka STAH' }}</p>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                <div v-if="isEbook(book)" class="flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-300 font-extrabold bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                  <span>⚡</span>
                  <span>Akses Digital (Online)</span>
                </div>
                <div v-else class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full" :class="(book.stok === undefined || book.stok > 0) ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                  <span class="text-xs font-semibold" :class="(book.stok === undefined || book.stok > 0) ? 'text-emerald-700' : 'text-rose-700'">
                    {{ (book.stok === undefined || book.stok > 0) ? `Tersedia (${book.stok ?? 1})` : 'Sedang Dipinjam' }}
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <!-- JIKA BUKU E-BOOK DIGITAL -->
                  <template v-if="isEbook(book)">
                    <a 
                      v-if="tokenCookie"
                      :href="`https://portal-perpus.stahdnj.ac.id/read/book/${book.id}`"
                      class="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 text-white px-3.5 py-2 rounded-lg font-label-md text-xs font-extrabold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>📖 Baca E-Book Digital</span>
                    </a>
                    <a 
                      v-else
                      href="https://portal-perpus.stahdnj.ac.id/sso/perpus"
                      class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3.5 py-2 rounded-lg font-label-md text-xs font-extrabold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>🔑 Login untuk Membaca E-Book Digital</span>
                    </a>
                  </template>

                  <!-- BUKU FISIK (JIKA USER LOGIN) -->
                  <template v-else-if="tokenCookie">
                    <button 
                      v-if="isCampusNetwork"
                      @click="openBorrowModal(book)"
                      class="bg-[#C89B3C] text-white px-3 py-2 rounded-lg font-label-md text-xs hover:brightness-105 transition-all font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <span class="material-symbols-outlined text-sm">bookmark_add</span>
                      <span>Pinjam Mandiri</span>
                    </button>

                    <button 
                      v-else
                      disabled
                      class="px-3 py-2 rounded-lg bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400 font-label-md text-[11px] font-extrabold flex items-center gap-1.5 cursor-not-allowed border border-slate-300 dark:border-zinc-700 transition-all duration-500"
                      :title="currentSelfBorrowText"
                    >
                      <span class="material-symbols-outlined text-sm shrink-0 text-rose-500 animate-pulse">wifi_off</span>
                      <span class="transition-all duration-300">{{ currentSelfBorrowText }}</span>
                    </button>

                    <button 
                      v-if="isCampusNetwork"
                      @click="toggleCart(book)"
                      class="px-3 py-2 rounded-lg font-label-md text-xs transition-colors font-bold flex items-center gap-1 cursor-pointer border"
                      :class="isInCart(book.id) ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'"
                      :title="isInCart(book.id) ? 'Hapus dari keranjang' : 'Tampung ke keranjang untuk meminjam lebih dari 1 buku sekaligus'"
                    >
                      <span class="material-symbols-outlined text-sm text-amber-700">shopping_cart</span>
                      <span>{{ isInCart(book.id) ? 'Batal Tampung' : 'Tampung' }}</span>
                    </button>
                  </template>

                  <!-- BUKU FISIK (BELUM LOGIN) -->
                  <a 
                    v-else
                    href="https://portal-perpus.stahdnj.ac.id/sso/perpus"
                    class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3.5 py-2 rounded-lg font-label-md text-xs font-extrabold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>🔑 Login untuk Meminjam</span>
                  </a>

                  <!-- Tombol Favorit / Wishlist Animasi List View (HANYA DITAMPILKAN JIKA USER SUDAH LOGIN) -->
                  <button 
                    v-if="tokenCookie"
                    @click.stop.prevent="toggleWishlist(book)"
                    class="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-base shadow-xs hover:scale-125 active:scale-95 transition-all duration-300 cursor-pointer shrink-0"
                    :title="isWishlisted(book.id) ? 'Hapus dari favorit' : 'Tambah ke favorit'"
                  >
                    <span 
                      class="transition-transform duration-300"
                      :class="isWishlisted(book.id) ? 'scale-110 animate-bounce' : 'scale-100 opacity-60 hover:opacity-100'"
                    >
                      {{ isWishlisted(book.id) ? '❤️' : '🤍' }}
                    </span>
                  </button>

                  <NuxtLink 
                    :to="getBookUrl(book)" 
                    class="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 font-label-md text-xs hover:bg-slate-50 transition-colors font-semibold"
                  >
                    Detail
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Load More Button -->
          <div v-if="displayedCount < filteredBooks.length" class="text-center">
            <button 
              class="bg-surface-container-high text-primary hover:bg-surface-container-highest font-bold px-8 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-2xs active:scale-95 cursor-pointer"
              @click="displayedCount += itemsPerPage"
            >
              Tampilkan Lebih Banyak Buku (Sisa {{ filteredBooks.length - displayedCount }})
            </button>
          </div>
        </section>
      </div>
    </main>

    <!-- Modal 1: Pinjam Mandiri Modal -->
    <div v-if="showBorrowModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" @click.self="showBorrowModal = false">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in duration-200 text-slate-800">
        <button class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors" @click="showBorrowModal = false">
          <span class="material-symbols-outlined text-xl">close</span>
        </button>

        <div class="flex items-center gap-2 mb-4">
          <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-xl">bookmark_add</span>
          </div>
          <div>
            <h3 class="font-bold text-slate-900 text-base sm:text-lg">Konfirmasi Pinjam Mandiri</h3>
            <p class="text-[11px] text-slate-500">Pustaka Utama STAH DNJ</p>
          </div>
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex gap-3 mb-4">
          <div class="w-12 h-16 rounded bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
            <img v-if="selectedBookForBorrow?.cover_image" :src="selectedBookForBorrow.cover_image" alt="Cover" class="w-full h-full object-cover" />
            <span v-else class="material-symbols-outlined text-2xl text-slate-400 flex items-center justify-center h-full">book</span>
          </div>
          <div class="min-w-0 flex flex-col justify-center text-xs">
            <h4 class="font-bold text-slate-900 line-clamp-2">{{ selectedBookForBorrow?.judul }}</h4>
            <p class="text-slate-500 mt-0.5">{{ selectedBookForBorrow?.penulis || 'STAH DNJ' }}</p>
          </div>
        </div>

        <div class="space-y-3 text-xs mb-6">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Durasi Peminjaman (Hari)</label>
            <select v-model="borrowDuration" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-primary">
              <option :value="3">3 Hari</option>
              <option :value="5">5 Hari</option>
              <option :value="7">7 Hari (Maksimal Standar)</option>
            </select>
          </div>

          <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex justify-between items-center">
            <span>Estimasi Tenggat Pengembalian:</span>
            <strong class="font-mono font-bold text-amber-950">{{ calculatedDueDate }}</strong>
          </div>
        </div>

        <div class="flex justify-end gap-2.5">
          <button class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer" @click="showBorrowModal = false">
            Batal
          </button>
          <button 
            :disabled="submittingBorrow"
            class="px-5 py-2 bg-[#C89B3C] hover:brightness-105 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95" 
            @click="submitBorrow"
          >
            <span v-if="submittingBorrow" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>{{ submittingBorrow ? 'Memproses...' : 'Konfirmasi Pinjam Buku' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 2: Reservasi Antrean Modal -->
    <div v-if="showReservationModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" @click.self="showReservationModal = false">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in duration-200 text-slate-800">
        <button class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors" @click="showReservationModal = false">
          <span class="material-symbols-outlined text-xl">close</span>
        </button>

        <div class="flex items-center gap-2 mb-4">
          <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-xl">schedule</span>
          </div>
          <div>
            <h3 class="font-bold text-slate-900 text-base sm:text-lg">Konfirmasi Reservasi Antrean</h3>
            <p class="text-[11px] text-slate-500">Pustaka Utama STAH DNJ</p>
          </div>
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex gap-3 mb-4">
          <div class="w-12 h-16 rounded bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
            <img v-if="selectedBookForReservation?.cover_image" :src="selectedBookForReservation.cover_image" alt="Cover" class="w-full h-full object-cover" />
            <span v-else class="material-symbols-outlined text-2xl text-slate-400 flex items-center justify-center h-full">book</span>
          </div>
          <div class="min-w-0 flex flex-col justify-center text-xs">
            <h4 class="font-bold text-slate-900 line-clamp-2">{{ selectedBookForReservation?.judul }}</h4>
            <p class="text-slate-500 mt-0.5">{{ selectedBookForReservation?.penulis || 'STAH DNJ' }}</p>
          </div>
        </div>

        <p class="text-xs text-slate-600 leading-relaxed mb-6">
          Pengajuan reservasi akan mencatatkan Anda dalam daftar antrean pengambilan buku. Anda akan dinotifikasi saat pustakawan telah menyiapkan buku tersebut.
        </p>

        <div class="flex justify-end gap-2.5">
          <button class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer" @click="showReservationModal = false">
            Batal
          </button>
          <button 
            :disabled="submittingReservation"
            class="px-5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95" 
            @click="submitReservation"
          >
            <span v-if="submittingReservation" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>{{ submittingReservation ? 'Memproses...' : 'Konfirmasi Reservasi' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 3: Mobile Filter Modal -->
    <div v-if="showMobileFilterModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4" @click.self="showMobileFilterModal = false">
      <div class="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col p-5 shadow-2xl relative border border-slate-200 animate-in slide-in-from-bottom duration-200 text-slate-800">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <h3 class="font-bold text-primary text-base flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">filter_alt</span>
            <span>Filter Katalog Pustaka</span>
          </h3>
          <button class="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer" @click="showMobileFilterModal = false">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto space-y-5 pr-1 text-xs">
          <!-- Kategori -->
          <div>
            <label class="block font-bold text-xs text-primary mb-2">Kategori Koleksi</label>
            <select v-model="selectedCategory" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-xs focus:outline-none focus:border-primary">
              <option value="all">Semua Kategori ({{ books.length }})</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.nama_kategori">
                {{ cat.nama_kategori }} ({{ getCategoryCount(cat) }})
              </option>
            </select>
          </div>

          <!-- Kode DDC -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="font-bold text-xs text-primary flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">tag</span>
                <span>Kode DDC (Klasifikasi 3 Angka)</span>
              </label>
              <span class="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">3 Digit</span>
            </div>
            <select v-model="selectedDdc" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:border-primary">
              <option value="all">Semua Kode DDC (3 Angka)</option>
              <option v-for="opt in availableDdcOptions" :key="opt.code" :value="opt.code">
                {{ opt.code }} - {{ opt.name }} ({{ opt.count }})
              </option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="block font-bold text-xs text-primary mb-2">Status Ketersediaan</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                <input type="radio" v-model="statusFilter" value="all" class="accent-primary" />
                <span>Semua Status</span>
              </label>
              <label class="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                <input type="radio" v-model="statusFilter" value="available" class="accent-primary" />
                <span class="text-emerald-700 font-semibold">Tersedia di Rak</span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-4 border-t border-slate-200 mt-4">
          <button class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer" @click="resetFilters(); showMobileFilterModal = false">
            Reset Filter
          </button>
          <button class="flex-1 py-2.5 bg-primary text-white font-bold rounded-xl text-xs cursor-pointer shadow-md" @click="showMobileFilterModal = false">
            Terapkan Filter ({{ filteredBooks.length }})
          </button>
        </div>
      </div>
    </div>

    <!-- Floating Multi-Book Cart Button -->
    <button 
      v-if="cartCount > 0"
      @click="showCartModal = true"
      class="fixed bottom-20 md:bottom-8 right-6 z-40 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95 border-2 border-amber-400 cursor-pointer animate-bounce"
    >
      <span class="material-symbols-outlined text-2xl text-amber-400">shopping_cart</span>
      <div class="text-left leading-tight">
        <p class="font-extrabold text-xs text-white">Keranjang Tampungan</p>
        <p class="text-[10px] text-amber-300 font-bold">{{ cartCount }} Buku Terpilih — Pinjam Sekaligus</p>
      </div>
    </button>

    <!-- Multi-Book Cart Borrowing Modal -->
    <CartBorrowModal v-model="showCartModal" @borrowed-success="loadData" />
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

import { usePustakaCart } from '../../composables/usePustakaCart';
import { useCampusNetwork } from '../../composables/useCampusNetwork';
import { useBookCover } from '../../composables/useBookCover';
import { usePdfCache } from '../../composables/usePdfCache';
import { useIndexedDB } from '../../composables/useIndexedDB';
import CartBorrowModal from '../../components/CartBorrowModal.vue';

const route = useRoute();
const router = useRouter();

const { getBooks, getCategories, selfBorrow, createReservation, tokenCookie, getWishlist, addToWishlist, removeFromWishlist } = usePustakaApi();
const { cart, cartCount, isInCart, toggleCart, loadCartFromStorage } = usePustakaCart();
const { isCampusNetwork, currentSelfBorrowText } = useCampusNetwork();
const { fallbackCover, getBookCoverUrl, handleImageError: handleCoverImageError, isEbookBook } = useBookCover();
const { prefetchCatalogPdfList } = usePdfCache();
const { saveCatalogCache, getCatalogCache } = useIndexedDB();

const wishlistedIds = ref<Set<number>>(new Set());

const isWishlisted = (id: number | string): boolean => {
  return wishlistedIds.value.has(Number(id));
};

const toggleWishlist = async (b: Book) => {
  if (!tokenCookie.value) return;

  const bookId = Number(b.id);
  if (wishlistedIds.value.has(bookId)) {
    wishlistedIds.value.delete(bookId);
    if (process.client) {
      localStorage.setItem('pustaka_wishlist', JSON.stringify(Array.from(wishlistedIds.value)));
    }
    const res = await removeFromWishlist(bookId).catch(() => null);
    if (res && !res.success) {
      wishlistedIds.value.add(bookId);
      if (process.client) {
        localStorage.setItem('pustaka_wishlist', JSON.stringify(Array.from(wishlistedIds.value)));
      }
    }
  } else {
    wishlistedIds.value.add(bookId);
    if (process.client) {
      localStorage.setItem('pustaka_wishlist', JSON.stringify(Array.from(wishlistedIds.value)));
    }
    const res = await addToWishlist(bookId).catch(() => null);
    if (res && !res.success) {
      wishlistedIds.value.delete(bookId);
      if (process.client) {
        localStorage.setItem('pustaka_wishlist', JSON.stringify(Array.from(wishlistedIds.value)));
      }
    }
  }
};

const loadWishlistData = async () => {
  // 1. Instant local restore
  if (process.client) {
    try {
      const saved = localStorage.getItem('pustaka_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          wishlistedIds.value = new Set(parsed.map((id: any) => Number(id)));
        }
      }
    } catch (e) {}
  }

  // 2. Fetch from backend API
  if (!tokenCookie.value) return;
  try {
    const res = await getWishlist();
    if (res?.data && Array.isArray(res.data)) {
      const ids = res.data.map((w: any) => Number(w.book_id || w.id)).filter(Boolean);
      if (ids.length > 0) {
        wishlistedIds.value = new Set(ids);
        if (process.client) {
          localStorage.setItem('pustaka_wishlist', JSON.stringify(ids));
        }
      }
    }
  } catch (e) {}
};

const loading = ref(true);
const searchQuery = ref('');
const selectedCategory = ref('all');
const selectedDdc = ref('all');
const statusFilter = ref('all');
const sortBy = ref<'default' | 'judul-asc' | 'judul-desc' | 'tahun-desc' | 'tahun-asc'>('default');
const viewMode = ref<'grid' | 'list'>('grid');
const showMobileFilterModal = ref(false);
const showCartModal = ref(false);

const books = ref<Book[]>([]);
const categories = ref<Category[]>([]);
const bookmarkedIds = ref<Set<number>>(new Set());

const itemsPerPage = 24;
const displayedCount = ref(500);

// Modals State
const showBorrowModal = ref(false);
const showReservationModal = ref(false);
const selectedBookForBorrow = ref<Book | null>(null);
const selectedBookForReservation = ref<Book | null>(null);
const borrowDuration = ref(7);
const submittingBorrow = ref(false);
const submittingReservation = ref(false);

const calculatedDueDate = computed(() => {
  const d = new Date();
  d.setDate(d.getDate() + Number(borrowDuration.value));
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
});

const openBorrowModal = (b: Book) => {
  if (!tokenCookie.value) {
    if (process.client) {
      window.location.href = 'https://portal-perpus.stahdnj.ac.id/sso/perpus';
    }
    return;
  }
  selectedBookForBorrow.value = b;
  showBorrowModal.value = true;
};

const openReservationModal = (b: Book) => {
  if (!tokenCookie.value) {
    if (process.client) {
      window.location.href = 'https://portal-perpus.stahdnj.ac.id/sso/perpus';
    }
    return;
  }
  selectedBookForReservation.value = b;
  showReservationModal.value = true;
};

const submitBorrow = async () => {
  if (!selectedBookForBorrow.value) return;
  submittingBorrow.value = true;
  try {
    const res = await selfBorrow(selectedBookForBorrow.value.id, borrowDuration.value);
    showBorrowModal.value = false;
    alert(res.message);
    if (res.success) {
      loadData();
    }
  } finally {
    submittingBorrow.value = false;
  }
};

const submitReservation = async () => {
  if (!selectedBookForReservation.value) return;
  submittingReservation.value = true;
  try {
    const res = await createReservation(selectedBookForReservation.value.id);
    showReservationModal.value = false;
    alert(res.message);
    if (res.success) {
      loadData();
    }
  } finally {
    submittingReservation.value = false;
  }
};

const sortLabels: Record<string, string> = {
  'default': 'Default',
  'judul-asc': 'Judul (A - Z)',
  'judul-desc': 'Judul (Z - A)',
  'tahun-desc': 'Tahun (Terbaru)',
  'tahun-asc': 'Tahun (Terlama)'
};

const handleImageError = (event: Event, bookOrIndex?: any) => {
  let b: any = null;
  if (typeof bookOrIndex === 'object') {
    b = bookOrIndex;
  } else if (typeof bookOrIndex === 'number' && paginatedBooks.value[bookOrIndex]) {
    b = paginatedBooks.value[bookOrIndex];
  }
  handleCoverImageError(event, b);
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

const standardDdcMainClasses = [
  { code: '000', name: 'Karya Umum & Informasi' },
  { code: '100', name: 'Filsafat & Psikologi' },
  { code: '200', name: 'Agama' },
  { code: '294', name: 'Agama Hindu / Veda' },
  { code: '300', name: 'Ilmu-Ilmu Sosial' },
  { code: '400', name: 'Bahasa & Linguistik' },
  { code: '500', name: 'Sains & Ilmu Murni' },
  { code: '600', name: 'Teknologi & Terapan' },
  { code: '700', name: 'Kesenian & Olahraga' },
  { code: '800', name: 'Kesusastraan & Sastra' },
  { code: '900', name: 'Sejarah & Geografi' }
];

const getBookDdcCode = (b: Book): string => {
  if (!b) return '';
  const raw = String(
    (b as any).ddc ||
    (b as any).kode_ddc ||
    (b as any).klasifikasi ||
    (b as any).nomor_panggil ||
    (b as any).no_panggil ||
    (b as any).call_number ||
    (typeof b.category === 'object' ? b.category?.nama_kategori : b.category) ||
    (typeof b.kategori === 'object' ? b.kategori?.nama_kategori : b.kategori) ||
    ''
  );

  const match = raw.match(/\b(\d{3})\b/) || raw.match(/(\d{3})/);
  if (match) {
    return match[1];
  }

  const shortMatch = raw.match(/\b(\d{1,2})\b/);
  if (shortMatch) {
    return shortMatch[1].padStart(3, '0');
  }

  return '';
};

const isBookMatchingDdc = (b: Book, targetDdc: string): boolean => {
  if (!targetDdc || targetDdc === 'all') return true;
  const bookDdc = getBookDdcCode(b);
  if (!bookDdc) return false;

  if (bookDdc === targetDdc) return true;

  if (targetDdc.endsWith('00')) {
    return bookDdc.charAt(0) === targetDdc.charAt(0);
  }

  return false;
};

const availableDdcOptions = computed(() => {
  const countMap = new Map<string, number>();

  for (const std of standardDdcMainClasses) {
    countMap.set(std.code, 0);
  }

  if (books.value && Array.isArray(books.value)) {
    for (const b of books.value) {
      const code = getBookDdcCode(b);
      if (code) {
        countMap.set(code, (countMap.get(code) || 0) + 1);
        const hundred = `${code.charAt(0)}00`;
        if (hundred !== code && countMap.has(hundred)) {
          countMap.set(hundred, (countMap.get(hundred) || 0) + 1);
        }
      }
    }
  }

  const result: { code: string; name: string; count: number }[] = [];
  const processed = new Set<string>();

  for (const std of standardDdcMainClasses) {
    result.push({
      code: std.code,
      name: std.name,
      count: countMap.get(std.code) || 0
    });
    processed.add(std.code);
  }

  for (const [code, count] of countMap.entries()) {
    if (!processed.has(code) && /^\d{3}$/.test(code) && count > 0) {
      result.push({
        code,
        name: `Klasifikasi ${code}`,
        count
      });
      processed.add(code);
    }
  }

  return result.sort((a, b) => a.code.localeCompare(b.code));
});

const getBookCover = (b: Book) => {
  return getBookCoverUrl(b);
};

const slugifyTitle = (text: string): string => {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

const isEbook = (b: Book): boolean => {
  if (!b) return false;
  const bAny = b as any;
  if (bAny.is_ebook || bAny.is_digital) return true;
  const catName = getBookCategoryName(b);
  return /e-?book|digital|elektronik/i.test(catName);
};

const getBookUrl = (b: Book) => {
  const titleSlug = slugifyTitle(b.judul);
  return `/buku/${titleSlug}-${b.id}`;
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

  if (selectedDdc.value !== 'all') {
    list = list.filter(b => isBookMatchingDdc(b, selectedDdc.value));
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(b => {
      const catName = getBookCategoryName(b).toLowerCase();
      const ddcCode = getBookDdcCode(b);
      return (
        (b.judul && b.judul.toLowerCase().includes(q)) ||
        (b.penulis && b.penulis.toLowerCase().includes(q)) ||
        (b.isbn && b.isbn.toLowerCase().includes(q)) ||
        (b.penerbit && b.penerbit.toLowerCase().includes(q)) ||
        (catName && catName.includes(q)) ||
        (ddcCode && ddcCode.includes(q))
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

const syncFromRoute = () => {
  if (route.query.q !== undefined) {
    searchQuery.value = String(route.query.q || '');
  }
  if (route.query.kategori !== undefined) {
    selectedCategory.value = String(route.query.kategori || 'all');
  }
  if (route.query.ddc !== undefined) {
    selectedDdc.value = String(route.query.ddc || 'all');
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
  if (selectedDdc.value !== 'all') query.ddc = selectedDdc.value;
  if (statusFilter.value !== 'all') query.status = statusFilter.value;
  if (sortBy.value !== 'default') query.sort = sortBy.value;

  router.replace({ query });
};

watch([searchQuery, selectedCategory, selectedDdc, statusFilter, sortBy], () => {
  updateRouteQuery();
});

watch(() => route.query, () => {
  syncFromRoute();
});

const resetFilters = () => {
  selectedCategory.value = 'all';
  selectedDdc.value = 'all';
  searchQuery.value = '';
  statusFilter.value = 'all';
  sortBy.value = 'default';
  displayedCount.value = books.value.length || 500;
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
      getBooks({ per_page: 1000, limit: 1000, all: 1 }).catch(() => null),
      getCategories().catch(() => null)
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

    // Jika berhasil ambil dari server, simpan ke IndexedDB untuk akses offline
    if (books.value.length > 0) {
      saveCatalogCache('catalog_books', books.value);
    }
    if (categories.value.length > 0) {
      saveCatalogCache('catalog_categories', categories.value);
    }

    // Jika gagal / offline, ambil dari cache IndexedDB
    if (books.value.length === 0) {
      const cachedBooks = await getCatalogCache<Book[]>('catalog_books');
      if (cachedBooks && cachedBooks.length > 0) {
        books.value = cachedBooks;
      }
    }
    if (categories.value.length === 0) {
      const cachedCats = await getCatalogCache<Category[]>('catalog_categories');
      if (cachedCats && cachedCats.length > 0) {
        categories.value = cachedCats;
      }
    }

    if (books.value.length > 0) {
      displayedCount.value = Math.max(500, books.value.length);
    }

    if (categories.value.length === 0 && books.value.length > 0) {
      categories.value = deriveCategoriesFromBooks(books.value);
    }

    // Pre-fetch E-Books into IndexedDB for instant offline reading
    if (books.value.length > 0) {
      prefetchCatalogPdfList(books.value);
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
  loadWishlistData();
});
</script>

<style scoped>
.font-fill {
  font-variation-settings: 'FILL' 1, 'wght' 400;
}
</style>

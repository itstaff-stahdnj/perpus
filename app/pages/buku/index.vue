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
          <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter mb-12">
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

              <div class="p-5 pt-0 space-y-2">
                <div class="flex items-center gap-1.5 mb-2">
                  <span class="w-2 h-2 rounded-full" :class="(book.stok === undefined || book.stok > 0) ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                  <span class="text-caption font-label-md font-semibold" :class="(book.stok === undefined || book.stok > 0) ? 'text-emerald-700' : 'text-rose-700'">
                    {{ (book.stok === undefined || book.stok > 0) ? `Tersedia (${book.stok ?? 1})` : 'Tidak Tersedia (Dipinjam)' }}
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-1.5">
                  <button 
                    @click="openBorrowModal(book)"
                    class="bg-[#C89B3C] text-white py-2 rounded-lg font-label-md text-[11px] hover:brightness-105 transition-all font-bold text-center flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                    title="Pinjam Buku Mandiri"
                  >
                    <span class="material-symbols-outlined text-xs">bookmark_add</span>
                    <span>Pinjam</span>
                  </button>

                  <button 
                    @click="openReservationModal(book)"
                    class="bg-primary text-white py-2 rounded-lg font-label-md text-[11px] hover:bg-primary-container transition-colors font-bold text-center flex items-center justify-center gap-1 cursor-pointer"
                    title="Reservasi Antrean Buku"
                  >
                    <span class="material-symbols-outlined text-xs">schedule</span>
                    <span>Reservasi</span>
                  </button>
                </div>

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

              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full" :class="(book.stok === undefined || book.stok > 0) ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                  <span class="text-xs font-semibold" :class="(book.stok === undefined || book.stok > 0) ? 'text-emerald-700' : 'text-rose-700'">
                    {{ (book.stok === undefined || book.stok > 0) ? `Tersedia (${book.stok ?? 1})` : 'Sedang Dipinjam' }}
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <button 
                    @click="openBorrowModal(book)"
                    class="bg-[#C89B3C] text-white px-3 py-2 rounded-lg font-label-md text-xs hover:brightness-105 transition-all font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span class="material-symbols-outlined text-sm">bookmark_add</span>
                    <span>Pinjam Mandiri</span>
                  </button>

                  <button 
                    @click="openReservationModal(book)"
                    class="bg-primary text-white px-3 py-2 rounded-lg font-label-md text-xs hover:bg-primary-container transition-colors font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span class="material-symbols-outlined text-sm">schedule</span>
                    <span>Reservasi</span>
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

const { getBooks, getCategories, selfBorrow, createReservation, tokenCookie } = usePustakaApi();

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
.font-fill {
  font-variation-settings: 'FILL' 1, 'wght' 400;
}
</style>

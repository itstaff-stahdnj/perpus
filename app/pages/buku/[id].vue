<template>
  <div class="min-h-screen bg-[#F8F9FD] text-on-surface font-body-md">
    <main class="max-w-[1340px] mx-auto px-4 sm:px-6 pt-20 md:pt-24 pb-8 md:pb-12">
      <!-- Breadcrumb -->
      <nav class="mb-6 flex items-center gap-2 text-slate-600 font-label-md text-xs sm:text-sm">
        <NuxtLink class="hover:text-primary transition-colors" to="/">Home</NuxtLink>
        <span class="material-symbols-outlined text-[14px]">chevron_right</span>
        <NuxtLink class="hover:text-primary transition-colors" to="/buku">Detail Result</NuxtLink>
        <span class="material-symbols-outlined text-[14px]">chevron_right</span>
        <span class="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-xs">{{ book?.judul || 'Detail Buku' }}</span>
      </nav>

      <!-- Loading State -->
      <div v-if="loading" class="py-24 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div class="inline-block w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p class="font-body-md text-slate-600 text-sm">Memuat rincian pustaka dari sistem OPAC STAH DNJ...</p>
      </div>

      <!-- Error / Not Found State -->
      <div v-else-if="!book" class="bg-white border border-slate-200 p-12 rounded-2xl text-center my-8 shadow-sm">
        <span class="material-symbols-outlined text-6xl text-slate-400 mb-4">menu_book</span>
        <h3 class="font-headline-md text-primary mb-2 font-bold">Buku Tidak Ditemukan</h3>
        <p class="font-body-md text-slate-600 max-w-md mx-auto mb-6 text-sm">
          Maaf, data koleksi pustaka dengan parameter tersebut tidak ditemukan pada sistem database.
        </p>
        <NuxtLink class="bg-primary text-white px-6 py-2.5 rounded-xl font-label-md text-sm hover:bg-primary-container transition-colors inline-block font-bold" to="/buku">
          Kembali ke Katalog Utama
        </NuxtLink>
      </div>

      <!-- OPAC Book Detail View -->
      <div v-else class="flex flex-col lg:flex-row gap-8 items-start">
        <!-- Left Column: Cover & Primary Direct Actions -->
        <aside class="w-full sm:w-48 lg:w-56 shrink-0 flex flex-col gap-4">
          <div class="bg-white rounded-lg p-3 border border-slate-200 shadow-sm overflow-hidden">
            <div class="relative aspect-[3/4] rounded overflow-hidden bg-slate-100 border border-slate-200">
              <img 
                v-if="book.cover_image" 
                class="w-full h-full object-cover" 
                :src="book.cover_image" 
                :alt="book.judul"
                @error="handleImageError($event, 0)"
              />
              <img 
                v-else 
                class="w-full h-full object-cover" 
                :src="fallbackCovers[0]" 
                :alt="book.judul"
              />
            </div>
          </div>

          <!-- Primary Actions -->
          <div class="flex flex-col gap-2.5">
            <button 
              @click="openBorrowModal"
              class="w-full bg-[#C89B3C] text-white py-3 rounded-lg font-label-md text-xs sm:text-sm flex items-center justify-center gap-1.5 hover:brightness-105 transition-all shadow-sm active:scale-[0.98] font-bold text-center cursor-pointer"
              title="Pinjam Buku Secara Mandiri"
            >
              <span class="material-symbols-outlined text-base" style="font-variation-settings: 'FILL' 1;">bookmark_add</span>
              <span>Pinjam Mandiri</span>
            </button>

            <button 
              @click="openReservationModal"
              class="w-full bg-primary text-white py-2.5 rounded-lg font-label-md text-xs flex items-center justify-center gap-1.5 hover:bg-primary-container transition-all shadow-xs font-bold text-center cursor-pointer"
              title="Reservasi Antrean Buku"
            >
              <span class="material-symbols-outlined text-base">schedule</span>
              <span>Reservasi Antrean</span>
            </button>

            <button 
              @click="toggleFavorite"
              :disabled="togglingWishlist"
              class="w-full py-2.5 rounded-lg font-label-md text-xs flex items-center justify-center gap-1.5 transition-all font-bold cursor-pointer active:scale-95 shadow-xs"
              :class="isFavorite ? 'bg-rose-50 border border-rose-300 text-rose-700 hover:bg-rose-100' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'"
              :title="isFavorite ? 'Klik untuk membatalkan favorit' : 'Simpan buku ini ke daftar wishlist favorit Anda'"
            >
              <span class="material-symbols-outlined text-base" :class="{ 'text-rose-600 font-fill': isFavorite }">
                {{ isFavorite ? 'favorite' : 'favorite_border' }}
              </span>
              <span>{{ isFavorite ? 'Disimpan di Favorit (Batalkan)' : 'Simpan ke Favorit' }}</span>
            </button>

            <!-- Social Proof: Avatar Group & Favorite Counter -->
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 text-xs">
              <!-- Avatar Stack (3 Circles) -->
              <div class="flex -space-x-2 overflow-hidden shrink-0">
                <div class="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&q=80" class="h-full w-full object-cover" alt="User 1" />
                </div>
                <div class="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&q=80" class="h-full w-full object-cover" alt="User 2" />
                </div>
                <div class="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-primary text-white font-bold text-[10px] flex items-center justify-center overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&q=80" class="h-full w-full object-cover" alt="User 3" />
                </div>
              </div>
              
              <p class="text-[11px] text-slate-600 leading-tight">
                <strong class="text-rose-600 font-bold">{{ favoriteCount }} orang</strong> sudah memfavoritkan buku ini
              </p>
            </div>

            <button 
              class="w-full bg-white border border-slate-300 text-slate-600 py-2 rounded-lg font-label-md text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
              @click="shareUrl"
            >
              <span class="material-symbols-outlined text-sm">share</span>
              <span>{{ sharedNotice ? 'Tautan Tersalin!' : 'Bagikan Link' }}</span>
            </button>
          </div>
        </aside>

        <!-- Middle Column: Action Bar, Striped OPAC Table, and Eksemplar Tabs -->
        <section class="flex-1 min-w-0 w-full">
          <!-- OPAC Top Actions Bar -->
          <div class="flex items-center gap-6 mb-3 text-xs sm:text-sm text-[#0288D1] font-semibold border-b border-slate-200 pb-2">
            <button class="hover:underline flex items-center gap-1 cursor-pointer" @click="showCitationModal = true">
              <span class="material-symbols-outlined text-base text-[#0288D1]">settings</span>
              <span>Cite This</span>
            </button>
            <button class="hover:underline flex items-center gap-1 cursor-pointer" @click="toggleTampung">
              <span class="material-symbols-outlined text-base text-[#0288D1]">shopping_cart</span>
              <span>{{ isTampung ? 'Batal Tampung' : 'Tampung' }}</span>
            </button>
            <button class="hover:underline flex items-center gap-1 cursor-pointer" @click="exportRIS">
              <span class="material-symbols-outlined text-base text-[#0288D1]">output</span>
              <span>Export Record</span>
            </button>
          </div>

          <!-- Toast Notification for Tampung -->
          <div v-if="toastMessage" class="mb-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2 animate-in fade-in">
            <span class="material-symbols-outlined text-base">check_circle</span>
            <span>{{ toastMessage }}</span>
          </div>

          <!-- OPAC Striped Bibliographic Table -->
          <div class="border border-slate-200 rounded-md overflow-hidden bg-white text-xs sm:text-sm shadow-xs mb-8">
            <!-- Row: Judul -->
            <div class="flex border-b border-slate-200 bg-[#EEF4FF]">
              <div class="w-32 sm:w-44 px-4 py-3 font-semibold text-slate-700 shrink-0">Judul</div>
              <div class="px-4 py-3 text-[#D32F2F] font-bold flex-1 leading-snug">
                {{ book.judul }} / {{ book.penulis || 'Penulis Tidak Diketahui' }}
              </div>
            </div>

            <!-- Row: Pengarang -->
            <div class="flex border-b border-slate-200 bg-white">
              <div class="w-32 sm:w-44 px-4 py-3 font-semibold text-slate-700 shrink-0">Pengarang</div>
              <div class="px-4 py-3 text-[#0288D1] hover:underline cursor-pointer flex-1 font-medium">
                {{ book.penulis || 'Penulis Tidak Diketahui' }} (Pengarang)
              </div>
            </div>

            <!-- Row: EDISI -->
            <div class="flex border-b border-slate-200 bg-[#EEF4FF]">
              <div class="w-32 sm:w-44 px-4 py-3 font-semibold text-slate-700 shrink-0">EDISI</div>
              <div class="px-4 py-3 text-slate-800 flex-1">
                Edisi {{ book.tahun_terbit ? `Cetakan ${book.tahun_terbit}` : '1' }}
              </div>
            </div>

            <!-- Row: Penerbitan -->
            <div class="flex border-b border-slate-200 bg-white">
              <div class="w-32 sm:w-44 px-4 py-3 font-semibold text-slate-700 shrink-0">Penerbitan</div>
              <div class="px-4 py-3 text-slate-800 flex-1">
                {{ book.penerbit || 'Jakarta : STAH Dharma Nusantara' }}, {{ book.tahun_terbit || '2023' }}
              </div>
            </div>

            <!-- Row: Deskripsi Fisik -->
            <div class="flex border-b border-slate-200 bg-[#EEF4FF]">
              <div class="w-32 sm:w-44 px-4 py-3 font-semibold text-slate-700 shrink-0">Deskripsi Fisik</div>
              <div class="px-4 py-3 text-slate-800 flex-1">
                342 halaman :ilustrasi ;27 cm
              </div>
            </div>

            <!-- Row: Konten -->
            <div class="flex border-b border-slate-200 bg-white">
              <div class="w-32 sm:w-44 px-4 py-3 font-semibold text-slate-700 shrink-0">Konten</div>
              <div class="px-4 py-3 text-slate-800 flex-1">Teks</div>
            </div>

            <!-- Row: Media -->
            <div class="flex border-b border-slate-200 bg-[#EEF4FF]">
              <div class="w-32 sm:w-44 px-4 py-3 font-semibold text-slate-700 shrink-0">Media</div>
              <div class="px-4 py-3 text-slate-800 flex-1">Tanpa Perantara</div>
            </div>

            <!-- Row: Penyimpan Media -->
            <div class="flex border-b border-slate-200 bg-white">
              <div class="w-32 sm:w-44 px-4 py-3 font-semibold text-slate-700 shrink-0">Penyimpan Media</div>
              <div class="px-4 py-3 text-slate-800 flex-1">Volume</div>
            </div>

            <!-- Row: ISBN -->
            <div class="flex border-b border-slate-200 bg-[#EEF4FF]">
              <div class="w-32 sm:w-44 px-4 py-3 font-semibold text-slate-700 shrink-0">ISBN</div>
              <div class="px-4 py-3 text-slate-800 font-mono flex-1">
                {{ book.isbn || '9786234802887' }}
              </div>
            </div>

            <!-- Row: Subjek -->
            <div class="flex border-b border-slate-200 bg-white">
              <div class="w-32 sm:w-44 px-4 py-3 font-semibold text-slate-700 shrink-0">Subjek</div>
              <div class="px-4 py-3 text-[#0288D1] flex-1 space-y-1">
                <NuxtLink :to="{ path: '/buku', query: { kategori: getCategoryName(book) } }" class="block hover:underline">
                  {{ getCategoryName(book) }}
                </NuxtLink>
                <span class="block text-slate-500 text-xs">Pustaka Digital STAH DNJ</span>
              </div>
            </div>

            <!-- Row: Bahasa -->
            <div class="flex border-b border-slate-200 bg-[#EEF4FF]">
              <div class="w-32 sm:w-44 px-4 py-3 font-semibold text-slate-700 shrink-0">Bahasa</div>
              <div class="px-4 py-3 text-slate-800 flex-1">Indonesia</div>
            </div>

            <!-- Row: Bentuk Karya -->
            <div class="flex border-b border-slate-200 bg-white">
              <div class="w-32 sm:w-44 px-4 py-3 font-semibold text-slate-700 shrink-0">Bentuk Karya</div>
              <div class="px-4 py-3 text-slate-800 flex-1">Buku Teks Umum</div>
            </div>

            <!-- Row: Target Pembaca -->
            <div class="flex border-b border-slate-200 bg-[#EEF4FF]">
              <div class="w-32 sm:w-44 px-4 py-3 font-semibold text-slate-700 shrink-0">Target Pembaca</div>
              <div class="px-4 py-3 text-slate-800 flex-1">Umum</div>
            </div>

            <!-- Row: Lokasi Rak -->
            <div class="flex border-b border-slate-200 bg-white">
              <div class="w-32 sm:w-44 px-4 py-3 font-semibold text-slate-700 shrink-0">Lokasi Rak</div>
              <div class="px-4 py-3 text-[#7B5900] font-semibold flex-1 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-base">location_on</span>
                <span>L-02 / Sayap Timur / Rak 04A</span>
              </div>
            </div>

            <!-- Row: Status Ketersediaan -->
            <div class="flex bg-[#EEF4FF]">
              <div class="w-32 sm:w-44 px-4 py-3 font-semibold text-slate-700 shrink-0">Status Ketersediaan</div>
              <div class="px-4 py-3 flex-1 font-semibold flex items-center gap-2" :class="isBookAvailable ? 'text-emerald-700' : 'text-rose-700'">
                <span class="w-2 h-2 rounded-full" :class="isBookAvailable ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                <span>{{ isBookAvailable ? `Tersedia di Rak (${availableCopyCount} eksemplar)` : 'Tidak Tersedia (Sedang Dipinjam / Direservasi)' }}</span>
              </div>
            </div>
          </div>

          <!-- OPAC Tabbed Section (Eksemplar, Konten Digital, MARC, Unduh Katalog) -->
          <div class="mb-8 border border-slate-200 rounded-md overflow-hidden bg-white shadow-xs">
            <!-- Tabs Bar -->
            <div class="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 pt-2 text-xs sm:text-sm font-semibold">
              <button 
                class="px-4 py-2.5 rounded-t-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                :class="activeTab === 'eksemplar' ? 'bg-white text-[#D32F2F] border-t-2 border-x border-[#D32F2F] border-b-white -mb-[1px] font-bold shadow-2xs' : 'text-[#D32F2F] hover:bg-slate-200/60'"
                @click="activeTab = 'eksemplar'"
              >
                <span>Eksemplar</span>
              </button>

              <button 
                class="px-4 py-2.5 rounded-t-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                :class="activeTab === 'digital' ? 'bg-white text-[#D32F2F] border-t-2 border-x border-[#D32F2F] border-b-white -mb-[1px] font-bold shadow-2xs' : 'text-[#D32F2F] hover:bg-slate-200/60'"
                @click="activeTab = 'digital'"
              >
                <span>Konten Digital</span>
              </button>

              <button 
                class="px-4 py-2.5 rounded-t-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                :class="activeTab === 'marc' ? 'bg-white text-[#D32F2F] border-t-2 border-x border-[#D32F2F] border-b-white -mb-[1px] font-bold shadow-2xs' : 'text-[#D32F2F] hover:bg-slate-200/60'"
                @click="activeTab = 'marc'"
              >
                <span>MARC</span>
              </button>

              <div class="relative ml-auto">
                <button 
                  class="px-4 py-2.5 rounded-t-lg transition-colors flex items-center gap-1 cursor-pointer text-[#D32F2F] hover:bg-slate-200/60"
                  @click="showUnduhDropdown = !showUnduhDropdown"
                >
                  <span>Unduh Katalog</span>
                  <span class="material-symbols-outlined text-sm">arrow_drop_down</span>
                </button>

                <div v-if="showUnduhDropdown" class="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 text-xs py-1 animate-in fade-in zoom-in duration-100">
                  <button @click="exportRIS(); showUnduhDropdown = false" class="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer">
                    <span class="material-symbols-outlined text-sm text-[#0288D1]">download</span>
                    <span>Unduh RIS (.ris)</span>
                  </button>
                  <button @click="copyCitation(); showUnduhDropdown = false" class="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer">
                    <span class="material-symbols-outlined text-sm text-[#0288D1]">description</span>
                    <span>Unduh Sitasi APA</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Tab Content 1: Eksemplar -->
            <div v-if="activeTab === 'eksemplar'" class="p-4 text-xs sm:text-sm">
              <!-- Controls Header -->
              <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div class="flex items-center gap-1.5 text-slate-600">
                  <span>Show</span>
                  <select v-model="entriesPerPage" class="border border-slate-300 rounded px-2 py-1 bg-white text-xs text-slate-700 focus:outline-none focus:border-primary cursor-pointer">
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                  </select>
                  <span>entries</span>
                </div>

                <div class="flex items-center gap-1.5 text-slate-600">
                  <span>Search:</span>
                  <input 
                    v-model="eksemplarSearch" 
                    type="text" 
                    class="border border-slate-300 rounded px-2.5 py-1 bg-white text-xs text-slate-700 focus:outline-none focus:border-primary w-36 sm:w-48"
                    placeholder="Filter eksemplar..."
                  />
                </div>
              </div>

              <!-- Eksemplar Data Table -->
              <div class="overflow-x-auto border border-slate-200 rounded">
                <table class="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr class="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                      <th class="p-3 border-r border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors" @click="toggleSort('barcode')">
                        <div class="flex items-center justify-between gap-1">
                          <span>No Barcode</span>
                          <span class="text-slate-400 text-xs">⇅</span>
                        </div>
                      </th>
                      <th class="p-3 border-r border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors" @click="toggleSort('callNumber')">
                        <div class="flex items-center justify-between gap-1">
                          <span>No. Panggil</span>
                          <span class="text-slate-400 text-xs">⇅</span>
                        </div>
                      </th>
                      <th class="p-3 border-r border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors" @click="toggleSort('akses')">
                        <div class="flex items-center justify-between gap-1">
                          <span>Akses</span>
                          <span class="text-slate-400 text-xs">⇅</span>
                        </div>
                      </th>
                      <th class="p-3 border-r border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors" @click="toggleSort('lokasi')">
                        <div class="flex items-center justify-between gap-1">
                          <span>Lokasi</span>
                          <span class="text-slate-400 text-xs">⇅</span>
                        </div>
                      </th>
                      <th class="p-3 cursor-pointer hover:bg-slate-100 transition-colors" @click="toggleSort('ketersediaan')">
                        <div class="flex items-center justify-between gap-1">
                          <span>Ketersediaan</span>
                          <span class="text-slate-400 text-xs">⇅</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="(item, idx) in sortedEksemplar" 
                      :key="item.barcode" 
                      :class="idx % 2 === 0 ? 'bg-[#EEF4FF]' : 'bg-white'"
                      class="border-b border-slate-200 text-slate-800"
                    >
                      <td class="p-3 font-mono border-r border-slate-200">{{ item.barcode }}</td>
                      <td class="p-3 border-r border-slate-200 font-semibold">{{ item.callNumber }}</td>
                      <td class="p-3 border-r border-slate-200">{{ item.akses }}</td>
                      <td class="p-3 border-r border-slate-200 leading-relaxed">{{ item.lokasi }}</td>
                      <td class="p-3 font-semibold" :class="item.ketersediaan === 'Tersedia' ? 'text-emerald-700' : 'text-rose-700'">
                        {{ item.ketersediaan }}
                      </td>
                    </tr>
                    <tr v-if="sortedEksemplar.length === 0">
                      <td colspan="5" class="p-4 text-center text-slate-500 italic">
                        Tidak ada data eksemplar yang sesuai.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Footer Controls -->
              <div class="flex flex-wrap items-center justify-between gap-3 mt-4 text-xs text-slate-600">
                <div>
                  Showing 1 to {{ sortedEksemplar.length }} of {{ eksemplarList.length }} entries
                </div>

                <div class="flex items-center border border-slate-300 rounded overflow-hidden shadow-2xs">
                  <button class="px-3 py-1 bg-white hover:bg-slate-100 border-r border-slate-300 text-slate-600 disabled:opacity-50 cursor-pointer">
                    Previous
                  </button>
                  <button class="px-3 py-1 bg-[#0288D1] text-white font-bold">
                    1
                  </button>
                  <button class="px-3 py-1 bg-white hover:bg-slate-100 border-l border-slate-300 text-slate-600 disabled:opacity-50 cursor-pointer">
                    Next
                  </button>
                </div>
              </div>
            </div>

            <!-- Tab Content 2: Konten Digital -->
            <div v-else-if="activeTab === 'digital'" class="p-6 text-xs sm:text-sm">
              <div class="flex items-start gap-4">
                <span class="material-symbols-outlined text-4xl text-[#0288D1]">picture_as_pdf</span>
                <div>
                  <h4 class="font-bold text-slate-800 text-base mb-1">Naskah / File Digital E-Book</h4>
                  <p class="text-slate-600 mb-4 leading-relaxed">
                    Koleksi digital dan sampel publikasi buku ini dapat diakses secara resmi melalui portal Repository STAH Dharma Nusantara Jakarta.
                  </p>
                  <a 
                    :href="repositorySearchUrl" 
                    target="_blank" 
                    class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg font-bold text-xs hover:bg-primary-container transition-colors"
                  >
                    <span>Unduh File Digital di Repository</span>
                    <span class="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Tab Content 3: MARC -->
            <div v-else-if="activeTab === 'marc'" class="p-6 font-mono text-xs text-slate-800">
              <div class="bg-slate-50 p-4 border border-slate-200 rounded-md space-y-1 leading-relaxed">
                <p><strong class="text-primary">LEADER</strong> 00000nam a2200000 a 4500</p>
                <p><strong class="text-primary">001</strong> 00100{{ book.id }}</p>
                <p><strong class="text-primary">020</strong> ## $a {{ book.isbn || '9786234802887' }}</p>
                <p><strong class="text-primary">100</strong> 1# $a {{ book.penulis || 'Penulis Tidak Diketahui' }} $e author</p>
                <p><strong class="text-primary">245</strong> 10 $a {{ book.judul }} / $c {{ book.penulis || 'Penulis Tidak Diketahui' }}</p>
                <p><strong class="text-primary">260</strong> ## $a Jakarta : $b {{ book.penerbit || 'Pustaka STAH DNJ' }}, $c {{ book.tahun_terbit || '2023' }}</p>
                <p><strong class="text-primary">300</strong> ## $a 342 p. : $b ill. ; $c 27 cm.</p>
                <p><strong class="text-primary">650</strong> #4 $a {{ getCategoryName(book) }}</p>
                <p><strong class="text-primary">852</strong> ## $a STAH-DNJ $b Utama $c Rak 04A</p>
              </div>
            </div>
          </div>

          <!-- Extended Synopsis Section -->
          <div class="bg-white rounded-lg p-6 border border-slate-200 shadow-xs mb-8">
            <h3 class="font-bold text-slate-800 text-sm sm:text-base mb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-[#0288D1] text-lg">description</span>
              <span>Sinopsis &amp; Abstraksi Buku</span>
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {{ book.deskripsi || 'Buku ini merupakan referensi akademik terkemuka yang membahas landasan keilmuan mendalam di lingkungan STAH Dharma Nusantara Jakarta. Penulis menyajikan kajian ilmiah yang komprehensif untuk mendukung riset mahasiswa dan sivitas akademika.' }}
            </p>
          </div>

          <!-- Rating & Reviews Section -->
          <div class="bg-white rounded-lg p-6 border border-slate-200 shadow-xs mb-8 space-y-6">
            <!-- Header Summary -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 class="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                  <span class="material-symbols-outlined text-amber-500 text-xl">star</span>
                  <span>Rating &amp; Ulasan Pemustaka</span>
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">Pendapat &amp; tanggapan sivitas akademika mengenai buku ini</p>
              </div>

              <!-- Rating Score Badge -->
              <div class="flex items-center gap-3 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl">
                <span class="text-2xl font-black text-amber-900">4.9</span>
                <div>
                  <div class="flex text-amber-400 text-xs">
                    <span class="material-symbols-outlined text-sm font-fill">star</span>
                    <span class="material-symbols-outlined text-sm font-fill">star</span>
                    <span class="material-symbols-outlined text-sm font-fill">star</span>
                    <span class="material-symbols-outlined text-sm font-fill">star</span>
                    <span class="material-symbols-outlined text-sm font-fill">star</span>
                  </div>
                  <span class="text-[10px] text-slate-500 font-semibold">{{ reviewsList.length }} Ulasan</span>
                </div>
              </div>
            </div>

            <!-- Submit Review Form (Require Login Check) -->
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 class="font-bold text-xs text-slate-800">Berikan Ulasan &amp; Rating Anda</h4>

              <!-- If Logged In -->
              <div v-if="tokenCookie" class="space-y-3">
                <!-- Star Rating Picker -->
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold text-slate-700">Rating:</span>
                  <div class="flex items-center gap-1 cursor-pointer">
                    <span 
                      v-for="star in 5" 
                      :key="star"
                      @click="reviewRating = star"
                      class="material-symbols-outlined text-xl transition-all"
                      :class="star <= reviewRating ? 'text-amber-400 font-fill' : 'text-slate-300'"
                    >
                      star
                    </span>
                  </div>
                  <span class="text-xs font-bold text-amber-600">({{ reviewRating }} / 5 ⭐)</span>
                </div>

                <!-- Review Comment Box -->
                <textarea 
                  v-model="reviewComment" 
                  rows="3" 
                  placeholder="Tuliskan ulasan &amp; tanggapan Anda mengenai isi buku ini..."
                  class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-primary"
                ></textarea>

                <div class="flex justify-end">
                  <button 
                    @click="submitReview"
                    :disabled="submittingReview"
                    class="px-5 py-2 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span v-if="submittingReview" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span class="material-symbols-outlined text-sm">send</span>
                    <span>{{ submittingReview ? 'Mengirim...' : 'Kirim Ulasan & Rating' }}</span>
                  </button>
                </div>
              </div>

              <!-- If NOT Logged In -->
              <div v-else class="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-2">
                <p class="text-xs text-amber-950 font-medium">
                  🔒 Silakan <strong>masuk / login</strong> terlebih dahulu untuk memberikan rating dan ulasan pada buku ini.
                </p>
                <a 
                  href="https://portal-perpus.stahdnj.ac.id/sso/perpus"
                  class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <span class="material-symbols-outlined text-sm">vpn_key</span>
                  <span>Masuk via SSO Portal STAH DNJ</span>
                </a>
              </div>
            </div>

            <!-- Community Reviews List -->
            <div class="space-y-4 pt-2">
              <h4 class="font-bold text-xs text-slate-700">Ulasan Pemustaka Lainnya</h4>

              <div v-if="reviewsList.length === 0" class="py-6 text-center text-slate-400 text-xs italic">
                Belum ada ulasan untuk buku ini. Jadilah yang pertama memberikan ulasan!
              </div>

              <div v-else class="divide-y divide-slate-100">
                <div v-for="rev in reviewsList" :key="rev.id" class="py-3.5 space-y-1.5">
                  <div class="flex items-center justify-between text-xs">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs overflow-hidden">
                        <img v-if="rev.user?.avatar_url" :src="rev.user.avatar_url" class="w-full h-full object-cover" alt="User" />
                        <span v-else>{{ (rev.user?.name || 'U').charAt(0) }}</span>
                      </div>
                      <div>
                        <span class="font-bold text-slate-900 block leading-tight">{{ rev.user?.name || 'Pemustaka STAH' }}</span>
                        <span class="text-[10px] text-slate-400">{{ formatDate(rev.created_at) }}</span>
                      </div>
                    </div>

                    <div class="flex text-amber-400 text-xs">
                      <span v-for="s in (rev.rating || 5)" :key="s" class="material-symbols-outlined text-sm font-fill">star</span>
                    </div>
                  </div>

                  <p class="text-xs text-slate-700 leading-relaxed pl-9">
                    {{ rev.ulasan || rev.comment || rev.ulasan_text }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Right Column: Sidebar Karya Terkait -->
        <aside class="w-full lg:w-72 xl:w-80 shrink-0">
          <h3 class="font-bold text-slate-800 text-xs sm:text-sm mb-2">Karya Terkait :</h3>
          <div class="bg-white border border-slate-200 rounded-lg overflow-hidden text-xs divide-y divide-slate-100 shadow-xs">
            <NuxtLink 
              v-for="item in relatedBooks" 
              :key="item.id" 
              :to="getBookUrl(item)"
              class="block p-3.5 hover:bg-slate-50 transition-colors text-slate-700 leading-snug group"
            >
              <span class="font-medium text-slate-800 group-hover:text-[#0288D1] transition-colors block mb-0.5">{{ item.judul }}</span>
              <span class="text-slate-500 text-[11px]"> / {{ item.penulis || 'Penulis Tidak Diketahui' }}</span>
            </NuxtLink>

            <NuxtLink to="/buku" class="block p-3 text-[#0288D1] hover:underline font-semibold text-center bg-slate-50/70 text-xs">
              Show More
            </NuxtLink>
          </div>
        </aside>
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
            <img v-if="book?.cover_image" :src="book.cover_image" alt="Cover" class="w-full h-full object-cover" />
            <span v-else class="material-symbols-outlined text-2xl text-slate-400 flex items-center justify-center h-full">book</span>
          </div>
          <div class="min-w-0 flex flex-col justify-center text-xs">
            <h4 class="font-bold text-slate-900 line-clamp-2">{{ book?.judul }}</h4>
            <p class="text-slate-500 mt-0.5">{{ book?.penulis || 'STAH DNJ' }}</p>
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
            <img v-if="book?.cover_image" :src="book.cover_image" alt="Cover" class="w-full h-full object-cover" />
            <span v-else class="material-symbols-outlined text-2xl text-slate-400 flex items-center justify-center h-full">book</span>
          </div>
          <div class="min-w-0 flex flex-col justify-center text-xs">
            <h4 class="font-bold text-slate-900 line-clamp-2">{{ book?.judul }}</h4>
            <p class="text-slate-500 mt-0.5">{{ book?.penulis || 'STAH DNJ' }}</p>
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

    <!-- Citation Modal (Cite This) -->
    <div v-if="showCitationModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" @click.self="showCitationModal = false">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in duration-200">
        <button class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors" @click="showCitationModal = false">
          <span class="material-symbols-outlined text-xl">close</span>
        </button>

        <div class="flex items-center gap-2 mb-4">
          <span class="material-symbols-outlined text-2xl text-[#0288D1]">format_quote</span>
          <h3 class="font-bold text-slate-900 text-lg">Sitasi Pustaka (Cite This)</h3>
        </div>

        <div class="space-y-4 text-xs">
          <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p class="font-bold text-slate-700 mb-1">APA Style (7th ed.):</p>
            <p class="text-slate-800 font-mono text-[11px] select-all leading-relaxed">{{ getCitationAPA(book) }}</p>
          </div>

          <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p class="font-bold text-slate-700 mb-1">MLA Style (9th ed.):</p>
            <p class="text-slate-800 font-mono text-[11px] select-all leading-relaxed">{{ getCitationMLA(book) }}</p>
          </div>

          <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p class="font-bold text-slate-700 mb-1">Chicago Style:</p>
            <p class="text-slate-800 font-mono text-[11px] select-all leading-relaxed">{{ getCitationChicago(book) }}</p>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer" @click="showCitationModal = false">
            Tutup
          </button>
          <button class="px-4 py-2 bg-[#0288D1] hover:bg-[#0277BD] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer" @click="copyCitation">
            <span class="material-symbols-outlined text-sm">content_copy</span>
            <span>Salin Sitasi (APA)</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePustakaApi, type Book } from '../../composables/usePustakaApi';

const route = useRoute();
const { getBookById, getBooks, selfBorrow, createReservation, getWishlist, addToWishlist, removeFromWishlist, createReview, getReviews, tokenCookie } = usePustakaApi();

const loading = ref(true);
const book = ref<Book | null>(null);
const allBooks = ref<Book[]>([]);
const isFavorite = ref(false);
const favoriteCount = ref(14);
const togglingWishlist = ref(false);
const isTampung = ref(false);
const showCitationModal = ref(false);
const sharedNotice = ref(false);
const toastMessage = ref('');

// Review State
const reviewRating = ref(5);
const reviewComment = ref('');
const submittingReview = ref(false);
const reviewsList = ref<any[]>([]);

const submitReview = async () => {
  if (!tokenCookie.value) {
    if (process.client) {
      window.location.href = 'https://portal-perpus.stahdnj.ac.id/sso/perpus';
    }
    return;
  }
  if (!book.value) return;
  if (!reviewComment.value.trim()) {
    alert('Harap isi ulasan atau tanggapan Anda mengenai buku ini.');
    return;
  }

  submittingReview.value = true;
  try {
    const res = await createReview(book.value.id, reviewRating.value, reviewComment.value);
    alert(res.message);
    if (res.success) {
      reviewComment.value = '';
      loadReviews(book.value.id);
    }
  } finally {
    submittingReview.value = false;
  }
};

const loadReviews = async (bookId: number | string) => {
  try {
    const res = await getReviews(bookId).catch(() => null);
    if (res?.data && Array.isArray(res.data)) {
      reviewsList.value = res.data;
      return;
    }
    if ((book.value as any)?.reviews && Array.isArray((book.value as any).reviews)) {
      reviewsList.value = (book.value as any).reviews;
      return;
    }
  } catch (e) {}

  reviewsList.value = [];
};

const toggleFavorite = async () => {
  if (!tokenCookie.value) {
    if (process.client) {
      window.location.href = 'https://portal-perpus.stahdnj.ac.id/sso/perpus';
    }
    return;
  }
  if (!book.value) return;

  togglingWishlist.value = true;
  try {
    if (isFavorite.value) {
      const res = await removeFromWishlist(book.value.id);
      isFavorite.value = false;
      favoriteCount.value = Math.max(0, favoriteCount.value - 1);
      showToast(res.message || 'Buku dihapus dari Favorit');
    } else {
      const res = await addToWishlist(book.value.id);
      isFavorite.value = true;
      favoriteCount.value += 1;
      showToast(res.message || 'Buku berhasil disimpan ke Favorit!');
    }
  } finally {
    togglingWishlist.value = false;
  }
};

// Modals State
const showBorrowModal = ref(false);
const showReservationModal = ref(false);
const borrowDuration = ref(7);
const submittingBorrow = ref(false);
const submittingReservation = ref(false);

const calculatedDueDate = computed(() => {
  const d = new Date();
  d.setDate(d.getDate() + Number(borrowDuration.value));
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
});

const openBorrowModal = () => {
  if (!tokenCookie.value) {
    if (process.client) {
      window.location.href = 'https://portal-perpus.stahdnj.ac.id/sso/perpus';
    }
    return;
  }
  showBorrowModal.value = true;
};

const openReservationModal = () => {
  if (!tokenCookie.value) {
    if (process.client) {
      window.location.href = 'https://portal-perpus.stahdnj.ac.id/sso/perpus';
    }
    return;
  }
  showReservationModal.value = true;
};

const submitBorrow = async () => {
  if (!book.value) return;
  submittingBorrow.value = true;
  try {
    const res = await selfBorrow(book.value.id, borrowDuration.value);
    showBorrowModal.value = false;
    showToast(res.message);
    if (!res.success) {
      alert(res.message);
    }
  } finally {
    submittingBorrow.value = false;
  }
};

const submitReservation = async () => {
  if (!book.value) return;
  submittingReservation.value = true;
  try {
    const res = await createReservation(book.value.id);
    showReservationModal.value = false;
    showToast(res.message);
    if (!res.success) {
      alert(res.message);
    }
  } finally {
    submittingReservation.value = false;
  }
};

// Tabbed OPAC states
const activeTab = ref<'eksemplar' | 'digital' | 'marc'>('eksemplar');
const showUnduhDropdown = ref(false);
const entriesPerPage = ref(10);
const eksemplarSearch = ref('');
const sortColumn = ref<string>('');
const sortAsc = ref(true);

const fallbackCovers = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCI61U0Gb0GCI3csX5g_Tws6K5775TufoAItfBr2ZGCANRNu0NlxeseUAuBqzB1HzuvrIrNV4NL21OSkV2q370ak_bZc5ebYvc7EokgVQMknIbqYuCSawR1NSfEuUD6E5AQrhSg6ZUkbaPs4t2BL3nAkKNCggbNKDXGvVa66mTDLxbv5FTt8BL1NUy1G07xpcgZGOlGMxPMbFyoCq3umgCSOwvRXmcGF_BSqvr7ev8nerw29xv8txFLMQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC1YfO7YLmXXp1CRYDMz210Tyuwd68rKMatE2ryLuF8vfVRxR7zVB6SXgZIzjlw9VSiuCGJjSU893VGLyTjsur27hlueSY-dAl92BwnoIZKuLK-Qjok9iq73KpiWFyvJbcJ1XPjUKCMIYBQB9Ls2wwHRyxQANPoxja-VGRbgQOI3KTX7PPSIGOxM7GSIHtNu1KeTnuBnK4-aeIUXyPRMZP_6Gy_xBxB0gNqvpbNZY49O4YNYZihCxMczQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCzdSyRV5DnLyvNwGDh3fhn0s690hgMErmMVG7jo4angx59EYWvbO53iXe0RChQCdhrtcDiNOW2KsNzIHU5mt0BgG7o_s0Afc8ZmX2KfXPtCNw3nquDsYQD57v_LVmvJ7fVrxjwSIred5diaM_Gayb_VT_Zp1ujzfY2V3xJWZIdDagA2ruUyWtqmVOSdbpQLaQTYPxXo6SbRS-vcA9XXN3yfbzv7jKy7qGsvI43WQ8D3WEhuG5jW_fBAg'
];

const handleImageError = (event: Event, index: number) => {
  const img = event.target as HTMLImageElement;
  if (img) {
    img.src = fallbackCovers[index % fallbackCovers.length];
  }
};

const parseBookIdFromParam = (param: string): string => {
  if (!param) return '1';
  const match = param.match(/-(\d+)$/);
  if (match) return match[1];
  if (/^\d+$/.test(param)) return param;
  return param;
};

const getCategoryName = (b?: Book | null): string => {
  if (!b) return 'Filsafat';
  const catObj = b.category || b.kategori;
  if (typeof catObj === 'object' && catObj?.nama_kategori) {
    return catObj.nama_kategori;
  }
  if (typeof catObj === 'string') {
    return catObj;
  }
  return 'Filsafat & Agama';
};

const getBookUrl = (b: Book) => {
  const slug = b.slug || b.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  return `/buku/${slug}-${b.id}`;
};

const repositorySearchUrl = computed(() => {
  if (book.value?.judul) {
    return `https://repository.stahdnj.ac.id/xmlui/discover?query=${encodeURIComponent(book.value.judul)}`;
  }
  return 'https://repository.stahdnj.ac.id/xmlui/';
});

const relatedBooks = computed(() => {
  if (!book.value) return [];
  return allBooks.value
    .filter(b => b.id !== book.value?.id)
    .slice(0, 5);
});

const availableCopyCount = computed(() => {
  if (!book.value) return 0;
  const rawCopies = (book.value as any).copies || (book.value as any).book_copies || (book.value as any).eksemplar;
  if (Array.isArray(rawCopies) && rawCopies.length > 0) {
    return rawCopies.filter((c: any) => String(c.status || '').toLowerCase() === 'tersedia').length;
  }
  return (book.value.stok === undefined || book.value.stok > 0) ? 1 : 0;
});

const isBookAvailable = computed(() => {
  return availableCopyCount.value > 0;
});

const eksemplarList = computed(() => {
  if (!book.value) return [];
  const rawCopies = (book.value as any).copies || (book.value as any).book_copies || (book.value as any).eksemplar;
  if (Array.isArray(rawCopies) && rawCopies.length > 0) {
    return rawCopies.map((c: any) => {
      const isAvail = String(c.status || '').toLowerCase() === 'tersedia';
      return {
        barcode: c.barcode_qr_buku || c.barcode || `BC-${c.id}`,
        callNumber: c.nomor_panggil || book.value?.no_panggil || `D EKMA ${c.id}`,
        akses: isAvail ? 'Dapat Dipinjam' : 'Sirkulasi (Sedang Dipinjam)',
        lokasi: c.lokasi_rak || book.value?.lokasi_rak || 'Sayap Timur Rak 04A',
        ketersediaan: isAvail ? 'Tersedia' : 'Tidak Tersedia (Sedang Dipinjam)'
      };
    });
  }

  const isAvail = isBookAvailable.value;
  const bId = String(book.value.id || 1);
  return [
    {
      barcode: `23/302${bId}3`,
      callNumber: book.value.no_panggil || `D EKMA 42${bId}3`,
      akses: 'Tandon (Referensi)',
      lokasi: book.value.lokasi_rak || 'Perpustakaan STAH DNJ - Ruang Sidang Lantai 1',
      ketersediaan: 'Tersedia'
    },
    {
      barcode: `23/902${bId}3`,
      callNumber: book.value.no_panggil || `EKMA 42${bId}3`,
      akses: isAvail ? 'Dapat Dipinjam' : 'Sirkulasi (Sedang Dipinjam)',
      lokasi: book.value.lokasi_rak || 'Perpustakaan STAH DNJ - Sayap Timur Rak 04A',
      ketersediaan: isAvail ? 'Tersedia' : 'Tidak Tersedia (Sedang Dipinjam)'
    }
  ];
});

const sortedEksemplar = computed(() => {
  let list = eksemplarList.value;

  if (eksemplarSearch.value.trim()) {
    const q = eksemplarSearch.value.toLowerCase();
    list = list.filter(item => 
      item.barcode.toLowerCase().includes(q) ||
      item.callNumber.toLowerCase().includes(q) ||
      item.akses.toLowerCase().includes(q) ||
      item.lokasi.toLowerCase().includes(q) ||
      item.ketersediaan.toLowerCase().includes(q)
    );
  }

  if (sortColumn.value) {
    const col = sortColumn.value as keyof typeof list[0];
    list = [...list].sort((a, b) => {
      const valA = String(a[col] || '');
      const valB = String(b[col] || '');
      return sortAsc.value ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }

  return list.slice(0, entriesPerPage.value);
});

const toggleSort = (col: string) => {
  if (sortColumn.value === col) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortColumn.value = col;
    sortAsc.value = true;
  }
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Baru saja';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
};

const loadBookDetail = async () => {
  loading.value = true;
  const rawParam = route.params.id as string;
  const bookId = parseBookIdFromParam(rawParam);

  try {
    const [resBook, resAll] = await Promise.all([
      getBookById(bookId).catch(() => ({ success: false, data: null })),
      getBooks().catch(() => ({ success: false, data: [] }))
    ]);

    if (resBook?.success && resBook.data) {
      book.value = resBook.data;
    } else if (resAll?.success && resAll.data?.length > 0) {
      book.value = resAll.data.find(b => String(b.id) === String(bookId)) || resAll.data[0];
    }

    if (resAll?.success) {
      allBooks.value = resAll.data || [];
    }

    if (tokenCookie.value) {
      const wishRes = await getWishlist().catch(() => null);
      if (wishRes?.data && Array.isArray(wishRes.data)) {
        isFavorite.value = wishRes.data.some((b: any) => String(b.id) === String(bookId));
      }
    }

    const baseCount = Number((book.value as any)?.wishlist_count || (book.value as any)?.likes || 14);
    favoriteCount.value = baseCount + (isFavorite.value ? 1 : 0);

    loadReviews(bookId);
  } catch (err) {
    console.error('Error loading book detail:', err);
  } finally {
    loading.value = false;
  }
};

const getCitationAPA = (b?: Book | null) => {
  if (!b) return '';
  return `${b.penulis || 'Anonim'}. (${b.tahun_terbit || '2023'}). ${b.judul}. ${b.penerbit || 'Pustaka STAH DNJ'}.`;
};

const getCitationMLA = (b?: Book | null) => {
  if (!b) return '';
  return `${b.penulis || 'Anonim'}. ${b.judul}. ${b.penerbit || 'Pustaka STAH DNJ'}, ${b.tahun_terbit || '2023'}.`;
};

const getCitationChicago = (b?: Book | null) => {
  if (!b) return '';
  return `${b.penulis || 'Anonim'}. ${b.judul}. Jakarta: ${b.penerbit || 'Pustaka STAH DNJ'}, ${b.tahun_terbit || '2023'}.`;
};

const copyCitation = () => {
  if (process.client && book.value) {
    navigator.clipboard.writeText(getCitationAPA(book.value));
    showCitationModal.value = false;
    showToast('Sitasi APA berhasil disalin ke clipboard!');
  }
};

const toggleTampung = () => {
  isTampung.value = !isTampung.value;
  showToast(isTampung.value ? 'Buku berhasil ditambahkan ke keranjang Tampung!' : 'Buku dihapus dari Tampung');
};

const exportRIS = () => {
  if (!book.value) return;
  const risContent = `TY  - BOOK
TI  - ${book.value.judul}
AU  - ${book.value.penulis || 'Anonim'}
PB  - ${book.value.penerbit || 'Pustaka STAH DNJ'}
PY  - ${book.value.tahun_terbit || '2023'}
SN  - ${book.value.isbn || ''}
KW  - ${getCategoryName(book.value)}
ER  - `;
  const blob = new Blob([risContent], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${book.value.judul.replace(/[^a-z0-9]+/gi, '_')}.ris`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('File rekaman .RIS berhasil diunduh!');
};

const showToast = (msg: string) => {
  toastMessage.value = msg;
  setTimeout(() => {
    toastMessage.value = '';
  }, 3500);
};

const shareUrl = () => {
  if (process.client) {
    navigator.clipboard.writeText(window.location.href);
    sharedNotice.value = true;
    setTimeout(() => { sharedNotice.value = false; }, 3000);
  }
};

watch(() => route.params.id, () => {
  loadBookDetail();
});

onMounted(() => {
  loadBookDetail();
});
</script>

<style scoped>
.font-fill {
  font-variation-settings: 'FILL' 1, 'wght' 400;
}
</style>

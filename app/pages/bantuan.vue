<template>
  <div class="min-h-screen bg-surface-bright text-on-background font-body-md overflow-x-hidden">
    <main class="min-h-screen">
      <!-- Hero Section -->
      <section class="relative w-full bg-primary-container py-12 sm:py-20 md:py-24 overflow-hidden">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute w-full h-full" style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 32px 32px;"></div>
        </div>
        <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 text-center">
          <div class="inline-flex items-center gap-2 bg-secondary/20 text-secondary-fixed border border-secondary/40 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <span class="material-symbols-outlined text-sm">support_agent</span>
            <span>Layanan Bantuan &amp; Informasi Pustaka</span>
          </div>
          <h1 class="font-display-lg text-3xl md:text-display-lg text-on-primary mb-6 font-extrabold">Meja Bantuan (Helpdesk)</h1>
          <p class="font-body-lg text-body-md md:text-body-lg text-primary-fixed max-w-3xl mx-auto opacity-90 leading-relaxed">
            Tim pustakawan siap membantu penelusuran pustaka, aktivasi keanggotaan, asistensi tugas akhir, serta menjawab seluruh pertanyaan Anda.
          </p>
        </div>
      </section>

      <!-- Main Content Grid -->
      <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop -mt-8 relative z-20 pb-20">
        <!-- Quick Contact Action Bar -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <!-- WhatsApp Channel -->
          <a :href="`https://wa.me/${cleanPhone(siteSettings?.contact_whatsapp || '628123456789')}`" target="_blank" class="bg-emerald-600 text-white rounded-2xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-between group">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-white/20 rounded-xl">
                <span class="material-symbols-outlined text-3xl">chat</span>
              </div>
              <div>
                <p class="text-xs opacity-90 font-medium">Layanan Cepat WhatsApp</p>
                <h4 class="font-bold text-lg text-white">Chat Pustakawan</h4>
                <p class="text-xs opacity-80 mt-0.5">{{ siteSettings?.contact_whatsapp || '+62 812-3456-789' }}</p>
              </div>
            </div>
            <span class="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </a>

          <!-- Email Support -->
          <a :href="`mailto:${siteSettings?.contact_email || 'perpustakaan@stahdnj.ac.id'}`" class="bg-primary text-white rounded-2xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-between group">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-white/20 rounded-xl">
                <span class="material-symbols-outlined text-3xl">mail</span>
              </div>
              <div>
                <p class="text-xs opacity-90 font-medium">Surat Elektronik (Email)</p>
                <h4 class="font-bold text-lg text-white">Kirim Email</h4>
                <p class="text-xs opacity-80 mt-0.5">{{ siteSettings?.contact_email || 'perpustakaan@stahdnj.ac.id' }}</p>
              </div>
            </div>
            <span class="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </a>

          <!-- Office Hours & Desk -->
          <div class="bg-white text-primary rounded-2xl p-6 border border-outline-variant/60 shadow-sm flex items-center gap-4">
            <div class="p-3 bg-secondary/10 text-secondary rounded-xl">
              <span class="material-symbols-outlined text-3xl">storefront</span>
            </div>
            <div>
              <p class="text-xs text-on-surface-variant font-medium">Lokasi Fisik</p>
              <h4 class="font-bold text-base text-primary">Lantai 1 Gedung STAH DNJ</h4>
              <p class="text-xs text-on-surface-variant">Senin - Jumat | 08.00 - 16.00 WIB</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <!-- FAQ Section (Left 7 cols) -->
          <div class="lg:col-span-7 flex flex-col gap-6">
            <div class="bg-white rounded-2xl p-8 border border-outline-variant/60 shadow-sm">
              <div class="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/50">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-secondary text-3xl">quiz</span>
                  <div>
                    <h3 class="font-headline-md text-xl text-primary font-bold">Pertanyaan Sering Diajukan (FAQ)</h3>
                    <p class="text-xs text-on-surface-variant">Solusi instan untuk kendala umum pemustaka</p>
                  </div>
                </div>
              </div>

              <!-- FAQ Accordion List -->
              <div class="space-y-4">
                <div 
                  v-for="(faq, idx) in faqs" 
                  :key="idx" 
                  class="border border-outline-variant/60 rounded-xl overflow-hidden transition-all"
                  :class="{ 'bg-surface-container-low/60 border-secondary/40': activeFaq === idx }"
                >
                  <button 
                    @click="activeFaq = activeFaq === idx ? null : idx" 
                    class="w-full px-5 py-4 text-left font-bold text-sm text-primary flex justify-between items-center gap-4 cursor-pointer hover:bg-surface-container-low/40 transition-colors"
                  >
                    <span>{{ faq.q }}</span>
                    <span class="material-symbols-outlined text-secondary transition-transform duration-300" :class="{ 'rotate-180': activeFaq === idx }">
                      keyboard_arrow_down
                    </span>
                  </button>
                  <div v-show="activeFaq === idx" class="px-5 pb-5 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/30 pt-3">
                    {{ faq.a }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Inquiry Form (Right 5 cols) -->
          <div class="lg:col-span-5">
            <div class="bg-white rounded-2xl p-8 border border-outline-variant/60 shadow-sm sticky top-24">
              <div class="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/50">
                <div class="p-2.5 bg-secondary/10 rounded-xl text-secondary">
                  <span class="material-symbols-outlined text-2xl">send</span>
                </div>
                <div>
                  <h3 class="font-headline-md text-lg text-primary font-bold">Kirim Pesan &amp; Pertanyaan</h3>
                  <p class="text-xs text-on-surface-variant">Pustakawan kami akan merespons dalam 1x24 jam</p>
                </div>
              </div>

              <!-- Success Alert Toast -->
              <div v-if="submittedSuccess" class="bg-emerald-50 text-emerald-900 border border-emerald-200 p-4 rounded-xl mb-4 text-xs flex items-center gap-3">
                <span class="material-symbols-outlined text-emerald-600 text-xl">check_circle</span>
                <div>
                  <p class="font-bold">Pesan Berhasil Terkirim!</p>
                  <p class="text-[11px] opacity-90">Terima kasih. Tim pustakawan akan segera menindaklanjuti pesan Anda.</p>
                </div>
              </div>

              <form @submit.prevent="submitForm" class="flex flex-col gap-4">
                <div>
                  <label class="block text-xs font-bold text-primary mb-1">Nama Lengkap</label>
                  <input 
                    v-model="form.name"
                    type="text" 
                    required 
                    placeholder="Masukkan nama Anda..."
                    class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-primary outline-none focus:border-secondary transition-all"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-primary mb-1">NIM / NIDN / Email</label>
                  <input 
                    v-model="form.identity"
                    type="text" 
                    required 
                    placeholder="Nomor identitas atau alamat email..."
                    class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-primary outline-none focus:border-secondary transition-all"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-primary mb-1">Kategori Bantuan</label>
                  <select 
                    v-model="form.category"
                    class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-primary outline-none focus:border-secondary transition-all"
                  >
                    <option value="Sirkulasi & Peminjaman">Sirkulasi &amp; Peminjaman Buku</option>
                    <option value="Kendala Kiosk Absensi">Kendala Kiosk Presensi</option>
                    <option value="Penelusuran Karya Ilmiah">Penelusuran Karya Ilmiah / Repository</option>
                    <option value="Keanggotaan Perpustakaan">Aktivasi Keanggotaan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-primary mb-1">Isi Pesan / Pertanyaan</label>
                  <textarea 
                    v-model="form.message"
                    rows="4" 
                    required 
                    placeholder="Tuliskan kendala atau pertanyaan Anda secara detail..."
                    class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-primary outline-none focus:border-secondary transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  :disabled="isSubmitting"
                  class="w-full py-3.5 bg-secondary hover:bg-on-secondary-container text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-[98%] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span class="material-symbols-outlined text-lg">send</span>
                  <span>{{ isSubmitting ? 'Mengirim Pesan...' : 'Kirim Pesan Bantuan' }}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
const { getSettings } = usePustakaApi();
const siteSettings = ref(null);
const activeFaq = ref(0);
const isSubmitting = ref(false);
const submittedSuccess = ref(false);

const form = reactive({
  name: '',
  identity: '',
  category: 'Sirkulasi & Peminjaman',
  message: ''
});

const faqs = [
  {
    q: 'Bagaimana cara melakukan presensi di Kiosk Perpustakaan?',
    a: 'Cukup dekatkan QR Code yang tertera pada Kartu Anggota Digital/Fisik ke sensor scanner di terminal Kiosk. Jika tidak membawa kartu, gunakan tombol "Input NIM / NIDN Manual" pada layar sentuh Kiosk.'
  },
  {
    q: 'Berapa jumlah maksimal dan jangka waktu peminjaman buku?',
    a: 'Mahasiswa dapat meminjam maksimal 3 eksemplar buku selama 7 hari kerja. Dosen dan tenaga pendidik dapat meminjam hingga 5 eksemplar selama 14 hari kerja.'
  },
  {
    q: 'Bagaimana cara melakukan perpanjangan masa pinjam buku?',
    a: 'Perpanjangan dapat dilakukan 1x secara mandiri melalui portal profil pustaka digital atau menghubungi petugas meja sirkulasi sebelum tanggal jatuh tempo.'
  },
  {
    q: 'Bagaimana jika buku yang dipinjam terlambat dikembalikan?',
    a: 'Keterlambatan pengembalian dikenakan denda administratif sebesar Rp 1.000,- per hari per eksemplar buku.'
  },
  {
    q: 'Apakah repository STAH DNJ dapat diakses dari luar kampus?',
    a: 'Ya, koleksi karya ilmiah dan skripsi digital repository STAH DNJ dapat diakses publik melalui portal repository resmi.'
  }
];

const cleanPhone = (phoneStr) => {
  return phoneStr.replace(/[^0-9]/g, '');
};

const submitForm = async () => {
  isSubmitting.value = true;
  submittedSuccess.value = false;

  await new Promise(resolve => setTimeout(resolve, 800));

  isSubmitting.value = false;
  submittedSuccess.value = true;

  form.name = '';
  form.identity = '';
  form.message = '';

  setTimeout(() => {
    submittedSuccess.value = false;
  }, 6000);
};

onMounted(async () => {
  try {
    const res = await getSettings();
    if (res?.success && res.data) {
      siteSettings.value = res.data;
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
});

useHead({
  title: 'Meja Bantuan (Helpdesk) - STAH Dharma Nusantara Jakarta',
  meta: [
    { name: 'description', content: 'Layanan meja bantuan, FAQ, dan kontak pustakawan STAH Dharma Nusantara Jakarta.' }
  ]
});
</script>

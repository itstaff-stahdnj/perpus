<template>
  <div class="min-h-screen bg-surface-bright text-on-background font-body-md flex items-center justify-center py-10 px-margin-mobile sm:px-margin-desktop relative overflow-hidden">
    <!-- Background Accents -->
    <div class="absolute inset-0 opacity-10 pointer-events-none">
      <div class="absolute w-full h-full" style="background-image: radial-gradient(#1b2e4b 1px, transparent 1px); background-size: 32px 32px;"></div>
    </div>
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Animated Modal Overlay for Auth Success / Failure -->
    <Transition name="fade-scale">
      <div v-if="authModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
        
        <!-- SUCCESS MODAL -->
        <div 
          v-if="authModal.type === 'success'"
          class="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl border border-emerald-200 relative overflow-hidden"
        >
          <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 animate-pulse"></div>
          
          <!-- Animated Checkmark Circle -->
          <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner relative">
            <span class="material-symbols-outlined text-5xl animate-scale-check">check_circle</span>
            <div class="absolute inset-0 rounded-full border-4 border-emerald-400/30 animate-ping"></div>
          </div>

          <h3 class="font-extrabold text-xl text-slate-900 mb-1">
            {{ activeAuthTab === 'login' ? 'Masuk Akun Berhasil!' : 'Pendaftaran Berhasil!' }}
          </h3>
          <p class="text-xs text-slate-600 mb-5 leading-relaxed">
            {{ authModal.message || 'Selamat datang di Portal Perpustakaan STAH DNJ.' }}
          </p>

          <!-- Loading Progress Indicator -->
          <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-600 h-full animate-progress-fill"></div>
          </div>
          <p class="text-[10px] text-slate-400 mt-2 font-medium">Mengarahkan Anda ke Halaman Utama...</p>
        </div>

        <!-- ERROR / FAILURE MODAL WITH SHAKE ANIMATION -->
        <div 
          v-else-if="authModal.type === 'error'"
          class="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl border border-rose-200 relative overflow-hidden animate-shake"
        >
          <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-red-500 to-rose-600"></div>

          <!-- Animated Cross Circle -->
          <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shadow-inner relative">
            <span class="material-symbols-outlined text-5xl animate-scale-check">cancel</span>
          </div>

          <h3 class="font-extrabold text-xl text-slate-900 mb-1">
            {{ activeAuthTab === 'login' ? 'Gagal Masuk Akun' : 'Gagal Pendaftaran' }}
          </h3>
          <p class="text-xs text-rose-700 font-bold bg-rose-50 p-3 rounded-xl border border-rose-200 mb-5 leading-relaxed">
            {{ authModal.message || 'Periksa kembali data yang Anda masukkan.' }}
          </p>

          <button 
            type="button" 
            @click="authModal.show = false"
            class="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span class="material-symbols-outlined text-base">refresh</span>
            <span>Coba Lagi</span>
          </button>
        </div>

      </div>
    </Transition>

    <div class="w-full max-w-lg relative z-10">
      <!-- Main Auth Card -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant/60 shadow-2xl space-y-6">
        
        <!-- Header & Logo -->
        <div class="text-center space-y-2">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-secondary mb-1 shadow-md">
            <span class="material-symbols-outlined text-3xl">local_library</span>
          </div>
          <h1 class="font-headline-md text-2xl text-primary font-extrabold">Portal Autentikasi Perpustakaan</h1>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            STAH Dharma Nusantara Jakarta - Layanan Akses Digital &amp; Keanggotaan
          </p>
        </div>

        <!-- Mode Tab Switcher (Masuk vs Daftar) -->
        <div class="flex bg-surface-container-high p-1 rounded-2xl border border-outline-variant/50">
          <button 
            type="button" 
            @click="activeAuthTab = 'login'" 
            class="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            :class="activeAuthTab === 'login' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'"
          >
            <span class="material-symbols-outlined text-base">login</span>
            <span>Masuk Akun</span>
          </button>

          <button 
            type="button" 
            @click="activeAuthTab = 'register'" 
            class="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            :class="activeAuthTab === 'register' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'"
          >
            <span class="material-symbols-outlined text-base">person_add</span>
            <span>Daftar Akun Baru</span>
          </button>
        </div>

        <!-- TAB 1: FORM LOGIN -->
        <form v-if="activeAuthTab === 'login'" @submit.prevent="handleFormLogin" class="space-y-4 text-left">
          <div>
            <label class="block font-bold text-xs text-primary mb-1">NIM / NIDN / Email *</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">person</span>
              <input 
                v-model="loginInput" 
                type="text" 
                required 
                placeholder="Masukkan NIM, NIDN, atau Email..."
                class="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-primary font-medium outline-none focus:border-secondary transition-colors"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-xs text-primary mb-1">Password *</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
              <input 
                v-model="passwordInput" 
                :type="showPassword ? 'text' : 'password'" 
                required 
                placeholder="Masukkan password Anda..."
                class="w-full pl-10 pr-10 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-primary font-medium outline-none focus:border-secondary transition-colors"
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <span class="material-symbols-outlined text-base">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="submitting"
            class="w-full py-3.5 px-6 bg-gradient-to-r from-primary via-blue-900 to-primary hover:from-blue-900 hover:to-primary text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-[98%] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <span class="material-symbols-outlined text-lg" :class="{ 'animate-spin': submitting }">
              {{ submitting ? 'sync' : 'login' }}
            </span>
            <span>{{ submitting ? 'Memproses Otentikasi...' : 'Masuk ke Perpustakaan' }}</span>
          </button>
        </form>

        <!-- TAB 2: FORM REGISTRASI AKUN BARU -->
        <form v-else @submit.prevent="handleFormRegister" class="space-y-3.5 text-left">
          <!-- Role Keanggotaan Select -->
          <div>
            <label class="block font-bold text-xs text-primary mb-1">Peran / Role Keanggotaan *</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">badge</span>
              <select 
                v-model="regRole" 
                required 
                @change="handleRoleChange"
                class="w-full pl-10 pr-8 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-primary font-bold outline-none focus:border-secondary transition-colors appearance-none cursor-pointer"
              >
                <option value="mahasiswa">🎓 Mahasiswa Active</option>
                <option value="dosen">👨‍🏫 Dosen / Tenaga Pengajar</option>
                <option value="umum">👥 Pemustaka Umum / Masyarakat</option>
              </select>
              <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">expand_more</span>
            </div>
          </div>

          <!-- NIM (jika Mahasiswa) / NIDN (jika Dosen) dengan Search AJAX Auto-Fill -->
          <div v-if="regRole === 'mahasiswa'" class="relative">
            <div class="flex items-center justify-between mb-1">
              <label class="font-bold text-xs text-primary">NIM (Nomor Induk Mahasiswa) *</label>
              <span class="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">🔍 Search Master Data API</span>
            </div>

            <div class="relative">
              <input 
                v-model="regNim" 
                type="text" 
                required 
                placeholder="Ketik NIM atau Nama untuk pencarian master data..."
                @input="handleMasterSearch('nim')"
                class="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-primary font-mono font-bold outline-none focus:border-secondary transition-colors"
              />
              <span v-if="searchingMaster" class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 animate-spin text-base">sync</span>
            </div>

            <!-- Dropdown Suggestions List -->
            <div v-if="masterSuggestions.length > 0 && activeSearchField === 'nim'" class="absolute z-30 left-0 right-0 top-full mt-1 bg-white rounded-xl border border-outline-variant shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-100">
              <button 
                v-for="item in masterSuggestions" 
                :key="item.id || item.nim"
                type="button" 
                @click="selectMasterCandidate(item)" 
                class="w-full p-2.5 text-left hover:bg-blue-50 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <p class="font-bold text-xs text-primary leading-tight">{{ item.name }}</p>
                  <p class="text-[10px] text-slate-500 font-mono">NIM: {{ item.nim || '-' }} | {{ item.email }}</p>
                </div>
                <span class="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-full shrink-0">Pilih</span>
              </button>
            </div>
          </div>

          <div v-else-if="regRole === 'dosen'" class="relative">
            <div class="flex items-center justify-between mb-1">
              <label class="font-bold text-xs text-primary">NIDN (Nomor Induk Dosen Nasional) *</label>
              <span class="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">🔍 Search Master Data API</span>
            </div>

            <div class="relative">
              <input 
                v-model="regNidn" 
                type="text" 
                required 
                placeholder="Ketik NIDN atau Nama dosen..."
                @input="handleMasterSearch('nidn')"
                class="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-primary font-mono font-bold outline-none focus:border-secondary transition-colors"
              />
              <span v-if="searchingMaster" class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 animate-spin text-base">sync</span>
            </div>

            <!-- Dropdown Suggestions List -->
            <div v-if="masterSuggestions.length > 0 && activeSearchField === 'nidn'" class="absolute z-30 left-0 right-0 top-full mt-1 bg-white rounded-xl border border-outline-variant shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-100">
              <button 
                v-for="item in masterSuggestions" 
                :key="item.id || item.nidn"
                type="button" 
                @click="selectMasterCandidate(item)" 
                class="w-full p-2.5 text-left hover:bg-blue-50 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <p class="font-bold text-xs text-primary leading-tight">{{ item.name }}</p>
                  <p class="text-[10px] text-slate-500 font-mono">NIDN: {{ item.nidn || '-' }} | {{ item.email }}</p>
                </div>
                <span class="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-full shrink-0">Pilih</span>
              </button>
            </div>
          </div>

          <!-- Matched Candidate Badge -->
          <div v-if="matchedCandidate" class="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-base text-emerald-600">verified</span>
              <span>Master Data Ditemukan: <strong>{{ matchedCandidate.name }}</strong> ({{ matchedCandidate.prodi }})</span>
            </div>
            <button type="button" @click="matchedCandidate = null" class="text-xs text-rose-600 hover:underline cursor-pointer">Batal</button>
          </div>

          <!-- Nama Lengkap -->
          <div>
            <label class="block font-bold text-xs text-primary mb-1">Nama Lengkap *</label>
            <input 
              v-model="regName" 
              type="text" 
              required 
              placeholder="Contoh: Ni Wayan Wadini..."
              class="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-primary font-medium outline-none focus:border-secondary transition-colors"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block font-bold text-xs text-primary mb-1">Alamat Email *</label>
            <input 
              v-model="regEmail" 
              type="email" 
              required 
              placeholder="nama@email.com"
              class="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-primary font-medium outline-none focus:border-secondary transition-colors"
            />
          </div>

          <!-- Program Studi (Khusus Mahasiswa & Dosen) -->
          <div v-if="regRole === 'mahasiswa' || regRole === 'dosen'">
            <label class="block font-bold text-xs text-primary mb-1">Program Studi *</label>
            <select 
              v-model="regProdi" 
              required
              class="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-primary font-bold outline-none focus:border-secondary transition-colors cursor-pointer"
            >
              <option value="Pendidikan Agama Hindu">Pendidikan Agama Hindu</option>
              <option value="Ilmu Komunikasi Hindu">Ilmu Komunikasi Hindu</option>
            </select>
          </div>

          <!-- No Whatsapp -->
          <div>
            <label class="block font-bold text-xs text-primary mb-1">Nomor WhatsApp / HP</label>
            <input 
              v-model="regWhatsapp" 
              type="tel" 
              placeholder="Contoh: 081234567890"
              class="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-primary font-medium outline-none focus:border-secondary transition-colors"
            />
          </div>

          <!-- Password & Konfirmasi Password -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-xs text-primary mb-1">Password *</label>
              <input 
                v-model="regPassword" 
                type="password" 
                required 
                placeholder="Minimal 6 karakter"
                class="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-primary font-medium outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div>
              <label class="block font-bold text-xs text-primary mb-1">Ulangi Password *</label>
              <input 
                v-model="regConfirmPassword" 
                type="password" 
                required 
                placeholder="Konfirmasi password"
                class="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-primary font-medium outline-none focus:border-secondary transition-colors"
              />
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="submitting"
            class="w-full mt-2 py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-[98%] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <span class="material-symbols-outlined text-lg" :class="{ 'animate-spin': submitting }">
              {{ submitting ? 'sync' : 'how_to_reg' }}
            </span>
            <span>{{ submitting ? 'Mendaftarkan Akun Baru...' : 'Daftarkan Akun Keanggotaan' }}</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative flex items-center justify-center py-1">
          <div class="border-t border-outline-variant/60 w-full"></div>
          <span class="bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant shrink-0">opsi lainnya</span>
        </div>

        <!-- External SSO Portal Link -->
        <a 
          href="https://portal-perpus.stahdnj.ac.id/sso/perpus" 
          class="w-full py-2.5 px-4 bg-surface-container-high hover:bg-secondary/10 text-primary font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-outline-variant/60"
        >
          <span class="material-symbols-outlined text-base">open_in_new</span>
          <span>Masuk via External Portal SSO</span>
        </a>

        <!-- Footer Back Link -->
        <div class="pt-3 border-t border-outline-variant/60 text-center text-xs text-on-surface-variant">
          <NuxtLink to="/" class="text-primary font-bold hover:underline inline-flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">arrow_back</span>
            <span>Kembali ke Beranda Utama</span>
          </NuxtLink>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePustakaApi } from '~/composables/usePustakaApi';

definePageMeta({
  layout: false
});

const router = useRouter();
const route = useRoute();
const { login, registerUser } = usePustakaApi();

// Tab state: 'login' | 'register'
const activeAuthTab = ref<string>((route.query.tab as string) === 'register' ? 'register' : 'login');

// Form Login states
const loginInput = ref('');
const passwordInput = ref('');
const showPassword = ref(false);

// Form Register states
const regName = ref('');
const regEmail = ref('');
const regRole = ref('mahasiswa');
const regNim = ref('');
const regNidn = ref('');
const regProdi = ref('Pendidikan Agama Hindu');
const regWhatsapp = ref('');
const regPassword = ref('');
const regConfirmPassword = ref('');

// Master Data AJAX Auto-Search states
const searchingMaster = ref(false);
const masterSuggestions = ref<any[]>([]);
const activeSearchField = ref<'nim' | 'nidn' | null>(null);
const matchedCandidate = ref<any>(null);
let searchDebounceTimer: any = null;

// Auth Result Modal State (Success / Error)
const authModal = ref<{
  show: boolean;
  type: 'success' | 'error';
  message: string;
}>({
  show: false,
  type: 'success',
  message: ''
});

const handleRoleChange = () => {
  masterSuggestions.value = [];
  matchedCandidate.value = null;
  activeSearchField.value = null;
};

const handleMasterSearch = (fieldType: 'nim' | 'nidn') => {
  activeSearchField.value = fieldType;
  const inputVal = fieldType === 'nim' ? regNim.value.trim() : regNidn.value.trim();

  if (!inputVal || inputVal.length < 2) {
    masterSuggestions.value = [];
    return;
  }

  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(async () => {
    searchingMaster.value = true;
    try {
      const res: any = await $fetch(`/api/backup/search-member?query=${encodeURIComponent(inputVal)}`);
      if (res?.success && Array.isArray(res.results)) {
        masterSuggestions.value = res.results;

        // Auto match if exact match found
        const exact = res.results.find((u: any) => 
          (fieldType === 'nim' && u.nim === inputVal) || 
          (fieldType === 'nidn' && u.nidn === inputVal)
        );
        if (exact) {
          selectMasterCandidate(exact);
        }
      }
    } catch (err) {
      console.warn('Master search AJAX error:', err);
    } finally {
      searchingMaster.value = false;
    }
  }, 350);
};

const selectMasterCandidate = (candidate: any) => {
  matchedCandidate.value = candidate;

  // Autofill hanya Nama Lengkap & Program Studi
  if (candidate.name) regName.value = candidate.name;
  if (candidate.prodi) {
    if (candidate.prodi.toLowerCase().includes('komunikasi')) {
      regProdi.value = 'Ilmu Komunikasi Hindu';
    } else {
      regProdi.value = 'Pendidikan Agama Hindu';
    }
  }
  masterSuggestions.value = [];
};

const submitting = ref(false);

const handleFormLogin = async () => {
  if (!loginInput.value.trim() || !passwordInput.value.trim()) return;

  submitting.value = true;
  authModal.value.show = false;

  try {
    const res = await login(loginInput.value, passwordInput.value);
    if (res.success) {
      authModal.value = {
        show: true,
        type: 'success',
        message: res.message || 'Login Berhasil! Otentikasi terverifikasi.'
      };

      setTimeout(() => {
        router.push('/');
      }, 1200);
    } else {
      authModal.value = {
        show: true,
        type: 'error',
        message: res.message || 'Login gagal. Periksa kembali NIM/NIDN/Email dan password Anda.'
      };
    }
  } catch (err: any) {
    authModal.value = {
      show: true,
      type: 'error',
      message: err?.message || 'Terjadi kesalahan saat autentikasi.'
    };
  } finally {
    submitting.value = false;
  }
};

const handleFormRegister = async () => {
  if (!regName.value.trim() || !regEmail.value.trim() || !regPassword.value.trim()) {
    authModal.value = {
      show: true,
      type: 'error',
      message: 'Nama, Email, dan Password wajib diisi.'
    };
    return;
  }

  if (regPassword.value !== regConfirmPassword.value) {
    authModal.value = {
      show: true,
      type: 'error',
      message: 'Password dan konfirmasi password tidak cocok.'
    };
    return;
  }

  submitting.value = true;
  authModal.value.show = false;

  try {
    const payload = {
      name: regName.value.trim(),
      email: regEmail.value.trim(),
      password: regPassword.value.trim(),
      role: regRole.value,
      nim: regNim.value.trim() || undefined,
      nidn: regNidn.value.trim() || undefined,
      whatsapp: regWhatsapp.value.trim() || undefined,
      prodi: (regRole.value === 'mahasiswa' || regRole.value === 'dosen') ? regProdi.value : undefined
    };

    const res = await registerUser(payload);
    if (res.success) {
      authModal.value = {
        show: true,
        type: 'success',
        message: res.message || 'Pendaftaran Berhasil! Akun keanggotaan Anda telah aktif.'
      };

      setTimeout(() => {
        router.push('/');
      }, 1200);
    } else {
      authModal.value = {
        show: true,
        type: 'error',
        message: res.message || 'Gagal mendaftarkan akun baru.'
      };
    }
  } catch (err: any) {
    authModal.value = {
      show: true,
      type: 'error',
      message: err?.message || 'Terjadi kesalahan saat pendaftaran.'
    };
  } finally {
    submitting.value = false;
  }
};

useHead({
  title: 'Masuk & Daftar Akun Perpustakaan - STAH Dharma Nusantara Jakarta',
  meta: [
    { name: 'description', content: 'Masuk atau daftarkan akun keanggotaan baru di portal layanan digital perpustakaan STAH Dharma Nusantara Jakarta.' }
  ]
});
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-10px); }
  40%, 80% { transform: translateX(10px); }
}
.animate-shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes progressFill {
  0% { width: 0%; }
  100% { width: 100%; }
}
.animate-progress-fill {
  animation: progressFill 1.2s ease-in-out forwards;
}

@keyframes scaleCheck {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}
.animate-scale-check {
  animation: scaleCheck 0.4s ease-out forwards;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.92);
}
</style>

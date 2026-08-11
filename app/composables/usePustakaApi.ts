export interface Book {
  id: number;
  isbn?: string;
  judul: string;
  slug?: string;
  penulis?: string;
  penerbit?: string;
  tahun_terbit?: string;
  cover_image?: string;
  cover_image_url?: string;
  deskripsi?: string;
  stok?: number;
  rating_avg?: number;
  reviews_count?: number;
  kategori?: {
    id: number;
    nama_kategori: string;
    slug?: string;
  } | string;
  category?: {
    id: number;
    nama_kategori: string;
    slug?: string;
  } | string;
  ddc?: string;
  kode_ddc?: string;
  klasifikasi?: string;
  no_panggil?: string;
  nomor_panggil?: string;
  call_number?: string;
}

export interface Category {
  id: number;
  nama_kategori: string;
  slug?: string;
  deskripsi?: string;
  books_count?: number;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  status_keanggotaan: string;
  nim?: string;
  nidn?: string;
  prodi?: string;
  whatsapp?: string;
  bebas_pustaka?: boolean;
  qr_token?: string;
  avatar_url?: string;
  badges?: string[];
}

export interface NewsItem {
  id: number;
  title: string;
  slug?: string;
  content?: string;
  summary?: string;
  category?: string;
  image_url?: string;
  thumbnail_url?: string;
  author_name?: string;
  author?: {
    name: string;
  };
  published_at?: string;
  created_at?: string;
}

export interface AnnouncementItem {
  id: number;
  title: string;
  content?: string;
  type?: string;
  is_active?: boolean;
  published_at?: string;
  created_at?: string;
}

export interface TestimonialItem {
  id: number;
  name: string;
  role?: string;
  nim?: string;
  avatar_url?: string;
  content: string;
  rating?: number;
  created_at?: string;
}

export interface AttendanceUser {
  id: number;
  name: string;
  nim?: string;
  nidn?: string | null;
  role: string;
  prodi?: string;
  avatar_url?: string;
}

export interface AttendanceRecord {
  id: number;
  user: AttendanceUser;
  tanggal: string;
  created_at: string;
}

export interface AttendanceTodayResponse {
  tanggal: string;
  total_hadir: number;
  daftar_hadir: AttendanceRecord[];
}

export interface ReviewItem {
  id: number;
  book_id: number;
  user_name: string;
  rating: number;
  ulasan: string;
  created_at?: string;
}

export interface ActivityToastItem {
  id?: number | string;
  user_name: string;
  action_title: string;
  book_title: string;
  book_id?: number | string;
  book_cover?: string;
  time_formatted?: string;
}

export interface SiteSettings {
  id?: number;
  app_name?: string;
  logo_url?: string;
  primary_color?: string;
  warning_color?: string;
  max_hari_pinjam?: number;
  max_pinjam_buku?: number;
  denda_per_hari?: number;
  hero_title?: string;
  hero_subtitle?: string;
  hero_bg_image?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_whatsapp?: string;
  address?: string;
  operating_hours?: {
    weekday?: string;
    friday?: string;
    weekend?: string;
  };
}

export const usePustakaApi = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl || 'https://portal-perpus.stahdnj.ac.id/api';
  const apiKey = config.public.pustakaApiKey || config.pustakaApiKey || 'stah_lib_7f3e9a1b8c2d4e6f5a0b9c8d7e6f5a4b';
  const tokenCookie = useCookie<string | null>('pustaka_token', { 
    maxAge: 60 * 60 * 24 * 7, 
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });

  const getHeaders = (extraHeaders?: Record<string, string>) => {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'x-api-key': apiKey,
      ...extraHeaders
    };
    const tok = tokenCookie.value || 
      useCookie('token').value || 
      (process.client ? (localStorage.getItem('pustaka_token') || localStorage.getItem('token')) : null);

    if (tok) {
      headers['Authorization'] = `Bearer ${tok}`;
    }
    return headers;
  };

  const login = async (emailOrNim: string, password: string): Promise<{ success: boolean; message: string; data?: any; token?: string }> => {
    try {
      const cleanInput = emailOrNim.trim();
      const isEmail = cleanInput.includes('@');

      const bodyPayload: Record<string, any> = {
        login: cleanInput,
        password: password
      };

      if (isEmail) {
        bodyPayload.email = cleanInput;
      } else {
        bodyPayload.nim = cleanInput;
        bodyPayload.email = cleanInput;
        bodyPayload.username = cleanInput;
        bodyPayload.identity = cleanInput;
      }

      let res: any = null;
      try {
        res = await $fetch<{ success: boolean; token?: string; data?: any; message?: string }>(`${baseUrl}/auth/login`, {
          method: 'POST',
          headers: getHeaders({ 'Content-Type': 'application/json' }),
          body: bodyPayload
        });
      } catch (err: any) {
        if (err?.status === 404 || err?.statusCode === 404) {
          res = await $fetch<{ success: boolean; token?: string; data?: any; message?: string }>(`${baseUrl}/login`, {
            method: 'POST',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: bodyPayload
          });
        } else {
          throw err;
        }
      }

      if (res?.success) {
        const token = res.token || res.data?.token || res.data?.access_token;
        if (token) {
          tokenCookie.value = token;
        }
        return {
          success: true,
          message: res.message || 'Login berhasil!',
          data: res.data || res.user,
          token
        };
      }
      return { success: false, message: res?.message || 'Login gagal. Periksa kembali NIM/Email dan password Anda.' };
    } catch (e: any) {
      let errorMsg = 'Gagal melakukan otentikasi. Silakan periksa kredensial Anda.';
      if (e?.data?.errors && typeof e.data.errors === 'object') {
        const fieldErrors = Object.values(e.data.errors).flat().filter(Boolean);
        if (fieldErrors.length > 0) {
          errorMsg = fieldErrors.join(' ');
        }
      } else if (e?.data?.message) {
        errorMsg = e.data.message;
      } else if (e?.message) {
        errorMsg = e.message;
      }
      return { success: false, message: errorMsg };
    }
  };

  const logout = async () => {
    if (tokenCookie.value) {
      try {
        await $fetch(`${baseUrl}/logout`, {
          method: 'POST',
          headers: getHeaders()
        }).catch(() => {});
      } catch {}
    }
    tokenCookie.value = null;
  };

  const getProfile = async (): Promise<{ success: boolean; data: UserProfile; user?: UserProfile; bebas_pustaka?: boolean; badges?: string[] }> => {
    try {
      let res = await $fetch<any>(`${baseUrl}/me`, {
        headers: getHeaders()
      }).catch(() => null);

      if (!res) {
        res = await $fetch<any>(`${baseUrl}/auth/me`, {
          headers: getHeaders()
        }).catch(() => null);
      }

      if (!res) return { success: false, data: null as any };

      const userObj = res?.data?.user || res?.data || res?.user || res;
      return {
        success: res?.success ?? true,
        data: userObj,
        user: userObj,
        bebas_pustaka: res?.data?.bebas_pustaka ?? res?.bebas_pustaka,
        badges: res?.data?.badges ?? res?.badges
      };
    } catch (e) {
      console.error('getProfile error:', e);
      return { success: false, data: null as any };
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile> & { password?: string }): Promise<{ success: boolean; message: string; data?: UserProfile }> => {
    try {
      let res: any = null;
      try {
        res = await $fetch<any>(`${baseUrl}/me/profile`, {
          method: 'PUT',
          headers: getHeaders({ 'Content-Type': 'application/json' }),
          body: profileData
        });
      } catch (err: any) {
        if (err?.status === 404 || err?.statusCode === 404) {
          res = await $fetch<any>(`${baseUrl}/me`, {
            method: 'PUT',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: profileData
          });
        } else {
          throw err;
        }
      }
      return { success: res?.success ?? true, message: res?.message || 'Profil berhasil diperbarui!', data: res?.data };
    } catch (e: any) {
      return { success: false, message: e?.data?.message || e?.message || 'Gagal memperbarui profil' };
    }
  };

  const getBooks = async (params?: Record<string, any>): Promise<{ success: boolean; data: Book[]; meta?: any }> => {
    try {
      const res = await $fetch<any>(`${baseUrl}/books`, {
        headers: getHeaders(),
        params
      });
      if (Array.isArray(res)) return { success: true, data: res };
      if (res?.data && Array.isArray(res.data)) return { success: true, data: res.data, meta: res.meta };
      if (res?.success && Array.isArray(res.data)) return res;
      return { success: false, data: [] };
    } catch (e) {
      console.error('getBooks error:', e);
      return { success: false, data: [] };
    }
  };

  const getBookById = async (id: number | string): Promise<{ success: boolean; data: Book }> => {
    try {
      const res = await $fetch<any>(`${baseUrl}/books/${id}`, {
        headers: getHeaders()
      });
      if (res?.data && typeof res.data === 'object') return { success: true, data: res.data };
      if (res?.judul) return { success: true, data: res };
      return { success: false, data: res?.data || res };
    } catch (e) {
      console.error('getBookById error:', e);
      return { success: false, data: null as any };
    }
  };

  const getCategories = async (): Promise<{ success: boolean; data: Category[] }> => {
    try {
      const res = await $fetch<any>(`${baseUrl}/categories`, {
        headers: getHeaders()
      });
      if (Array.isArray(res)) return { success: true, data: res };
      if (res?.data && Array.isArray(res.data)) return { success: true, data: res.data };
      if (res?.success && Array.isArray(res.data)) return res;
      return { success: false, data: [] };
    } catch (e) {
      console.error('getCategories error:', e);
      return { success: false, data: [] };
    }
  };

  // Record Staff Activity Heartbeat
  const recordStaffHeartbeat = async () => {
    if (!process.client) return;
    const now = Date.now();
    try {
      localStorage.setItem('pustaka_staff_last_active', String(now));
      await $fetch<any>(`${baseUrl}/staff-status/heartbeat`, {
        method: 'POST',
        headers: getHeaders()
      }).catch(() => null);
    } catch (e) {}
  };

  // Get Staff Online Status (30-Minute Inactivity Timeout)
  const getStaffStatus = async (): Promise<{ success: boolean; is_online: boolean; online_count: number; message: string; online_staff: any[]; last_active_minutes?: number }> => {
    // Inactivity Threshold: 30 Minutes (1,800,000 ms)
    const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

    let localLastActive = 0;
    if (process.client) {
      const stored = localStorage.getItem('pustaka_staff_last_active');
      if (stored) localLastActive = parseInt(stored, 10) || 0;
    }

    try {
      const res = await $fetch<any>(`${baseUrl}/staff-status`, {
        headers: getHeaders()
      });

      let backendOnline = res?.is_online ?? true;
      let lastActiveTime = res?.last_active_at ? new Date(res.last_active_at).getTime() : localLastActive;
      
      if (!lastActiveTime && localLastActive) {
        lastActiveTime = localLastActive;
      }

      let isOnline = backendOnline;

      // If last activity is older than 30 minutes, automatically mark OFFLINE
      if (lastActiveTime > 0) {
        const timeDiff = Date.now() - lastActiveTime;
        if (timeDiff > INACTIVITY_TIMEOUT_MS) {
          isOnline = false;
        }
      }

      const minutesAgo = lastActiveTime > 0 ? Math.floor((Date.now() - lastActiveTime) / 60000) : 0;

      return {
        success: res?.success ?? true,
        is_online: isOnline,
        online_count: isOnline ? (res?.online_count || 1) : 0,
        message: isOnline ? 'Petugas Pustaka Online (Siap Olah Reservasi)' : 'Petugas Pustaka Offline (Tidak aktif > 30 menit)',
        online_staff: res?.online_staff || [],
        last_active_minutes: minutesAgo
      };
    } catch (e) {
      // Fallback check using local activity timestamp
      let isOnline = true;
      let minutesAgo = 0;
      if (localLastActive > 0) {
        const diff = Date.now() - localLastActive;
        if (diff > INACTIVITY_TIMEOUT_MS) {
          isOnline = false;
        }
        minutesAgo = Math.floor(diff / 60000);
      }
      return { 
        success: true, 
        is_online: isOnline, 
        online_count: isOnline ? 1 : 0, 
        message: isOnline ? 'Petugas Pustaka Online' : 'Petugas Pustaka Offline', 
        online_staff: [],
        last_active_minutes: minutesAgo
      };
    }
  };

  // Self Borrow (Peminjaman Mandiri)
  const selfBorrow = async (bookCopyIdOrQr: number | string, durasiHari: number = 7): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      const bodyPayload = typeof bookCopyIdOrQr === 'number' 
        ? { book_id: bookCopyIdOrQr, book_copy_id: bookCopyIdOrQr, durasi_hari: durasiHari }
        : { barcode_qr_buku: bookCopyIdOrQr, durasi_hari: durasiHari };

      let res: any = await $fetch<any>('/api/pustaka/loans/self-borrow', {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: bodyPayload
      }).catch(() => null);

      if (!res) {
        res = await $fetch<any>(`${baseUrl}/loans/self-borrow`, {
          method: 'POST',
          headers: getHeaders({ 'Content-Type': 'application/json' }),
          body: bodyPayload
        });
      }

      return { success: res?.success ?? true, message: res?.message || 'Peminjaman mandiri berhasil diproses!', data: res?.data };
    } catch (e: any) {
      return { success: false, message: e?.data?.message || e?.message || 'Gagal memproses peminjaman mandiri' };
    }
  };

  const getLoans = async (status?: string): Promise<{ success: boolean; data: any[] }> => {
    try {
      const res = await $fetch<any>(`${baseUrl}/loans`, {
        headers: getHeaders(),
        params: status ? { status } : undefined
      });
      if (res?.data && Array.isArray(res.data)) return { success: true, data: res.data };
      if (Array.isArray(res)) return { success: true, data: res };
      return { success: false, data: [] };
    } catch (e) {
      return { success: false, data: [] };
    }
  };

  const extendLoan = async (loanId: number | string): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      const res = await $fetch<any>(`${baseUrl}/loans/extend/${loanId}`, {
        method: 'POST',
        headers: getHeaders()
      });
      return { success: res?.success ?? true, message: res?.message || 'Tenggat peminjaman berhasil diperpanjang 7 hari!', data: res?.data };
    } catch (e: any) {
      return { success: false, message: e?.data?.message || e?.message || 'Gagal memperpanjang peminjaman' };
    }
  };

  const returnLoan = async (loanId: number | string): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      const res = await $fetch<any>(`${baseUrl}/loans/return/${loanId}`, {
        method: 'POST',
        headers: getHeaders()
      });
      return { success: res?.success ?? true, message: res?.message || 'Pengembalian buku berhasil diproses!', data: res?.data };
    } catch (e: any) {
      return { success: false, message: e?.data?.message || e?.message || 'Gagal memproses pengembalian buku' };
    }
  };

  // Reservations
  const createReservation = async (bookId: number | string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await $fetch<any>(`${baseUrl}/reservations`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: { book_id: bookId }
      });
      return { success: res?.success ?? true, message: res?.message || 'Reservasi berhasil dibuat!' };
    } catch (e: any) {
      return { success: false, message: e?.data?.message || 'Gagal membuat reservasi.' };
    }
  };

  const updateReservationStatus = async (reservationId: number | string, status: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await $fetch<any>(`${baseUrl}/reservations/${reservationId}`, {
        method: 'PUT',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: { status }
      });
      return { success: res?.success ?? true, message: res?.message || 'Status reservasi berhasil diperbarui!' };
    } catch (e: any) {
      return { success: false, message: e?.data?.message || 'Gagal memperbarui status reservasi.' };
    }
  };

  const getReservations = async (myReservations: boolean = true): Promise<{ success: boolean; data: any[] }> => {
    try {
      const res = await $fetch<any>(`${baseUrl}/reservations`, {
        headers: getHeaders(),
        params: myReservations ? { my_reservations: 1 } : undefined
      });
      if (res?.data && Array.isArray(res.data)) return { success: true, data: res.data };
      if (Array.isArray(res)) return { success: true, data: res };
      return { success: false, data: [] };
    } catch (e) {
      return { success: false, data: [] };
    }
  };

  // Reviews
  const createReview = async (bookId: number | string, rating: number, ulasan: string): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      const res = await $fetch<any>(`${baseUrl}/reviews`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: { book_id: Number(bookId), rating, ulasan }
      });
      return { success: res?.success ?? true, message: res?.message || 'Ulasan & rating berhasil dikirim!', data: res?.data };
    } catch (e: any) {
      return { success: false, message: e?.data?.message || e?.message || 'Gagal mengirimkan ulasan' };
    }
  };

  const getReviews = async (bookId?: number | string): Promise<{ success: boolean; data: ReviewItem[] }> => {
    try {
      return await $fetch(`${baseUrl}/reviews`, {
        headers: getHeaders(),
        params: bookId ? { book_id: bookId } : undefined
      });
    } catch (e) {
      return { success: false, data: [] };
    }
  };

  // Wishlist Pemustaka
  const getWishlist = async (): Promise<{ success: boolean; data: Book[] }> => {
    try {
      const res = await $fetch<any>(`${baseUrl}/wishlist`, {
        headers: getHeaders()
      });
      if (res?.data && Array.isArray(res.data)) return { success: true, data: res.data };
      if (Array.isArray(res)) return { success: true, data: res };
      return { success: false, data: [] };
    } catch (e) {
      return { success: false, data: [] };
    }
  };

  const addToWishlist = async (bookId: number | string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await $fetch<any>(`${baseUrl}/wishlist`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: { book_id: Number(bookId) }
      });
      return { success: res?.success ?? true, message: res?.message || 'Buku berhasil ditambahkan ke Wishlist!' };
    } catch (e: any) {
      return { success: false, message: e?.data?.message || e?.message || 'Gagal menyukai buku' };
    }
  };

  const removeFromWishlist = async (bookId: number | string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await $fetch<any>(`${baseUrl}/wishlist/${bookId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return { success: res?.success ?? true, message: res?.message || 'Buku dihapus dari Wishlist!' };
    } catch (e: any) {
      return { success: false, message: e?.data?.message || e?.message || 'Gagal menghapus dari Wishlist' };
    }
  };

  // Realtime Activity Toast
  const getRecentActivities = async (): Promise<{ success: boolean; data: ActivityToastItem[] }> => {
    try {
      return await $fetch(`${baseUrl}/aktivitas-terbaru`, {
        headers: getHeaders()
      });
    } catch (e) {
      return { success: false, data: [] };
    }
  };

  const getNews = async (): Promise<{ success: boolean; data: NewsItem[]; message?: string }> => {
    return await $fetch(`${baseUrl}/news`, {
      headers: getHeaders()
    });
  };

  const getNewsById = async (id: number | string): Promise<{ success: boolean; data: NewsItem; message?: string }> => {
    try {
      return await $fetch(`${baseUrl}/news/${id}`, {
        headers: getHeaders()
      });
    } catch (e) {
      const all = await getNews();
      const target = all.data?.find(n => String(n.id) === String(id));
      if (target) {
        return { success: true, data: target };
      }
      throw e;
    }
  };

  const getAnnouncements = async (): Promise<{ success: boolean; data: AnnouncementItem[]; message?: string }> => {
    return await $fetch(`${baseUrl}/announcements`, {
      headers: getHeaders()
    });
  };

  const getTestimonials = async (): Promise<{ success: boolean; data: TestimonialItem[]; message?: string }> => {
    return await $fetch(`${baseUrl}/testimonials`, {
      headers: getHeaders()
    });
  };

  const createTestimonial = async (content: string, rating: number = 5, name?: string, role?: string): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      const res = await $fetch<any>(`${baseUrl}/testimonials`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: { content, rating, name, role }
      });
      return { success: res?.success ?? true, message: res?.message || 'Testimoni Anda berhasil dikirimkan!', data: res?.data };
    } catch (e: any) {
      return { success: false, message: e?.data?.message || e?.message || 'Gagal mengirimkan testimoni' };
    }
  };

  const getSettings = async (): Promise<{ success: boolean; data: SiteSettings; message?: string }> => {
    try {
      const res = await $fetch<{ success: boolean; data: any; message?: string }>(`${baseUrl}/settings`, {
        headers: getHeaders()
      });
      if (res?.success && res.data) {
        const raw = res.data;
        let logo = raw.logo_url;
        if (logo && typeof logo === 'string' && logo.startsWith('/')) {
          const apiDomain = baseUrl.replace(/\/api\/?$/, '');
          logo = `${apiDomain}${logo}`;
        }
        return { 
          success: true, 
          message: res.message,
          data: { 
            ...raw,
            logo_url: logo
          } 
        };
      }
    } catch (e: any) {
      console.error('Settings fetch error:', e);
    }
    return { success: false, data: {} as SiteSettings, message: 'Gagal mengambil data pengaturan' };
  };

  const getAttendanceToday = async (): Promise<{ success: boolean; data: AttendanceTodayResponse; message?: string }> => {
    return await $fetch(`${baseUrl}/attendances/today`, {
      headers: getHeaders()
    });
  };

  const getAttendances = async (params?: Record<string, any>): Promise<{ success: boolean; data: AttendanceRecord[]; meta?: any; message?: string }> => {
    return await $fetch(`${baseUrl}/attendances`, {
      headers: getHeaders(),
      params
    });
  };

  const getUsers = async (params?: Record<string, any>): Promise<{ success: boolean; data: any[]; meta?: any; message?: string }> => {
    return await $fetch(`${baseUrl}/users`, {
      headers: getHeaders(),
      params
    });
  };

  const getPublicStats = async (): Promise<{ success: boolean; data: { total_books?: number; total_categories?: number; total_members?: number } }> => {
    try {
      const res = await $fetch<any>(`${baseUrl}/stats`, {
        headers: getHeaders()
      }).catch(() => null);
      if (res?.data || res?.total_books) return { success: true, data: res.data || res };
    } catch {}
    return { success: false, data: {} };
  };

  const submitAttendance = async (
    identifier: string, 
    type?: 'NIM' | 'NIDN' | 'QR'
  ): Promise<{ success: boolean; message: string; data?: AttendanceRecord }> => {
    try {
      const cleanId = identifier.trim();
      const body: Record<string, any> = {
        qr_token: cleanId,
        nim: cleanId,
        nidn: cleanId,
        type: type || 'NIM'
      };

      const res = await $fetch<{ success: boolean; message: string; data?: any }>(`${baseUrl}/attendances`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body
      });
      return {
        success: res?.success ?? false,
        message: res?.message || 'Presensi kedatangan berhasil dicatat.',
        data: res?.data
      };
    } catch (e: any) {
      const errorMsg = e?.data?.message || e?.message || 'Gagal mencatat presensi. NIM/NIDN/QR Token tidak ditemukan.';
      return {
        success: false,
        message: errorMsg
      };
    }
  };

  const createBook = async (bookData: Partial<Book>): Promise<{ success: boolean; data?: Book; message?: string }> => {
    try {
      const res = await $fetch<{ success: boolean; data?: any; message?: string }>(`${baseUrl}/books`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: bookData
      });
      return { success: res?.success ?? true, data: res?.data, message: res?.message || 'Buku berhasil ditambahkan!' };
    } catch (e: any) {
      return { success: false, message: e?.data?.message || e?.message || 'Gagal menambah buku' };
    }
  };

  const updateBook = async (id: number | string, bookData: Partial<Book>): Promise<{ success: boolean; data?: Book; message?: string }> => {
    try {
      const res = await $fetch<{ success: boolean; data?: any; message?: string }>(`${baseUrl}/books/${id}`, {
        method: 'PUT',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: bookData
      });
      return { success: res?.success ?? true, data: res?.data, message: res?.message || 'Buku berhasil diperbarui!' };
    } catch (e: any) {
      return { success: false, message: e?.data?.message || e?.message || 'Gagal memperbarui buku' };
    }
  };

  const deleteBook = async (id: number | string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await $fetch<{ success: boolean; message?: string }>(`${baseUrl}/books/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return { success: res?.success ?? true, message: res?.message || 'Buku berhasil dihapus!' };
    } catch (e: any) {
      return { success: false, message: e?.data?.message || e?.message || 'Gagal menghapus buku' };
    }
  };

  return {
    baseUrl,
    apiKey,
    tokenCookie,
    getHeaders,
    login,
    logout,
    getProfile,
    updateProfile,
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getCategories,
    selfBorrow,
    getLoans,
    extendLoan,
    returnLoan,
    createReservation,
    updateReservationStatus,
    getReservations,
    createReview,
    getReviews,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    getRecentActivities,
    getNews,
    getNewsById,
    getAnnouncements,
    getTestimonials,
    createTestimonial,
    getSettings,
    getAttendanceToday,
    getAttendances,
    getUsers,
    getPublicStats,
    submitAttendance,
    getStaffStatus,
    recordStaffHeartbeat
  };
};

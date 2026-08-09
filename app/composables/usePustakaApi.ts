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
  qr_token?: string;
  avatar_url?: string;
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
  const tokenCookie = useCookie<string | null>('pustaka_token', { maxAge: 60 * 60 * 24 * 7 });

  const getHeaders = (extraHeaders?: Record<string, string>) => {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'x-api-key': apiKey,
      ...extraHeaders
    };
    if (tokenCookie.value) {
      headers['Authorization'] = `Bearer ${tokenCookie.value}`;
    }
    return headers;
  };

  const login = async (emailOrNim: string, password: string): Promise<{ success: boolean; message: string; data?: any; token?: string }> => {
    try {
      const cleanInput = emailOrNim.trim();
      const isEmail = cleanInput.includes('@');

      // Prepare payload to fit common Laravel auth validators
      const bodyPayload: Record<string, any> = {
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
        res = await $fetch<{ success: boolean; token?: string; data?: any; message?: string }>(`${baseUrl}/login`, {
          method: 'POST',
          headers: getHeaders({ 'Content-Type': 'application/json' }),
          body: bodyPayload
        });
      } catch (err: any) {
        if (err?.status === 404 || err?.statusCode === 404) {
          res = await $fetch<{ success: boolean; token?: string; data?: any; message?: string }>(`${baseUrl}/auth/login`, {
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

      // Handle Laravel HTTP 422 Validation Errors
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

  const getLoans = async (): Promise<{ success: boolean; data: any[] }> => {
    return await $fetch(`${baseUrl}/loans`, {
      headers: getHeaders()
    });
  };

  const getProfile = async (): Promise<{ success: boolean; data: any; user?: any }> => {
    return await $fetch(`${baseUrl}/me`, {
      headers: getHeaders()
    });
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
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getCategories,
    getLoans,
    getProfile,
    getNews,
    getNewsById,
    getAnnouncements,
    getTestimonials,
    getSettings,
    getAttendanceToday,
    getAttendances,
    getUsers,
    submitAttendance
  };
};

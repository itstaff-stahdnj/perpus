export interface Book {
  id: number;
  isbn?: string;
  judul: string;
  slug?: string;
  penulis?: string;
  penerbit?: string;
  tahun_terbit?: string;
  cover_image?: string;
  deskripsi?: string;
  stok?: number;
  kategori?: {
    id: number;
    nama_kategori: string;
  };
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
  published_at?: string;
  created_at?: string;
}

export interface AnnouncementItem {
  id: number;
  title: string;
  content?: string;
  type?: string;
  is_active?: boolean;
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
  const baseUrl = config.public.apiBaseUrl || 'https://api-pustaka.stahdnj.ac.id/api';
  const apiKey = config.pustakaApiKey || 'stah_lib_7f3e9a1b8c2d4e6f5a0b9c8d7e6f5a4b';

  const defaultHeaders = {
    'Accept': 'application/json',
    'x-api-key': apiKey
  };

  const getBooks = async (params?: Record<string, any>): Promise<{ success: boolean; data: Book[]; meta?: any }> => {
    return await $fetch(`${baseUrl}/books`, {
      headers: defaultHeaders,
      params
    });
  };

  const getBookById = async (id: number | string): Promise<{ success: boolean; data: Book }> => {
    return await $fetch(`${baseUrl}/books/${id}`, {
      headers: defaultHeaders
    });
  };

  const getCategories = async (): Promise<{ success: boolean; data: Category[] }> => {
    return await $fetch(`${baseUrl}/categories`, {
      headers: defaultHeaders
    });
  };

  const getLoans = async (): Promise<{ success: boolean; data: any[] }> => {
    return await $fetch(`${baseUrl}/loans`, {
      headers: defaultHeaders
    });
  };

  const getProfile = async (): Promise<{ success: boolean; data: { user: UserProfile } }> => {
    return await $fetch(`${baseUrl}/me`, {
      headers: defaultHeaders
    });
  };

  const getNews = async (): Promise<{ success: boolean; data: NewsItem[]; message?: string }> => {
    return await $fetch(`${baseUrl}/news`, {
      headers: defaultHeaders
    });
  };

  const getNewsById = async (id: number | string): Promise<{ success: boolean; data: NewsItem; message?: string }> => {
    try {
      return await $fetch(`${baseUrl}/news/${id}`, {
        headers: defaultHeaders
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
      headers: defaultHeaders
    });
  };

  const getTestimonials = async (): Promise<{ success: boolean; data: TestimonialItem[]; message?: string }> => {
    return await $fetch(`${baseUrl}/testimonials`, {
      headers: defaultHeaders
    });
  };

  const getSettings = async (): Promise<{ success: boolean; data: SiteSettings; message?: string }> => {
    try {
      const res = await $fetch<{ success: boolean; data: any; message?: string }>(`${baseUrl}/settings`, {
        headers: defaultHeaders
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
      headers: defaultHeaders
    });
  };

  const getAttendances = async (params?: Record<string, any>): Promise<{ success: boolean; data: AttendanceRecord[]; meta?: any; message?: string }> => {
    return await $fetch(`${baseUrl}/attendances`, {
      headers: defaultHeaders,
      params
    });
  };

  const getUsers = async (params?: Record<string, any>): Promise<{ success: boolean; data: any[]; meta?: any; message?: string }> => {
    return await $fetch(`${baseUrl}/users`, {
      headers: defaultHeaders,
      params
    });
  };

  const submitAttendance = async (qrTokenOrNim: string): Promise<{ success: boolean; message: string; data?: AttendanceRecord }> => {
    try {
      const res = await $fetch<{ success: boolean; message: string; data?: any }>(`${baseUrl}/attendances`, {
        method: 'POST',
        headers: { ...defaultHeaders, 'Content-Type': 'application/json' },
        body: { qr_token: qrTokenOrNim }
      });
      return {
        success: res?.success ?? false,
        message: res?.message || 'Presensi kedatangan berhasil dicatat.',
        data: res?.data
      };
    } catch (e: any) {
      const errorMsg = e?.data?.message || e?.message || 'Gagal mencatat presensi. QR Token/NIM tidak ditemukan.';
      return {
        success: false,
        message: errorMsg
      };
    }
  };

  return {
    baseUrl,
    apiKey,
    getBooks,
    getBookById,
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

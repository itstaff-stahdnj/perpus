import type { Book } from './usePustakaApi';

export const useBookCover = () => {
  const fallbackCover = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400" fill="none"><rect width="300" height="400" fill="#0f172a"/><rect x="15" y="15" width="270" height="370" rx="12" fill="#1e293b" stroke="#334155" stroke-width="2"/><path d="M150 140 C130 130 90 130 70 140 V240 C90 230 130 230 150 240 C170 230 210 230 230 240 V140 C210 130 170 130 150 140 Z" fill="#475569"/><path d="M150 140 V240" stroke="#1e293b" stroke-width="3"/><text x="150" y="285" font-family="sans-serif" font-size="16" font-weight="bold" fill="#94a3b8" text-anchor="middle">E-Book Digital</text></svg>')}`;

  const extractPdfUrl = (b: Book | any): string => {
    if (!b) return '';
    const rawPdf = b.pdf_file_url || b.pdf_file || b.file_pdf || b.pdf_url || b.ebook_url || b.link_baca || b.file || b.pdf || b.filepath || b.file_path || b.digital_file || b.url_pdf;
    
    if (rawPdf && typeof rawPdf === 'string' && rawPdf.includes('/api/pdf-stream')) {
      return rawPdf;
    }

    if (b.id && (!rawPdf || typeof rawPdf !== 'string' || rawPdf.trim() === '')) {
      return `/api/pdf-stream?id=${b.id}&quality=low`;
    }

    if (!rawPdf || typeof rawPdf !== 'string' || rawPdf.trim() === '') return '';

    return `/api/pdf-stream?url=${encodeURIComponent(rawPdf)}&quality=low`;
  };

  const isEbookBook = (b: Book | any): boolean => {
    if (!b) return false;
    if (b.is_ebook || b.is_digital || b.kavita_book_id || b.kavita_series_id || b.kavita_custom_url || b.tipe_koleksi === 'digital' || extractPdfUrl(b)) return true;

    const catObj = b.category || b.kategori;
    let catName = '';
    if (catObj && typeof catObj === 'object') {
      catName = catObj.nama_kategori || catObj.name || catObj.title || '';
    } else if (typeof catObj === 'string') {
      catName = catObj;
    }
    if (/e-?book|digital|elektronik|pdf|jurnal/i.test(catName)) return true;
    const klas = (b.no_panggil || b.klasifikasi || '') + '';
    return /e-?book|digital|elektronik/i.test(klas);
  };

  const getBookCoverUrl = (b: Book | any): string => {
    if (!b) return fallbackCover;

    const cover = b.cover_image || b.cover_image_url || b.cover;
    if (cover && typeof cover === 'string' && cover.trim() !== '') {
      if (cover.startsWith('http://') || cover.startsWith('https://') || cover.startsWith('data:')) {
        return cover;
      }
      const cleanPath = cover.startsWith('/') ? cover : `/${cover}`;
      return cleanPath;
    }

    return fallbackCover;
  };

  const handleImageError = (event: Event, book?: Book | any) => {
    const img = event.target as HTMLImageElement;
    if (!img) return;

    img.src = fallbackCover;
  };

  return {
    fallbackCover,
    extractPdfUrl,
    isEbookBook,
    getBookCoverUrl,
    handleImageError
  };
};

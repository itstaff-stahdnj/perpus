import { defineEventHandler, readMultipartFormData } from 'h3';
import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    if (!formData || formData.length === 0) {
      return {
        success: false,
        message: 'Tidak ada berkas PDF yang diunggah.'
      };
    }

    const pdfFile = formData.find(item => item.name === 'file' || item.name === 'pdf' || item.type === 'application/pdf');
    if (!pdfFile || !pdfFile.data) {
      return {
        success: false,
        message: 'Berkas yang diunggah tidak valid atau bukan berkas PDF.'
      };
    }

    // Ensure uploads directory exists
    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads', 'pdf');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Create unique filename
    const originalName = pdfFile.filename || 'buku_digital.pdf';
    const sanitizeName = originalName.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const fileName = `${Date.now()}_${sanitizeName}`;
    const filePath = path.join(uploadsDir, fileName);

    // Save file locally
    fs.writeFileSync(filePath, pdfFile.data);

    // Public URL link to serve in D1
    const fileUrl = `/uploads/pdf/${fileName}`;

    return {
      success: true,
      message: 'Berkas PDF digital berhasil diunggah!',
      url: fileUrl,
      fileName,
      sizeBytes: pdfFile.data.length
    };
  } catch (err: any) {
    console.error('PDF Upload Error:', err);
    return {
      success: false,
      message: err?.message || 'Gagal mengunggah berkas PDF digital.'
    };
  }
});

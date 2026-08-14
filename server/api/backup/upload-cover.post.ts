import { defineEventHandler, readBody, readMultipartFormData } from 'h3';
import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  try {
    const contentType = event.node.req.headers['content-type'] || '';
    
    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads', 'covers');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    let fileName = `cover_${Date.now()}.jpg`;
    let filePath = path.join(uploadsDir, fileName);

    if (contentType.includes('application/json')) {
      const body = await readBody(event);
      if (!body || !body.image) {
        return { success: false, message: 'Tidak ada data gambar cover.' };
      }

      const base64Data = body.image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(filePath, buffer);
    } else {
      const formData = await readMultipartFormData(event);
      if (!formData || formData.length === 0) {
        return { success: false, message: 'Tidak ada gambar yang diunggah.' };
      }

      const imageFile = formData.find(item => item.name === 'file' || item.name === 'cover' || item.type?.startsWith('image/'));
      if (!imageFile || !imageFile.data) {
        return { success: false, message: 'Berkas gambar tidak valid.' };
      }

      fs.writeFileSync(filePath, imageFile.data);
    }

    const coverUrl = `/uploads/covers/${fileName}`;

    return {
      success: true,
      message: 'Gambar sampul (cover) berhasil disimpan!',
      url: coverUrl,
      fileName
    };
  } catch (err: any) {
    console.error('Cover Upload Error:', err);
    return {
      success: false,
      message: err?.message || 'Gagal menyimpan gambar sampul.'
    };
  }
});

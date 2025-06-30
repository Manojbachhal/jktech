import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

export function CustomFileInterceptor(fieldName: string) {
  return FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const title = req.body.title || 'file';
        const cleanTitle = title.replace(/\s+/g, '');
        const ext = file.originalname.split('.').pop();
        const finalName = `${cleanTitle}-${uuidv4()}.${ext}`;
        cb(null, finalName);
      },
    }),
  });
}

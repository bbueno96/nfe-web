import multer from 'multer'

import { ApiError } from '../utils/ApiError'

export const multerOptions: multer.Options = {
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/x-pkcs12', 'text/xml']
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new ApiError('Arquivo inválido para envio.', 422))
    }
  },
}

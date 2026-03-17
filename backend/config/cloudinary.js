require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'studyhub/others';
    let resource_type = 'auto';

    if (file.mimetype === 'application/pdf') {
      folder = 'studyhub/notes';
    } else if (file.mimetype.startsWith('image/')) {
      folder = 'studyhub/previews';
    } else if (file.mimetype.startsWith('video/')) {
      folder = 'studyhub/videos';
      resource_type = 'video';
    } else if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
      folder = 'studyhub/assignments';
    }

    const sanitizedName = file.originalname.split('.')[0].replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    
    return {
      folder: folder,
      resource_type: resource_type,
      public_id: `${Date.now()}-${sanitizedName}`,
    };
  },
});

module.exports = storage;

import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { cloudinaryService } from '../utils/CloudinaryServiceImpl';

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const validateAndCompressImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const isValid = await cloudinaryService.validateImage(req.file.buffer);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid image file' });
    }

    const imageInfo = await cloudinaryService.getImageInfo(req.file.buffer);

    if (imageInfo.width < 100 || imageInfo.height < 100) {
      return res.status(400).json({ 
        error: 'Image too small. Minimum size: 100x100 pixels' 
      });
    }

    (req as any).imageInfo = imageInfo;

    next();
  } catch (error) {
    console.error('Error validating image:', error);
    res.status(400).json({ error: 'Failed to validate image' });
  }
};

export const uploadToCloudinary = (folder: string = 'images') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return next();
      }

      const result = await cloudinaryService.uploadImage(
        req.file.buffer,
        folder,
        {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 85,
          format: 'auto',
        }
      );

      (req as any).imagePublicId = result.publicId;
      (req as any).imageUrl = result.url;

      next();
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  };
};
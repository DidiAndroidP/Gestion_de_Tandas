import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { s3ImageService } from '../utils/S3ImageService';

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

    const isValid = await s3ImageService.validateImage(req.file.buffer);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid image file' });
    }

    const imageInfo = await s3ImageService.getImageInfo(req.file.buffer);

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

export const uploadToS3 = (folder: string = 'images') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return next();
      }

      const imageUrl = await s3ImageService.uploadImage(
        req.file.buffer,
        folder,
        {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 85,
          format: 'webp',
        }
      );

      (req as any).imageUrl = imageUrl;

      next();
    } catch (error) {
      console.error('Error uploading to S3:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  };
};
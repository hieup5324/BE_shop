import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import { Express } from 'express';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name
      api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API key
      api_secret: process.env.CLOUDINARY_API_SECRET, // Cloudinary API secret
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          { resource_type: 'auto' }, // Automatically detect image type (jpg, png, etc.)
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error); // Log the error
              reject(error);
            } else {
              resolve(result.secure_url); // Return the URL of the uploaded image
            }
          },
        )
        .end(file.buffer); // Upload the image from memory buffer
    });
  }
}

import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface UploadResult {
  filePath: string;
  filename: string;
  size: number;
  mimetype: string;
}

export interface MulterFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

@Injectable()
export class UploadsService {
  private readonly uploadDir = path.join(process.cwd(), 'public', 'uploads', 'smk3');
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  constructor() {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(
    file: MulterFile,
    subElementId: string,
  ): Promise<UploadResult> {
    // Validate file type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: jpg, jpeg, png`,
      );
    }

    // Validate file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds 5MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      );
    }

    // Create subdirectory for this element if it doesn't exist
    const elementDir = path.join(this.uploadDir, subElementId);
    if (!fs.existsSync(elementDir)) {
      fs.mkdirSync(elementDir, { recursive: true });
    }

    // Generate sanitized filename with timestamp and random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const originalName = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    const sanitizedFilename = `${timestamp}-${randomString}${ext}`;

    const filePath = path.join(elementDir, sanitizedFilename);

    try {
      // Write file to disk
      fs.writeFileSync(filePath, file.buffer);

      // Return relative path for frontend
      const relativePath = `/uploads/smk3/${subElementId}/${sanitizedFilename}`;

      return {
        filePath: relativePath,
        filename: sanitizedFilename,
        size: file.size,
        mimetype: file.mimetype,
      };
    } catch (error: any) {
      // Handle specific disk errors
      if (error.code === 'ENOSPC') {
        throw new BadRequestException('Disk space error. Storage is full.');
      }
      if (error.code === 'EACCES') {
        throw new BadRequestException('Permission denied. Cannot write to upload directory.');
      }
      throw new BadRequestException(`File upload failed: ${error.message}`);
    }
  }
}

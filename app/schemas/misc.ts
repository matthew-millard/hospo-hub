import { z } from 'zod';

export const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/doc',
  'application/docx',
  'text/plain',
  'application/vnd.oasis.opendocument.text',
];

export const ACCEPTED_IMAGE_TYPES = ['image/gif', 'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

export const UploadDocumentSchema = z
  .instanceof(File, { message: 'File is required' }) // Check if a file is present
  .refine(file => file && ACCEPTED_DOCUMENT_TYPES.includes(file.type), {
    message: 'Unsupported file type',
  })
  .refine(file => file.size <= MAX_FILE_SIZE, {
    message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
  });

export const publicEndorsementSchema = z.object({
  publicEndorsement: z
    .string()
    .min(1, 'Please provide a public endorsement.')
    .max(500, 'Public endorsement must be less than 500 characters.'),
});

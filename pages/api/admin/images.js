/**
 * Admin Image Management API
 * Upload, list, and delete images
 */

import { verifyAdminToken } from "./auth";
import fs from "fs";
import path from "path";
import formidable from "formidable";

// Disable body parsing, we'll handle it manually
export const config = {
  api: {
    bodyParser: false,
  },
};

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export default async function handler(req, res) {
  // Verify admin authentication
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // List images
  if (req.method === "GET") {
    try {
      const files = fs
        .readdirSync(UPLOAD_DIR)
        .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .map((file) => {
          const filePath = path.join(UPLOAD_DIR, file);
          const stats = fs.statSync(filePath);
          return {
            filename: file,
            url: `/uploads/${file}`,
            size: stats.size,
            uploadedAt: stats.birthtime.toISOString(),
          };
        })
        .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

      return res.status(200).json({ images: files });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error listing images:", error);
      }
      return res.status(500).json({ error: "Failed to list images" });
    }
  }

  // Upload image
  if (req.method === "POST") {
    try {
      const form = formidable({
        uploadDir: UPLOAD_DIR,
        keepExtensions: true,
        maxFileSize: MAX_FILE_SIZE,
      });

      form.parse(req, (err, fields, files) => {
        // Handle parse errors
        if (err) {
          if (process.env.NODE_ENV === "development") {
            console.error("Form parse error:", err);
          }
          return res
            .status(400)
            .json({ error: "Upload failed: " + err.message });
        }

        try {
          const file = files.file || files.image;
          if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
          }

          const uploadedFile = Array.isArray(file) ? file[0] : file;

          // Check if temp file exists
          if (!uploadedFile.filepath || !fs.existsSync(uploadedFile.filepath)) {
            return res.status(400).json({ error: "Uploaded file not found" });
          }

          const originalName =
            uploadedFile.originalFilename || uploadedFile.name || "image";
          const ext = path.extname(originalName);
          const baseName = path
            .basename(originalName, ext)
            .replace(/[^a-z0-9]/gi, "_");
          const timestamp = Date.now();
          const newFilename = `${baseName}_${timestamp}${ext}`;
          const newPath = path.join(UPLOAD_DIR, newFilename);

          // Move file to final location with error handling
          try {
            fs.renameSync(uploadedFile.filepath, newPath);
          } catch (renameError) {
            // Clean up temp file if rename fails
            try {
              if (fs.existsSync(uploadedFile.filepath)) {
                fs.unlinkSync(uploadedFile.filepath);
              }
            } catch (cleanupError) {
              // Ignore cleanup errors
            }
            if (process.env.NODE_ENV === "development") {
              console.error("File rename error:", renameError);
            }
            return res
              .status(500)
              .json({ error: "Failed to save uploaded file" });
          }

          // Get file size with error handling
          let fileSize = 0;
          try {
            const stats = fs.statSync(newPath);
            fileSize = stats.size;
          } catch (statError) {
            if (process.env.NODE_ENV === "development") {
              console.error("File stat error:", statError);
            }
            // Continue anyway, size is not critical
          }

          return res.status(200).json({
            success: true,
            image: {
              filename: newFilename,
              url: `/uploads/${newFilename}`,
              size: fileSize,
            },
          });
        } catch (error) {
          // Catch any errors in the callback
          if (process.env.NODE_ENV === "development") {
            console.error("Error processing upload:", error);
          }
          // Try to clean up temp file
          try {
            const file = files.file || files.image;
            if (file) {
              const uploadedFile = Array.isArray(file) ? file[0] : file;
              if (
                uploadedFile.filepath &&
                fs.existsSync(uploadedFile.filepath)
              ) {
                fs.unlinkSync(uploadedFile.filepath);
              }
            }
          } catch (cleanupError) {
            // Ignore cleanup errors
          }
          return res
            .status(500)
            .json({ error: "Failed to process uploaded file" });
        }
      });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error setting up upload:", error);
      }
      return res.status(500).json({ error: "Failed to upload image" });
    }
  }

  // Delete image
  if (req.method === "DELETE") {
    try {
      const { filename } = req.query;
      if (!filename) {
        return res.status(400).json({ error: "Filename required" });
      }

      // Security: prevent directory traversal
      const safeFilename = path.basename(filename);
      const filePath = path.join(UPLOAD_DIR, safeFilename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Image not found" });
      }

      fs.unlinkSync(filePath);
      return res.status(200).json({ success: true });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error deleting image:", error);
      }
      return res.status(500).json({ error: "Failed to delete image" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

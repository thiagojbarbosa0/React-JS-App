const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const multer = require('multer');

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const IMG_DIR = path.join(__dirname, 'img');
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB

// Make sure the images folder exists before the server starts serving/writing to it.
if (!fs.existsSync(IMG_DIR)) {
  fs.mkdirSync(IMG_DIR, { recursive: true });
}

const app = express();

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded images as static files (used by the client to render <img src=...>).
app.use('/img', express.static(IMG_DIR, { maxAge: '1h' }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, IMG_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return cb(new Error('UNSUPPORTED_FILE_TYPE'));
    }
    cb(null, true);
  },
});

function toImagePayload(filename) {
  const stats = fs.statSync(path.join(IMG_DIR, filename));
  return {
    name: filename,
    url: `/img/${filename}`,
    size: stats.size,
    uploadedAt: stats.mtime,
  };
}

// --- Routes ---------------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/images', (req, res) => {
  fs.readdir(IMG_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read the images folder.' });
    }
    const images = files
      .filter((file) => /\.(jpe?g|png|gif|webp)$/i.test(file))
      .map(toImagePayload)
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    res.json({ images });
  });
});

app.post('/api/images', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: `File too large. Max size is ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.` });
      }
      return res.status(400).json({ error: err.message });
    }
    if (err) {
      return res.status(400).json({ error: 'Unsupported file type. Use JPG, PNG, GIF or WEBP.' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No image file was sent (expected field name "image").' });
    }
    res.status(201).json({ image: toImagePayload(req.file.filename) });
  });
});

app.delete('/api/images/:filename', (req, res) => {
  const { filename } = req.params;
  // Prevent path traversal outside of the img directory.
  const safeName = path.basename(filename);
  const target = path.join(IMG_DIR, safeName);

  if (!target.startsWith(IMG_DIR)) {
    return res.status(400).json({ error: 'Invalid filename.' });
  }
  if (!fs.existsSync(target)) {
    return res.status(404).json({ error: 'Image not found.' });
  }
  fs.unlink(target, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete the image.' });
    }
    res.json({ success: true });
  });
});

// 404 fallback for unknown API routes.
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// Centralized error handler (catches anything thrown synchronously in routes).
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
  console.log(`Accepting requests from origin: ${CLIENT_ORIGIN}`);
});

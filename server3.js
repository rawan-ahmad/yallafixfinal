const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

const PORT = 5501;

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('profilePic'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ message: 'Upload successful', filename: req.file.filename });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// routes/upload.js
const express = require('express');
const { uploadBookImage } = require('../services/uploadService');
// const router = express.Router();
const multer = require('multer');
const upload = multer(); // Use multer to handle multipart/form-data
const router = express.Router();
router.post('/book', upload.single('image'), uploadBookImage, (req, res) => {
  res.status(200).json({ message: 'success', data: req.file.path });
});

module.exports = router;

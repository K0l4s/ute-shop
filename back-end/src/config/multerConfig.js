const multer = require('multer');

const limitFileSize = 10000000; // 10MB

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: limitFileSize },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// Kiểm tra loại file
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(file.originalname.toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only!'));
  }
}

module.exports = upload;

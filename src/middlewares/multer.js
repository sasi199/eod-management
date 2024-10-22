const multer = require('multer');

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// Define file filter to allow only specific file types
const fileFilter = function (req, file, cb) {
  const allowedMimes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

// Define upload middleware with optional limits
const uploads = multer({
  storage: storage,
  fileFilter: fileFilter,
  // limits: {
  //   fileSize: 5 * 1024 * 1024, // 5 MB limit
  // }
});

module.exports = uploads;

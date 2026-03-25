import multer from "multer";

// ==========================
// Storage Configuration
// ==========================
const imageconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./upload"); // folder where images will be stored
  },

  filename: (req, file, callback) => {
    const uniqueName = `image-${Date.now()}-${file.originalname}`;
    callback(null, uniqueName);
  }
});


// ==========================
// File Filter (Only Images)
// ==========================
const checkimage = (req, file, callback) => {

  if (file.mimetype.startsWith("image/")) {
    callback(null, true);
  } else {
    callback(new Error("Only image files are allowed"), false);
  }

};


// ==========================
// Multer Upload Config
// ==========================
export const upload = multer({
  storage: imageconfig,
  fileFilter: checkimage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per image
  }
});
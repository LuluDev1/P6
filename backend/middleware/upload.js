const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("jpeg") ||
    file.mimetype.includes("png") ||
    file.mimetype.includes("jpg")
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload.single("image"); // Make sure t

// const multer = require("multer");

// const MIME_TYPES = Object.freeze({
//   "image/jpg": "jpg",
//   "image/jpeg": "jpg",
//   "image/png": "png",
// });

// const uploadFolder = "uploads";

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, uploadFolder);
//   },
//   filename: (req, file, callback) => {
//     const name = file.originalname.split(" ").join("-").split(".").slice(0, -1);
//     const extension = MIME_TYPES[file.mimetype];

//     callback(null, `${name}-${Date.now()}.${extension}`);
//   },
// });

// module.exports = multer({ storage }).single("image");

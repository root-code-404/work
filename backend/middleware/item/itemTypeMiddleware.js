const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');


// Ensure 'uploads' folder exists
const ensureUploadsFolderExists = () => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        ensureUploadsFolderExists(); // Check if folder exists at runtime
        cb(null, 'uploads/');  // Ensure 'uploads' folder exists
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Middleware to validate ObjectId
function validateObjectId(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid item ID' });
    }
    next();
}

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('File type not supported'), false);
    }
};

module.exports = { upload, validateObjectId, fileFilter };

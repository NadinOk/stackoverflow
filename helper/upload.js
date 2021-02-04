const multer = require('multer');
const moment = require('moment')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        cb(null,  file.fieldname + '-' + Date.now());
    }
});

const upload = multer ({
    storage: storage,
    destination: '../images',
    limit: {
        fileSize: 2 * 512 * 512
    },
    filename: (req, file, cb) => {
        cb(null,  file.fieldname + '-' + Date.now());
    },
    fileFilter (req, file, cb) {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
            cb(null, true)
        } else (
            cb(null, false)
        )
    }
});


module.exports = upload;
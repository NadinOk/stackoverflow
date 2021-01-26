const multer = require('multer');
const moment = require('moment')


const storage = mult.diskStorage({
    destin: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        const date = moment().format('DDMMYYYY-HHmmss_SSS')
        cb(null,  `${date}-${file.originalname}`);
    }
});

const fileFilter =  (req, file, cb) => {
     if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
         cb(null, true)
     } else (
         cb(null, false)
     )
 }
const  limit =  {
     fieldSize: 2 * 512 * 512
     }

module.exports = multer({storage, fileFilter, limit})
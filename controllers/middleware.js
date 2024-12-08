const multer = require('multer');
const uploadDirectory = 'public/images/'
const path = require('path');
const { nextTick } = require('process');

const storage = multer.diskStorage(
    {
        // destination: (req, file, cb) => {
        //     cb(null, uploadDirectory); // Diretório onde os arquivos serão salvos
        // },
        destination: uploadDirectory,
        filename: (req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
            cb(null, `${uniqueSuffix}-${req.user.username + req.user.id}${path.extname(file.originalname)}`);
        },
    }
)
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 * 2 }, // Limite de 10MB por imagem
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            // cb(new Error('Somente imagens em formato JPEG, JPG, PNG ou GIF são permitidas.'));
            return cb(null, false);
        }
    },
}).single('image'); // O campo de envio de imagem no formulário será 'image'

module.exports = { upload }
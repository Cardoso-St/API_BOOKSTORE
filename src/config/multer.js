import multer from "multer";
import path from "node:path";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Essa função é onde eu vou armazenar a imagem e o nome
export const imageStorage = multer.diskStorage({
    destination: (request, file, cb) => {
        let folder = ''

        if (request.baseUrl.includes("livros")) {
            folder = "livros";

        }

        cb(null, path.join(__dirname, `../../public/${folder}`))

    },
    filename: (request, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);

        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    },
})
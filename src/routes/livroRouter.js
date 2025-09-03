import { Router } from "express";
import { cadastrarLivro, cadastrarCapaLivro, listarLivro, listarTodosLivros, deletarLivro, atualizarLivro} from "../controllers/livroControllers.js";
import { imagemUpload } from "../middleware/imageUpload.js";

const router = Router()

router.post("/", cadastrarLivro)
router.get("/", listarTodosLivros)
router.get("/", listarLivro)


//ImgRotas
router.post("/:id/imagem", imagemUpload.single('imagem'), cadastrarCapaLivro)
export default router
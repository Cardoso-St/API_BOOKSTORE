import { Router } from "express";
import { atualizarAutor, cadastrarAutor, listarAutor, listarTodosAutores } from "../controllers/autorControllers.js";

const router = Router()

router.post("/", cadastrarAutor)
router.get("/", listarTodosAutores)
router.get("/:id", listarAutor)
router.put("/:id", atualizarAutor)




export default router;


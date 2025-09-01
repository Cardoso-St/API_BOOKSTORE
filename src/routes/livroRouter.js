import { Router } from "express";
import { cadastrarLivro, listarLivro, listarTodosLivros } from "../controllers/livroControllers.js";

const router = Router()

router.post("/", cadastrarLivro)
router.get("/", listarTodosLivros)
router.get("/:id", listarLivro)

export default router
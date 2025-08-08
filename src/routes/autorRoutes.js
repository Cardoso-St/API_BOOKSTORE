import { Router } from "express";
import { cadastrarAutor, listarTodosAutores } from "../controllers/autorControllers.js";

const router = Router()

router.post("/", cadastrarAutor)
router.get("/", listarTodosAutores)

export default router;


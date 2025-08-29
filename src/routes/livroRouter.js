import { Router } from "express";
import { cadastrarLivro } from "../controllers/livroControllers.js";

const router = Router()

router.post("/", cadastrarLivro)

export default router
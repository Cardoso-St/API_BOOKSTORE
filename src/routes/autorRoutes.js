import { Router } from "express";
import { cadastrarAutor } from "../controllers/autorControllers.js";

const router = Router()

router.post("/", cadastrarAutor)

export default router;


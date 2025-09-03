import express from "express";
import cors from "cors";
import { conn } from "./config/sequelize.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

//tabelas
import "./models/association.js";

//ROTAS
import autorRoutes from "./routes/autorRoutes.js";
import livroRouter from "./routes/livroRouter.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "../public")));

conn
  .sync({alter: true})
  .then(() => {
    console.log("Banco de dados conectado🍆");
  })
  .catch((error) => console.log(error));

app.use("/api/autores", autorRoutes);
app.use("/api/livros", livroRouter);

export default app;

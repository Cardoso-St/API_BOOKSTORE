import express, { response } from "express";
import cors from "cors";
import { conn } from "./config/sequelize.js";

//tabelas
import autorModel from "./models/autorModel.js";
import { error } from "console";

//ROTAS
import autorRoutes from "./routes/autorRoutes.js"

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json())

conn.sync()
.then(() => {
    console.log("Banco de dados conectado🍆")
})
.catch((error) => console.log(error))

app.use("/api/autores", autorRoutes)

app.get("/", (resquest, response) => {
        response.status(200).json({ mensagem: "olá mundo" })
    })

export default app;
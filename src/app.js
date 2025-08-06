import express, { response } from "express";
import cors from "cors";
import { conn } from "./config/sequelize.js";

const app = express();

app.use(
    cors({
        origin:"*",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json())
conn.sync();

app.get("/", (resquest, response) => {
   response.status(200).json({mensagem: "olá mundo"})
})

export default app;
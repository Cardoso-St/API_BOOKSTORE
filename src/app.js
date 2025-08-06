import express, { response } from "express";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin:"*",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json())

app.get("/", (resquest, response) => {
   response.status(200).json({mensagem: "olá mundo"})
})

export default app;
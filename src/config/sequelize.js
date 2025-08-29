import { Sequelize } from "sequelize";

export const conn = new Sequelize("bookstore3G","root", "Sen@iDev77!.", {
    host: "localhost",
    dialect: "mysql",
    port: 3306
})
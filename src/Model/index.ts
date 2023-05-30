import { Sequelize } from "sequelize-typescript";

require("dotenv").config();

const connection = new Sequelize({
    repositoryMode: true,
    dialect: "mysql",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
    models: [],
});

export default connection;

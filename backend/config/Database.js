import { Sequelize } from "sequelize";

const db = new Sequelize('pkl_db', 'root', '', {
    host: "localhost",
    dialect: "mysql"
})

export default db;
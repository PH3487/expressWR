const mysql = require('mysql2');
async function webDB(){
    const db = (mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_WEB,
        connectionLimit: 100,
    })).promise();;

    return db;
}
async function gameDB(){
    const db = (mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_GAME,
        connectionLimit: 100,
    })).promise();;

    return db;
}
module.exports = {
    webDB,
    gameDB
}
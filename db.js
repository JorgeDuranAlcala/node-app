const { createPool } = require('mysql2/promise')

const pool = new createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'proyecto_implantacion'
})

module.exports = { pool }
const mysql = require("mysql2");

// Create the connection to database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Scoutygirl25!",
    database: "company_db"
});

module.exports = connection;
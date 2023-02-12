//import the neccessity
const mysql = require("mysql2");
const dbConfig = require("./db.config");

// Create a connection to the database
const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    multipleStatements: true
});

// open the MySQL connection
connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

//export the connection
module.exports = connection;


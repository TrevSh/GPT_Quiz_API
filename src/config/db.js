const dotenv = require('dotenv');
const mysql = require('mysql2');

dotenv.config();

const db = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10, // Increase if needed
	queueLimit: 0
});

module.exports = db.promise();


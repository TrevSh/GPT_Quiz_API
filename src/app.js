const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

app.post('/api/register', (req, res) => {
	const { name, email, password } = req.body;

	bcrypt.hash(password, 10, (err, hash) => {
		if (err) return res.status(500).json({ message: 'Error hashing password!' });

		const sql = 'INSERT INTO users (name, email, password) VALUES (?,?,?)';
		db.query(sql, [name, email, hash], (err, result) => {
			if (err) return res.status(500).json({ message: 'Error registering user' });
			res.status(201).json({ message: 'User registered successfully' });
		});
	});
});

//app.post Login logic

app.listen(process.env.PORT || 5000, () => {
	console.log(`Server is running on ${process.env.PORT | 5000}`);
});

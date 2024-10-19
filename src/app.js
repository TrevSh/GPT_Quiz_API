const authenticateToken = require('./middleware/auth');

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
		db.query(sql, [name, email, hash], (err, res) => {
			if (err) return res.status(500).json({ message: 'Error registering user' });
			res.status(201).json({ message: 'User registered successfully' });
		});
	});
});

app.post('api/login', (req, res) => {
	const { email, password } = req.body;

	const sql = 'SELECT * FROM users WHERE email = ?'
	db.query(sql, [email], (err, res) => {
		if (err) return res.status(500).json({ message: 'Database Error. Email not found.' });
		if (res.length === 0) res.status(400).json({ message: 'User not found' });

		const user = res[0];

		bcrypt.compare(password, user.password, (err, isMatch) => {
			if (err) return res.status(500).json({ message: 'Error comparing passwords' });
			if (!isMatch) return res.status(400).json({ message: 'Incorrect Password' });

			//Generate JWT token
			const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
				expiresIn: '1hr'
			});

			res.status(200).json({ message: 'Login Successful', token });
		});
	});
});

app.get('/api/protect-route', authenticateToken, (req, res) => {
	res.json({ message: 'This route is protected', user: req.user });
});

app.listen(process.env.PORT || 5000, () => {
	console.log(`Server is running on ${process.env.PORT | 5000}`);
});

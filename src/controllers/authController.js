const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



exports.registerUser = (req, res) => {
	const { name, email, password } = req.body;

	bcrypt.hash(password, 10, (err, hash) => {
		if (err) return res.status(500).json({ message: 'Error hashing password!' });

		const sql = 'INSERT INTO users (name, email, password) VALUES (?,?,?)';
		db.query(sql, [name, email, hash], (err, res) => {
			if (err) return res.status(500).json({ message: 'Error registering user' });
			res.status(201).json({ message: 'User registered successfully' });
		});
	});
};

exports.loginUser = (req, res) => {
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
};


const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



exports.registerUser = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		const hash = await bcrypt.hash(password, 10);

		const sql = 'INSERT INTO users (name, email, password) VALUES (?,?,?)';

		const [users] = await db.query(sqlAllUsers, [email]);

		const userExists = users.some(user => user.name === name)
		if (userExists) {
			return res.status(501).json({ message: 'User already in database!' })
		}

		const [result] = await db.query(sql, [name, email, hash]);

		res.status(201).json({ message: 'User registered successfully', result: result });
	} catch (err) {
		console.error(`${password} encountered a hashing error:`, err);
		res.status(500).json({ message: 'Error registering user' });
	};
};

exports.loginUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		const sql = 'SELECT * FROM users WHERE email = ?'

		const [users] = await db.query(sql, [email]);


		if (users.length === 0) res.status(400).json({ message: 'User not found' });

		const user = users[0];

		const isMatch = bcrypt.compare(password, user.password)
		if (!isMatch) {
			return res.status(400).json({ message: 'Incorrect Password' });
		}

		const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
			expiresIn: '1hr'
		});

		res.status(200).json({ message: 'Login Successful', token });
	} catch (err) {
		res.status(500).json({ message: 'Error Logging In.', error: err });
	}
};

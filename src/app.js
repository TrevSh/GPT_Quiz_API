const authenticateToken = require('./middleware/auth');
const authRoutes = require('./routes/authRoutes');

const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', authRoutes);

app.get('/api/protect-route', authenticateToken, (req, res) => {
	res.json({ message: 'This route is protected', user: req.user });
});

app.listen(process.env.PORT || 5000, () => {
	console.log(`Server is running on ${process.env.PORT | 5000}`);
})
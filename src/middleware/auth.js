const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) return res.status(401).json({ message: 'Access Denied' });

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) { return res.status(403).json({ message: 'Invalid token' }) };

		req.user = user;	//Attach user data to req object
		next();
	});
};

exports.skipAuthInDev = (req, res, next) => {
	if (process.env.NODE_ENV === 'development') {
		return next(); // Bypass auth in development
	}
	return authenticateToken(req, res, next);
};

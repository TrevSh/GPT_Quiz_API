
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../app');  // Assuming this is your Express app

describe('Protected Routes', () => {

	// Generate a fake JWT for testing
	const token = jwt.sign({ id: 1, email: 'test@example.com' }, process.env.JWT_SECRET, {
		expiresIn: '1h',
	});

	it('should allow access to a protected route with a valid token', async () => {
		const response = await request(app)
			.get('/api/protect-route')  // Protected route
			.set('Authorization', `Bearer ${token}`);  // Set the token in the header

		expect(response.statusCode).toBe(200);  // Ensure success
		expect(response.body.message).toBe('This route is protected');  // Check for correct response
	});

	it('should deny access to a protected route without a token', async () => {
		const response = await request(app)
			.get('/api/protect-route');

		expect(response.statusCode).toBe(401);  // 401 Unauthorized
	});
});

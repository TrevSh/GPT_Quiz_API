const request = require('supertest');
const app = require('../app')

describe('Quiz API Endpoints', () => {
	it('should generate a quiz based on interests', async () => {
		const response = await request(app)
			.post('/api/generate-quiz')
			.send({ interests: 'science, math' });

		expect(response.statusCode).toBe(200);

		expect(response.body.quiz).toBeDefined();
	});

	it('should return 500 if quiz generation fails', async () => {
		const response = await request(app)
			.post('/api/generate-quiz')
			.send({ interests: '' });

		expect(response.statusCode).toBe(500);
		expect(response.body.message).toBe('error generating quiz');
	});
});

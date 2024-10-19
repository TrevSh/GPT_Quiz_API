const express = require('express');
const router = express.Router();

const { generateQuiz } = require('../controllers/quizController_OpenAI');
const authenticateToken = require('../middleware/auth');

router.post('/generate-quiz', authenticateToken, generateQuiz)

module.exports = router;

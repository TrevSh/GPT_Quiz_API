const express = require('express');
const router = express.Router();

const { generateQuiz } = require('../controllers/quizController_OpenAI');
const { authenticateToken, skipAuthInDev } = require('../middleware/auth');

router.post('/generate-quiz', skipAuthInDev, generateQuiz)

module.exports = router;

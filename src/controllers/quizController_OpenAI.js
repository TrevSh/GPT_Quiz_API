const dotenv = require('dotenv');
dotenv.config();

const OpenAi = require('openai');
const openai = new OpenAi({ apiKey: process.env.GPT_API_KEY });


exports.generateQuiz = async (req, res) => {
	const { interests, numQuestions = 10 } = req.body;


	try {
		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "user",
					content: `Generate ${numQuestions} unique questions for a quiz on the topic of ${interests}. Provide only the questions.`,
				},
			],
			max_tokens: 500,
			temperature: 0.4,
		});
		const quizData = response.choices[0].message.content;
		res.status(200).json({ quiz: quizData });

	} catch (err) {

		console.error(err);
		res.status(500).json({ message: 'Error generating quiz' })
	}
};

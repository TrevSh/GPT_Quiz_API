const dotenv = require('dotenv')
dotenv.config();

const OpenAi = require('openai');
const openai = new OpenAi({ apiKey: process.env.GPT_API_KEY });


exports.createQuiz = async (req, res) => {
	const { interests } = req.body;


	try {
		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "You are the best teacher in the world. You take a students interests and give them quizzes to help them develop and test their knowledge.",
					content: `Generate a 10 question quiz based on these interests: ${interests}`,
				},
			],
			max_tokens: 500,
			temperature: 0.7,
		});
		const quizData = response.choices[0].message.content;
		res.status(200).json({ quiz: quizData });

	} catch (err) {

		console.error(err);
		res.status(500).json({ message: 'Error generating quiz' })
	}
};

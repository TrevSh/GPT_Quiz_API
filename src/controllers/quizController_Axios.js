const axios = require('axios');

exports.generateQuiz = async (req, res) => {
	const { interests } = req.body;

	try {
		const response = await axios.post(
			'https://api.openai.com/v1/completions',
			{
				model: 'gpt-3.5-turbo',
				prompt: `Generate an quiz based on these interests ${interests}`,
				max_tokens: 500,
			},
			{
				headers: {
					Authorization: `Bearer ${process.env.GPT_API_KEY}`,
				}
			}
		);

		//Extract quiz data from GPT response
		const quizData = response.data.choices[0].text;

		//Return quiz as JSON response
		res.status(200).json({ quiz: quizData });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Error generating quiz' });
	}
};

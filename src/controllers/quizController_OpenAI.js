const dotenv = require('dotenv')
dotenv.config();

const OpenAi = require('openai');
const openai = new OpenAi({ apiKey: process.env.GPT_API_KEY });


(async () => {
	const completion = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{ role: "system", content: "You are a helpful assistant." },
			{
				role: "user",
				content: "Tell me the status of my program.",
			},
		],
	});

	console.log(completion.choices[0].message);
})();

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
	if (!configuration.apiKey) {
		res.status(500).json({
			error: {
				message:
					"OpenAI API key not configured, please follow instructions in README.md",
			},
		});
		return;
	}

	const inquiry = req.body.inquiry || "";
	if (inquiry.trim().length === 0) {
		res.status(400).json({
			error: {
				message: "Please type something",
			},
		});
		return;
	}

	try {
		const completion = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: generatePrompt(inquiry),
			temperature: 0.6,
			max_tokens: 2048,
		});
		res.status(200).json({ result: completion.data.choices[0].text, history: completion.data.choices[0].text + inquiry });
	} catch (error) {
		// Consider adjusting the error handling logic for your use case
		if (error.response) {
			console.error(error.response.status, error.response.data);
			res.status(error.response.status).json(error.response.data);
		} else {
			console.error(`Error with OpenAI API request: ${error.message}`);
			res.status(500).json({
				error: {
					message: "An error occurred during your request.",
				},
			});
		}
	}
}

function generatePrompt(complete) {
	const capitalizedComplete =
		complete[0].toUpperCase() + complete.slice(1).toLowerCase();
	return `${capitalizedComplete}`;
}

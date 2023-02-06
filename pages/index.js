import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
	const [inquiryInput, setInquiryInput] = useState("");
	const [result, setResult] = useState();
	const [history, setHistory] = useState("");
	const [question, setQuestion] = useState("");

	async function onSubmit(event) {
		event.preventDefault();
		try {
			if ({ history }.history === "") {
				const response = await fetch("/api/generate", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ inquiry: inquiryInput }),
				});

				const data = await response.json();
				if (response.status !== 200) {
					throw (
						data.error ||
						new Error(`Request failed with status ${response.status}`)
					);
				}

				setResult(data.result);
				setQuestion({ inquiryInput }.inquiryInput);
				setHistory(
					{ history }.history + " - User: " + 
						{ inquiryInput }.inquiryInput + "\n" +
						" - Chat GPT: " +
						data.result
				);
				setInquiryInput("");
				var msg = new SpeechSynthesisUtterance();
				msg.text = data.result;
				window.speechSynthesis.speak(msg);
			} else {
				console.log({ history }.history + " " + inquiryInput);

				const response = await fetch("/api/generate", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						inquiry: { history }.history + " " + inquiryInput,
					}),
				});

				const data = await response.json();
				if (response.status !== 200) {
					throw (
						data.error ||
						new Error(`Request failed with status ${response.status}`)
					);
				}

				setResult(data.result);
				setQuestion({ inquiryInput }.inquiryInput);
				setHistory(
					{ history }.history + " - User: " + 
						{ inquiryInput }.inquiryInput + "\n" + 
						" - Chat GPT: " +
						data.result
				);
				setInquiryInput("");

				var msg = new SpeechSynthesisUtterance();
				msg.text = data.result;
				window.speechSynthesis.speak(msg);
			}
		} catch (error) {
			// Consider implementing your own error handling logic here
			console.error(error);
			alert(error.message);
		}
	}

	return (
		<div>
			<Head>
				<title>OpenAI Quickstart</title>
			</Head>

			<main className={styles.main}>
				<button>Voice</button>
				<form onSubmit={onSubmit}>
					<input
						type="text"
						name="inquiry"
						placeholder="Enter what you want to ask"
						value={inquiryInput}
						onChange={(e) => {
							setInquiryInput(e.target.value);
						}}
					/>
					<input id="submit_button" type="submit" value="Submit" />
				</form>
				
				<div className={styles.result}>{history}</div>
			</main>
		</div>
	);
}
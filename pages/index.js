import { Html } from "next/document";
import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
	const [inquiryInput, setInquiryInput] = useState("");
	const [result, setResult] = useState();
	const [history, setHistory] = useState("");
	const [question, setQuestion] = useState("");

	async function onLoad(event) {
		console.log('test')
		const div = window.document.getElementById('butt')
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		const recognition = new SpeechRecognition();
		recognition.continuous = false;
		recognition.interimResults = false;
		recognition.maxAlternatives = 1;

		div.addEventListener('click',  () => {
			console.log('ok')
			recognition.start();
		})
				
		recognition.onresult = async (event) => {
			console.log(event.results[0][0].transcript);
			setInquiryInput(event.results[0][0].transcript);
		}
	}

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
		<div onLoad={onLoad}>
			<Head>
				<title>OpenAI Quickstart</title>
			</Head>

			<main className={styles.main}>
				<button id="butt" >Voice</button>
				<form onSubmit={onSubmit}>
					<input onFocus={onLoad}
						type="text"
						name="inquiry"
						placeholder="Enter what you want to ask"
						value={inquiryInput}
						onChange={(e) => {
							setInquiryInput(e.target.value);
						}}
					/>
					<input type="submit" value="Submit" />
				</form>
				
				<div className={styles.result}>{history}</div>
			</main>
		</div>
	);
}
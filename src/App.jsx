import React, { useEffect, useState } from 'react';

function App() {
	const [ws, setWs] = useState(null);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");

	useEffect(() => {
		const socket = new WebSocket("ws://localhost:8080/ws");
		setWs(socket);

		socket.onmessage = (event) => {
			setMessages((prev) => [...prev, event.data]);
		};

		return () => socket.close();
	}, []);

	const sendMessage = () => {
		if (ws && input.trim()) {
			ws.send(input);
			setInput("");
		}
	};

	return (
		<div className="p-4">
			<h1 className="text-xl font-bold mb-4">Real-time Chat</h1>
			<div className="border h-64 overflow-y-scroll mb-4 p-2">
				{messages.map((msg, i) => (
					<div key={i} className="mb-1">{msg}</div>
				))}
			</div>
			<input
				type="text"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				className="border p-2 mr-2"
				placeholder="Type a message"
			/>
			<button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded">
				Send
			</button>
		</div>
	);
}

export default App;
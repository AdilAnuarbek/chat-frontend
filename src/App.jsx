import React, { useEffect, useState } from 'react';

function App() {
	const [ws, setWs] = useState(null);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	let nickname = localStorage.getItem("nickname")
	useEffect(() => {
		// const socket = new WebSocket("wss://chat-backend-67nq.onrender.com/ws");
		const socket = new WebSocket("ws://localhost:8080/ws");
		setWs(socket);

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			const senderNickname = data.nickname || "Anonymous";
			
			const message = data.message || "";
			setMessages((prev) => [...prev, { senderNickname, message }]);
		};

		return () => socket.close();
	}, []);

	const sendMessage = () => {
		if (ws && input.trim()) {
			ws.send(JSON.stringify({
				nickname: nickname,
				message: input
			}))
			setInput("");
		}
	};

	// Check nickname before rendering
	if (nickname == null) {
		nickname = prompt("Enter your nickname:");
		localStorage.setItem("nickname", nickname);
	}

	return (
		<div className="p-4">
			<h1 className="text-xl font-bold mb-4">Real-time Chat</h1>
			<div className="border h-64 overflow-y-scroll mb-4 p-2">
				{messages.map((msg, i) => (
					<div key={i} className="mb-1">{msg.senderNickname + ": " + msg.message}</div>
				))}
			</div>
			<input
				type="text"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						sendMessage();
					}
				}}
				className="border p-2 mr-2"
				placeholder="Type a message"
			/>
			<button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded">
				Send
			</button>
			<button onClick={() => {localStorage.removeItem("nickname"); window.location.reload();}} className="bg-red-500 text-white p-2 rounded ml-2">
				Reset Nickname
			</button>
		</div>
	);
}

export default App;
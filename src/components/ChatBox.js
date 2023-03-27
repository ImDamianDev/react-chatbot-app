import React, { useState } from "react";
import "./ChatBox.css";
import { GPTChat } from "../api/GPTChat";

export const ChatBox = () => {

    const [chatHistory, setChatHistory] = useState([]);
    const [inputText, setInputText] = useState("");

    console.log(chatHistory)
    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleKeyDown = async (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (inputText.trim()) {
                const userMessage = {
                    message: inputText,
                    sender: "user",
                    timestamp: new Date().getTime(),
                };
                setChatHistory([...chatHistory, userMessage]);
                const botMessage = await GPTChat(inputText);
                const botResponse = {
                    message: botMessage,
                    sender: "bot",
                    timestamp: new Date().getTime(),
                };
                setChatHistory([...chatHistory, userMessage, botResponse]);
                setInputText("");
            }
        }
    };

    const handleSendClick = async () => {
        if (inputText.trim()) {
            const userMessage = {
                message: inputText,
                sender: "user",
                timestamp: new Date().getTime(),
            };
            setChatHistory([...chatHistory, userMessage]);
            console.log(chatHistory)
            const botMessage = await GPTChat(inputText);
            const botResponse = {
                message: botMessage,
                sender: "bot",
                timestamp: new Date().getTime(),
            };
            setChatHistory([...chatHistory, userMessage, botResponse]);
            setInputText("");
        }
    };

    return (
        <div className="chat-box-container">

            <div className="chat-box mb-5">
                <div
                    className={`message bot`}
                >
                    <div className={`message-text bot`}>
                        Hola! Soy una aplicacion creada con React que utiliza un modelo de lenguaje desarrollado por OpenAI.
                    </div>
                </div>
                <div
                    className={`message bot`}
                >
                    <div className={`message-text bot`}>
                        Estoy diseñado para responder preguntas y mantener conversaciones en varios temas. ¿En qué puedo ayudarte hoy?
                    </div>
                </div>
                {chatHistory.map((message, index) => (
                    <div
                        className={`message ${message.sender}`}
                        key={`${message.sender}-${message.timestamp}`}
                    >
                        <div className={`message-text ${message.sender}`}>
                            <h5 className="sender-name">{message.sender}</h5>
                            {message.message}
                        </div>
                    </div>
                ))}
            </div>

            <div className="input-container d-flex">
                <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu pregunta aqui..."
                />
                <button onClick={handleSendClick}>Send</button>
            </div>
        </div>
    );
};

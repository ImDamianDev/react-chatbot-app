import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { openaiConfig } from '../config';
/*
option1 = {
    prompt: inputText,
    max_tokens: 50,
    n: 1,
    stop: '\n',
    temperature: 1
}

option2 = {
    model: "text-davinci-003",
    prompt: inputText,
    temperature: 0,
    top_p: 1,
    frecuency_penalty: 0,
    presensce_penalty: 0,
    max_tokens: 1024
}
*/
const ChatBox = () => {
    //estado para el texto de entrada del usuario
    const [inputText, setInputText] = useState('');
    //estado para almacenar la lista de mensajes
    const [messages, setMessages] = useState([]);

    //El estado de mensajes se inicializa con un mensaje 
    //de bienvenida del bot.
    useEffect(() => {
        const welcomeMessage = {
            text: '¡Hola! ¿En qué puedo ayudarte?',
            sender: 'bot'
        };
        setMessages([welcomeMessage]);
    }, []);

    //se llama cuando el usuario envía un mensaje.
    const handleMessageSubmit = async (event) => {
        event.preventDefault();
        //se crea un objeto userMessage que representa
        //el mensaje del usuario y se agrega al estado
        //local messages utilizando el spread operator.
        const userMessage = {
            text: inputText,
            sender: 'user'
        };
        //actualiza el estado local con el nuevo mensaje
        //del usuario
        setMessages([...messages, userMessage]);
        //limpia el estado inputText para que el campo de entrada esté vacío.
        setInputText('');
        //envía una solicitud HTTP a la API de ChatGPT
        //utilizando Axios para obtener una respuesta del bot.
        const gptResponse = await axios.post(
            'https://api.openai.com/v1/engines/text-davinci-003/completions',
            {
                prompt: inputText,
                max_tokens: 1024,
                n: 1,
                temperature: 0
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiConfig.apiKey}`
                }
            }
        );
        //se crea un objeto botMessage que representa la respuesta del bot
        const botMessage = {
            text: gptResponse.data.choices[0].text,
            sender: 'bot'
        };
        //agrega al estado messages.
        setMessages([...messages, botMessage]);
        console.log(messages)
    };

    return (
        <div>
            <h1>ChatGPT</h1>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>
                        <div>{message.sender}: {message.text}</div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleMessageSubmit}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(event) => setInputText(event.target.value)}
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default ChatBox;

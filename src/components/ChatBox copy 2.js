import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatBox.css';
import { openaiConfig } from '../config';

const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-003/completions';

function ChatBox() {
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  function handleChange(event) {
    setInputText(event.target.value);
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      submitMessage();
    }
  }

  function submitMessage() {
    if (inputText === '') {
      return;
    }

    const newMessage = {
      text: inputText,
      sender: 'user',
    };
    setChatHistory([...chatHistory, newMessage]);
    setInputText('');

    axios
      .post(apiUrl, {
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
      })
      .then((response) => {
        const botMessage = {
          text: response.data.choices[0].text.trim(),
          sender: 'bot',
        };
        setChatHistory([...chatHistory, botMessage]);
        scrollToBottom();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function scrollToBottom() {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="chat-box-container">
      <div className="chat-box">
        {chatHistory.map((message, index) => {
          const className =
            message.sender === 'user' ? 'message user' : 'message bot';
          const alignment = message.sender === 'user' ? 'right' : 'left';
          return (
            <div key={index} className={className}>
              <div className={`message-text ${alignment}`}>
                {message.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputText}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
        <button onClick={submitMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;

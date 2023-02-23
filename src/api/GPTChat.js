export async function GPTChat(prompt) {
    const response = await fetch(`https://api.openai.com/v1/engines/text-davinci-003/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            prompt,
            max_tokens: 512,
            n: 1,
            temperature: 0
        })
    });
    const data = await response.json();
    return data.choices[0].text.trim();
}

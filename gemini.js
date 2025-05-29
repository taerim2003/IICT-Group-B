async function generateContent(userMsg) {
    // 사용자의 입력을 히스토리에 추가
    conversationHistory.add('user', userMsg);

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: SYSTEM_PROMPT }],
                },
                contents: conversationHistory.getAll(),
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text;

        const cleanedText = reply.replace(/```json/g, '').replace(/```/g, '').trim();

        // 모델 응답을 히스토리에 추가
        conversationHistory.add('model', cleanedText);

        const parsed = JSON.parse(cleanedText);

        return parsed;
    } catch (error) {
        console.error('Error:', error);
        return '(에러 발생)';
    }
}


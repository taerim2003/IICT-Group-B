// 텍스트에 포함된 JSON 객체를 찾아 파싱하는 도우미 함수입니다.
// Gemini API가 JSON 외의 텍스트를 함께 반환할 수 있으므로 필요합니다.
function extractJsonFromString(text) {
    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}');

    if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
        try {
            const jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1);
            return JSON.parse(jsonString); // 추출된 문자열을 JSON으로 파싱
        } catch (e) {
            console.warn("JSON 추출 또는 파싱 실패:", e);
            console.warn("실패한 원본 텍스트:", text);
            return null; // 실패 시 null 반환
        }
    }
    return null; // JSON을 찾지 못한 경우 null 반환
}

// Gemini API를 사용하여 콘텐츠를 생성하는 메인 함수입니다.
// conversation-UI.js의 handleUserInput() 함수에서 호출됩니다.
async function generateContent(userMsg) {
    // 사용자의 입력을 대화 기록에 추가합니다 (gemini-data.js에서 참조).
    conversationHistory.add('user', userMsg);

    try {
        // SYSTEM_PROMPT가 제대로 로드되었는지 확인합니다 (system-prompt-manager.js에서 참조).
        console.log('Gemini API 호출 전 SYSTEM_PROMPT 상태:', SYSTEM_PROMPT.length > 0 ? '로드됨 (길이: ' + SYSTEM_PROMPT.length + ')' : '비어있거나 로드 실패');
        if (SYSTEM_PROMPT.length === 0) {
            console.error("SYSTEM_PROMPT가 비어있습니다. system-prompt.txt 파일을 확인하세요. 시스템 프롬프트 없이는 API 호출이 실패할 수 있습니다.");
            // UI의 오류 처리를 위해 JSON과 유사한 구조를 반환합니다.
            return { response: '(시스템 프롬프트 로드 에러)', affinity: 0, tension: 0, relevance: 0 }; 
        }

        const payload = {
            system_instruction: {
                parts: [{ text: SYSTEM_PROMPT }],
            },
            contents: conversationHistory.getAll(),
            // CRITICAL: 모델이 JSON 형식으로만 응답하도록 스키마와 함께 명확히 지시합니다.
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        "affinity": { "type": "number" },
                        "tension": { "type": "number" },
                        "relevance": { "type": "number" },
                        "response": { "type": "string" }
                    },
                    "propertyOrdering": ["affinity", "tension", "relevance", "response"]
                }
            }
        };

        // API 호출을 수행합니다.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Gemini API HTTP 에러! 상태: ${response.status}, 메시지: ${errorText}`);
            // UI의 오류 처리를 위해 JSON과 유사한 구조를 반환합니다.
            return { response: `(API 호출 에러: ${response.status})`, affinity: 0, tension: 0, relevance: 0 };
        }

        const data = await response.json();
        // 모델에서 원본 텍스트 응답을 추출합니다.
        const rawReply = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] ? data.candidates[0].content.parts[0].text : null;
        
        if (rawReply === null) {
            console.error('Gemini 응답에 텍스트 내용이 없습니다:', data);
            return { response: '(응답 텍스트 없음)', affinity: 0, tension: 0, relevance: 0 };
        }

        // 원본 응답에서 JSON 부분을 추출하고 파싱을 시도합니다.
        const parsed = extractJsonFromString(rawReply); 

        if (parsed === null) {
            console.error('JSON 파싱 실패: extractJsonFromString 함수에서 유효한 JSON을 찾지 못했습니다.');
            console.error('파싱 실패한 원본 텍스트 (rawReply):', rawReply);
            // UI의 오류 처리를 위해 JSON과 유사한 구조를 반환합니다.
            return { response: '(JSON 파싱 에러 - 추출 실패)', affinity: 0, tension: 0, relevance: 0 };
        }

        // 원본 모델 응답을 대화 기록에 추가합니다.
        conversationHistory.add('model', rawReply); 

        // 파싱된 JSON 객체에 필수 필드가 존재하고 타입이 올바른지 확인합니다.
        if (typeof parsed.affinity !== 'number' || typeof parsed.tension !== 'number' || typeof parsed.relevance !== 'number' || typeof parsed.response !== 'string') {
            console.error('파싱된 JSON에 필수 필드가 누락되었거나 타입이 올바르지 않습니다:', parsed);
            return { response: '(응답 필드 누락/형식 에러)', affinity: 0, tension: 0, relevance: 0 };
        }

        return parsed;

    } catch (error) {
        console.error('Gemini API 호출 또는 처리 중 최종 에러 발생:', error);
        return { response: '(알 수 없는 최종 API 에러)', affinity: 0, tension: 0, relevance: 0 };
    }
}

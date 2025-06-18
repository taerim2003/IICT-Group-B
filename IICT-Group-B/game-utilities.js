// 이 파일은 대화 기록 저장 버튼 설정과 같은 게임의 일반 유틸리티 함수를 포함합니다.

// 대화 기록 저장 버튼을 설정합니다.
// sketch.js의 setup() 함수에서 호출됩니다.
function setSaveHistoryButton() {
    // saveBtn은 global-vars.js에 선언되어 있습니다.
    saveBtn = createButton('대화 기록 저장');
    saveBtn.position(10, 10); // P5.js 캔버스의 좌측 상단에 위치
    saveBtn.mousePressed(saveHistoryAsFile); // 클릭 핸들러 할당
    console.log("대화 기록 저장 버튼 생성 완료.");
}

// 대화 기록을 텍스트 파일로 다운로드하는 함수입니다.
// saveBtn 클릭 시 호출됩니다.
function saveHistoryAsFile() 
{
    console.log("대화 기록 저장 중...");
    // conversationHistory는 gemini-data.js에 정의된 전역 객체입니다.
    const text = conversationHistory.history.map(entry => `${entry.role}: ${entry.parts[0].text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversation_history.txt';
    a.click();

    URL.revokeObjectURL(url);
    console.log("대화 기록 파일 다운로드 완료.");
}

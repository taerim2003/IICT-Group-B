const conversationHistory = {
    history: [],
  
    // 대화 추가
    add(role, text) {
      this.history.push({
        role: role,
        parts: [{ text: text }],
      });
    },
  
    // 최신 N턴만 반환
    getRecent(turns = 10) {
      return this.history.slice(-turns);
    },
  
    // 전체 반환
    getAll() {
      return this.history;
    },
  
    // 초기화
    reset() {
      this.history = [];
    },
  };

// 디버깅 용이성을 위해 버튼 클릭시 파일 다운로드 되도록
function saveHistoryAsFile() 
    {
        const text = conversationHistory.history.map(entry => `${entry.role}: ${entry.parts[0].text}`).join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'conversation_history.txt';
        a.click();

        URL.revokeObjectURL(url);
    }

function setSaveHistoryButton()
{
    saveBtn = createButton('대화 기록 저장');
    saveBtn.position(10, 10);
    saveBtn.mousePressed(saveHistoryAsFile);
}
// 이 파일은 Gemini API 상호작용을 위한 대화 기록을 관리합니다.

const conversationHistory = {
    history: [],
 
    // 대화 기록에 새 항목을 추가합니다.
    add(role, text) {
      this.history.push({
        role: role,
        parts: [{ text: text }],
      });
    },
 
    // 대화 기록의 최근 N턴을 반환합니다.
    getRecent(turns = 10) {
      return this.history.slice(-turns);
    },
 
    // 전체 대화 기록을 반환합니다.
    getAll() {
      return this.history;
    },
 
    // 대화 기록을 초기화합니다.
    reset() {
      this.history = [];
    },
};

// setSaveHistoryButton 및 saveHistoryAsFile 함수는 game-utilities.js로 이동했습니다.

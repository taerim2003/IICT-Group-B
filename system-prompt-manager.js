// 이 파일은 시스템 프롬프트 텍스트의 로딩 및 접근성을 관리합니다.
// sketch.js의 preload() 함수에서 호출됩니다.

// 시스템 프롬프트 텍스트를 저장할 전역 변수 (global-vars.js에서 정의).
// let SYSTEM_PROMPT = ''; // global-vars.js에 선언되어 있으므로 여기서는 선언하지 않습니다.

// loadStrings 콜백 함수: 파일 로드 성공 시 실행됩니다.
function fileLoaded(lines) {
    // 줄들을 하나의 문자열로 결합하여 SYSTEM_PROMPT에 저장합니다.
    SYSTEM_PROMPT = lines.join('\n');
    console.log('System prompt 로드 완료 @@@@@@. 길이:', SYSTEM_PROMPT.length); 
    console.log('System prompt 내용 (처음 200자):', SYSTEM_PROMPT.substring(0, 200)); 
}

// loadStrings 콜백 함수: 파일 로드 오류 시 실행됩니다.
function fileError(err) {
    console.error('System prompt 파일을 불러오지 못했습니다:', err);
}

// system-prompt.txt 파일을 로드하는 함수입니다.
// sketch.js의 preload() 함수에서 호출됩니다.
function loadSystemPrompt() {
    // P5.js의 loadStrings 함수를 사용하여 'system-prompt.txt' 파일을 비동기적으로 로드합니다.
    loadStrings('system-prompt.txt', fileLoaded, fileError);
}

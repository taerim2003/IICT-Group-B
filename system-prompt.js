let SYSTEM_PROMPT = '';


function fileLoaded(lines) {
    // 줄들을 하나의 문자열로 결합하여 SYSTEM_PROMPT에 저장
    SYSTEM_PROMPT = lines.join('\n');
    console.log('System prompt 로드완료 @@@@@@');
  }

  function fileError(err) {
    console.error('System prompt 파일을 불러오지 못했습니다:', err);
  }
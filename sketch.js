function setup() 
{
  createCanvas(500, 500);

  // 플레이어 입력
  initializeInput();

  // 디버깅용 대화 기록 저장 버튼
  setSaveHistoryButton();
}

function draw() 
{
  background(220);

  // AI 응답 출력
  DrawOutputText();
}


function keyPressed() 
{
  if (key === 'Enter') {
    handleUserInput();
  }
}


// 이 파일은 P5.js 캔버스에 대화 텍스트를 그리는 것을 관리합니다.
// global-vars.js의 currentSurvivorText 및 currentPlayerText 변수를 사용합니다.

// P5.js 캔버스에 대화 텍스트를 그립니다.
// sketch.js의 draw() 함수에서 호출됩니다.
function drawDialogueText() {
    // 대화 상자 위치 및 크기 계산.
    // 하단의 입력 영역의 대략적인 높이를 고려합니다.
    let dialogueBoxHeight = 250;     
    let dialogueBoxY = height - 20 - 50 - dialogueBoxHeight; 
    dialogueBoxY = max(dialogueBoxY, height * 0.55); // 캐릭터와 너무 겹치지 않도록 보장합니다.

    let dialogueBoxX = width * 0.1;  
    let dialogueBoxWidth = width * 0.8; 

    // 대화 상자 배경 (반투명 검정).
    fill(0, 0, 0, 80); 
    noStroke();
    rect(dialogueBoxX, dialogueBoxY, dialogueBoxWidth, dialogueBoxHeight, 15); // 둥근 모서리

    // 텍스트 스타일링.
    textSize(20);
    textFont('Arial'); 
    let padding = 20;
    let lineHeight = 28; 

    // 생존자 응답 그리기 (상단, 왼쪽 정렬).
    fill(255); 
    textAlign(LEFT, TOP); 
    let survivorTextY = dialogueBoxY + padding;
    let survivorMaxHeight = dialogueBoxHeight - (padding * 2) - (lineHeight * 2); 
    text("생존자: " + currentSurvivorText, 
         dialogueBoxX + padding, survivorTextY, dialogueBoxWidth - padding * 2, survivorMaxHeight);

    // 플레이어 질문 그리기 (하단, 오른쪽 정렬).
    fill(150, 200, 255); 
    textAlign(RIGHT, TOP); 
    let playerMaxHeight = lineHeight * 2; 
    let playerTextY = dialogueBoxY + dialogueBoxHeight - padding - playerMaxHeight; 
    text("플레이어: " + currentPlayerText, 
         dialogueBoxX + padding, playerTextY, dialogueBoxWidth - padding * 2, playerMaxHeight);
    textAlign(LEFT, TOP); // 다음 그리기 작업을 위해 텍스트 정렬을 재설정합니다.
}

// 생존자와 플레이어를 위한 새로운 대화 텍스트를 설정합니다.
// conversation-UI.js에서 호출됩니다.
// global-vars.js의 currentSurvivorText 및 currentPlayerText를 업데이트합니다.
function setDialogueText(survivorText, playerText) {
    currentPlayerText = playerText; 
    currentSurvivorText = survivorText; 
    console.log("setDialogueText 호출됨. 생존자:", currentSurvivorText, "플레이어:", currentPlayerText);
}

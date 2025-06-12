// 이 파일은 P5.js 캔버스에 대화 텍스트를 그리는 것을 관리합니다.
// global-vars.js의 currentSurvivorText 및 currentPlayerText 변수를 사용합니다.

// P5.js 캔버스에 대화 텍스트를 그립니다.
// sketch.js의 draw() 함수에서 호출됩니다.
let dialogueBoxImg;

function preload() {
  // ...기존 preload 코드...
  dialogueBoxImg = loadImage('assets/dialoguebox.png'); // 원하는 이미지 경로
}
function drawDialogueText() {
  // 대화 상자 위치 및 크기 계산
  let dialogueBoxHeight = 250;
  let dialogueBoxY = height - 20 - 50 - dialogueBoxHeight;
  dialogueBoxY = max(dialogueBoxY, height * 0.55);
  let dialogueBoxX = width * 0.1;
  let dialogueBoxWidth = width * 0.8;

  // 1. 대화 상자 배경 이미지를 그림
  if (dialogueBoxImg) {
    image(dialogueBoxImg, dialogueBoxX, dialogueBoxY, dialogueBoxWidth, dialogueBoxHeight);
  } else {
    // 이미지가 없으면 기존 사각형 백업
    fill(0, 0, 0, 80);
    noStroke();
    rect(dialogueBoxX, dialogueBoxY, dialogueBoxWidth, dialogueBoxHeight, 15);
  }

  // 2. 텍스트 스타일 설정
  textSize(20);
  textFont('Arial');
  let padding = 20;
  let lineHeight = 28;

  // 3. 생존자 응답 (상단, 왼쪽 정렬)
  fill(255);
  textAlign(LEFT, TOP);
  let survivorTextY = dialogueBoxY + padding;
  let survivorMaxHeight = dialogueBoxHeight - (padding * 2) - (lineHeight * 2);
  text(
    "생존자: " + currentSurvivorText,
    dialogueBoxX + padding,
    survivorTextY,
    dialogueBoxWidth - padding * 2,
    survivorMaxHeight
  );

  // 4. 플레이어 질문 (하단, 오른쪽 정렬)
  fill(150, 200, 255);
  textAlign(RIGHT, TOP);
  let playerMaxHeight = lineHeight * 2;
  let playerTextY = dialogueBoxY + dialogueBoxHeight - padding - playerMaxHeight;
  text(
    "플레이어: " + currentPlayerText,
    dialogueBoxX + padding,
    playerTextY,
    dialogueBoxWidth - padding * 2,
    playerMaxHeight
  );

  textAlign(LEFT, TOP); // 정렬 초기화
}

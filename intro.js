let scene = 0;
let lines = [];
let displayedText = "";
let charIndex = 0;
let lineIndex = 0;
let nextCharTime = 0;
let typingSpeed = 30;
let button;
let customFont;

function preloadIntro() {
  customFont = loadFont("Bold.ttf");
}

function setupIntro() {
  textFont(customFont);
  textSize(20);
  fill(255);
  lines = getSceneLines(scene);
  setupButton();
}

function drawIntro() {
  background(0);
  textAlign(CENTER, TOP); // 가로 중앙 정렬
  textWrap(WORD);         // 단어 단위 줄바꿈
  textSize(20);
  textFont(customFont);
  fill(255);

  let textBlock = displayedText;
  let linesCount = textBlock.split('\n').length;
  let lineHeight = 30;
  let totalHeight = linesCount * lineHeight;
  let yStart = (height - totalHeight) / 2;

  // 중앙 정렬, 최대 너비 지정
  // x좌표를 width/2 - (width*0.8)/2로 해야 "사각형"이 중앙에 위치함
  let boxWidth = width * 0.8;
  let boxX = width / 2 - boxWidth / 2;
  text(textBlock, boxX, yStart, boxWidth);
  
 
  drawButton();
  // 이하 생략


  if (millis() > nextCharTime && lineIndex < lines.length) {
    if (charIndex < lines[lineIndex].length) {
      displayedText += lines[lineIndex][charIndex];
      charIndex++;
    } else {
      displayedText += "\n";
      lineIndex++;
      charIndex = 0;
    }
    nextCharTime = millis() + typingSpeed;
  }
}

function setupButton() {
  button = {
    x: 650,
    y: 500,
    width: 100,
    height: 40,
    label: "수사 시작"
  };
}

function drawButton() {
  if ((scene === 0 || scene === 1) && lineIndex >= lines.length) {
    fill(50);
    let btnW = 100, btnH = 40;
    let btnX = width / 2 - btnW / 2;
    let btnY = height - 120; // 원하는 y값
    rect(btnX, btnY, btnW, btnH, 10);
    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    let label = (scene === 0) ? "수사 시작" : "게임 시작";
    text(label, width / 2, btnY + btnH / 2);
    // button.x, button.y도 btnX, btnY로 업데이트(클릭 판정용)
    button.x = btnX;
    button.y = btnY;
    button.width = btnW;
    button.height = btnH;
  }
}


function changeScene(newScene) {
  scene = newScene;
  lines = getSceneLines(scene);
  displayedText = "";
  charIndex = 0;
  lineIndex = 0;
  nextCharTime = 0;
}

function getSceneLines(scene) {
  if (scene === 0) {
    return [
      "Case 2: 장이섬",
      "2100년 5월 24일 18시경, 인적이 드문 장이섬 산속",
      "밖에서 문이 잠긴 건물에 화재가 발생했습니다.",
      "현장에서 반 학생 전원, 교장 박성철, 교사 고유미가 사망한 채 발견되었습니다.",
      "유일한 생존자는 사건을 신고한 여교사 남지연입니다.",
      "상부는 단순 사고로 결론지었지만, 의문점이 많아",
      "당신은 수사관으로서 직접 증인을 심문하게 되었습니다.",
      "사건의 진실을 밝혀주세요."
    ];
  } else if (scene === 1) {
    return [
      "Q 봇",
      "탐정님, 사건 브리핑을 시작하겠습니다.",
      "",
      "1. 사건 장소",
      "* 장이섬 산속 외딴 교육시설",
      "",
      "2. 피해자",
      "* 엠버 아카데미 학생 12명 (이름 및 정보 비공개)",
      "* 박성철 (교장)",
      "* 고유미 (교사)",
      "",
      "3. 사건 개요",
      "* 2100년 5월 24일 18시경, 장이섬의 외딴 건물에서 화재 발생.",
      "* 건물은 외부에서 잠겨 있었고, 내부 인원은 대피 불가 상태.",
      "* 유일한 생존자인 교사 남지연이 화재 발생을 신고.",
      "* 경찰 도착 당시 모든 학생 및 교직원 사망 확인.",
      "* 상부는 사고로 결론지었으나, 정황상 인위적인 요소가 있어 조사가 필요합니다.",
      "",
      "4. 참고 사항",
      "* 엠버 아카데미는 비밀리에 운영되던 정부 주도 교정 실험 시설이었습니다.",
      "* 당신은 이 사건의 진실을 밝히기 위해 투입된 조사관입니다.",
      "* 사건이 사고인지 살인사건인지 유일한 생존자를 심문하여 알아내십시오.",
      "* 긴장도와 친밀도를 잘 조절하십시오 (심문 중 태도와 대화 선택지가 영향을 줍니다)."
    ];
  }
  return [];
}


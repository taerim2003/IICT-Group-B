let scene = 0;
let lines = [];
let displayedText = "";
let charIndex = 0;
let lineIndex = 0;
let nextCharTime = 0;
let typingSpeed = 30; // 밀리초 단위
let button;
let customFont;

function preload() {
  customFont = loadFont("Bold.ttf"); // 폰트 파일 이름
}

function setup() {
  createCanvas(800, 600);
  textFont(customFont); // 적용
  textSize(20);
  fill(255);
  lines = getSceneLines(scene);
  setupButton();
  
}

function draw() {
  background(0);
  let y = 100;
  let currentText = displayedText.split('\n');
  for (let i = 0; i < currentText.length; i++) {
    text(currentText[i], 50, y);
    y += 30;
  }

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

function mousePressed() {
  // 버튼 클릭으로 다음 씬 이동
  if (
    mouseX > button.x &&
    mouseX < button.x + button.width &&
    mouseY > button.y &&
    mouseY < button.y + button.height
  ) {
    if (scene === 0) {
      changeScene(1);
    }
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
  if (scene === 0 && lineIndex >= lines.length) {
    fill(50);
    rect(button.x, button.y, button.width, button.height, 10);
    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(button.label, button.x + button.width / 2, button.y + button.height / 2);
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

function draw() {
  background(0);
  let y = 100;
  let currentText = displayedText.split('\n');
  for (let i = 0; i < currentText.length; i++) {
    text(currentText[i], 50, y);
    y += 30;
  }

  drawButton();

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



// HTML/CSS에서 정의한 게임 컨테이너의 크기와 동일하게 설정
let gameContainerWidth = 1280; 
let gameContainerHeight = 720; 

// 캐릭터 이미지를 담을 변수 선언
let characterImage; // 기본 표정 (witness.png)
let tensionCharacterImage; // 긴장 (anxious.png)
let happyCharacterImage; // 미소 (smile.png)

// 게임 수치 (초기값 설정)
let tensionScore = 30; 
let affinityScore = 30;

// === 대화 텍스트 관련 변수 ===
let currentSurvivorText = ''; // 현재 생존자의 답변
let currentPlayerText = '';   // 현재 플레이어의 질문


// preload() 함수: P5.js 스케치가 시작되기 전에 이미지, 폰트 등 외부 파일을 로드합니다.
function preload() {
    console.log("preload() 시작: 이미지 로드 중...");

    characterImage = loadImage('assets/witness.png', 
        () => console.log("기본 캐릭터 이미지 (witness.png) 로드 성공!"),
        (event) => {
            console.error("기본 캐릭터 이미지 (witness.png) 로드 실패:", event);
            console.error("경로를 다시 확인해주세요: 'assets/witness.png'");
        }
    ); 
    tensionCharacterImage = loadImage('assets/anxious.png', 
        () => console.log("긴장 캐릭터 이미지 (anxious.png) 로드 성공!"),
        (event) => {
            console.error("긴장 캐릭터 이미지 (anxious.png) 로드 실패:", event); 
            console.error("경로를 다시 확인해주세요: 'assets/anxious.png'");
        }
    ); 
    happyCharacterImage = loadImage('assets/smile.png', 
        () => console.log("친밀 캐릭터 이미지 (smile.png) 로드 성공!"),
        (event) => {
            console.error("친밀 캐릭터 이미지 (smile.png) 로드 실패:", event);
            console.error("경로를 다시 확인해주세요: 'assets/smile.png'");
        }
    ); 

    let lines = loadStrings('system-prompt.txt', fileLoaded, fileError);
    
    // 노트 리소스 불러오기
    preloadNote();
}

function setup() {
    console.log("setup() 시작");
    // 캔버스를 HTML 요소인 #p5-canvas-container 내부에 생성
    let canvas = createCanvas(gameContainerWidth, gameContainerHeight);
    canvas.parent('p5-canvas-container'); // 캔버스를 지정된 HTML div의 자식으로 설정

    // 캔버스 배경을 완전 투명하게 설정하여 아래에 있는 CSS 배경 이미지가 보이도록 함
    clear(); 
    
    // UI 요소들을 초기화하고 이벤트 리스너를 설정하는 함수를 호출
    // 이 함수는 conversation-UI.js에 정의되어 있습니다.
    initializeUIElements();

    // 디버깅용 대화 기록 저장 버튼
    // 이 버튼은 P5.js의 createButton으로 생성되므로, 캔버스 위에 배치.
    setSaveHistoryButton();
    saveBtn.position(10, 10); // 좌측 상단 (P5.js 캔버스 기준)

    // 게임 시작 시 초기 대화 메시지 설정 (setDialogueText 함수를 사용하여 일관성 유지)
    setDialogueText('', ''); // 생존자 메시지, 플레이어 메시지
    console.log("setup() 완료");

    // 초기 수치 표시 업데이트
    updateScoreDisplays();

    // 탐정노트 셋업
    noteButton();
    setupNote();
}

function draw() {
    // 캔버스를 매 프레임마다 투명하게 지웁니다.
    // 이렇게 해야 CSS로 설정된 배경 이미지가 계속 보입니다.
    clear(); 
    
    // === 캐릭터 이미지 그리기 ===
    let currentCharacterImage = characterImage; // 기본은 witness.png

    // 긴장도 수치가 100 이상이면 긴장 표정 
    if (tensionScore >= 100) { 
        currentCharacterImage = tensionCharacterImage; 
    } 
    // 친밀도 수치가 100 이상이면 친밀 표정 (긴장이 우선순위가 높다고 가정) 
    else if (affinityScore >= 100) {
        currentCharacterImage = happyCharacterImage; // happyCharacterImage 사용
    }

    // 현재 선택된 캐릭터 이미지가 유효하게 로드되었는지 확인 후 그립니다.
    if (currentCharacterImage && currentCharacterImage.width > 0 && currentCharacterImage.height > 0) {
        imageMode(CENTER); 
        // 이미지 크기 및 위치 조정: 캔버스 크기에 비례하도록 설정
        image(currentCharacterImage, width * 0.5, height * 0.5, currentCharacterImage.width * 0.5, currentCharacterImage.height * 0.5);
        imageMode(CORNER); // 다른 P5.js 그리기 작업에 영향을 주지 않도록 기본값으로 되돌립니다.
    } else {
        // console.warn("캐릭터 이미지가 아직 로드되지 않았거나 유효하지 않습니다. 경로를 확인해주세요.");
    }
    
    // 대화 텍스트 그리기
    drawDialogueText();

    // 노트 그리기
    drawNote();
}

// 이 함수는 conversation-UI.js에서 호출될 것입니다.
// 게임 수치를 업데이트하고 HTML UI에 반영합니다.
function updateGameScores(newTension, newAffinity) { 
    tensionScore = constrain(newTension, 0, 100); // 0-100 범위로 제한 
    affinityScore = constrain(newAffinity, 0, 100); // 0-100 범위로 제한
    updateScoreDisplays(); // HTML UI 업데이트
    console.log(`수치 업데이트: 긴장도=${tensionScore}, 친밀도=${affinityScore}`); // 불안 -> 긴장도, anxietyScore -> tensionScore
}

// 대화 텍스트를 캔버스에 그리는 함수
function drawDialogueText() {
    // 대화창 위치 및 크기 조정
    // 입력창의 대략적인 높이 (padding + font-size + border)를 고려하여 계산
    // input-area의 bottom: 20px, 대략적인 높이 50px (20px + 50px = 70px)
    // 따라서 dialogueBoxY는 height - 70px - dialogueBoxHeight 로 설정
    let dialogueBoxHeight = 250;     // 대화창 높이 (더 늘려서 텍스트 공간 확보)
    let dialogueBoxY = height - 20 - 50 - dialogueBoxHeight; // 입력창 위 50px 공간 + 입력창 높이 + 대화창 높이
    dialogueBoxY = max(dialogueBoxY, height * 0.55); // 캐릭터와 겹치지 않도록 최소 Y값 설정

    let dialogueBoxX = width * 0.1;  // 대화창 시작 X 위치
    let dialogueBoxWidth = width * 0.8; // 대화창 너비

    // 대화창 배경 (투명도 조정)
    fill(0, 0, 0, 80); // 반투명 검정색 (80으로 유지)
    noStroke();
    rect(dialogueBoxX, dialogueBoxY, dialogueBoxWidth, dialogueBoxHeight, 15); // 둥근 모서리

    // 텍스트 스타일 설정
    textSize(20);
    textFont('Arial'); // 폰트 설정 (웹 폰트 로드 시 해당 폰트 이름 사용)
    let padding = 20;
    let lineHeight = 28; // 줄 간격

    // 생존자 답변 그리기 (위에 표시)
    fill(255); // 흰색 텍스트
    textAlign(LEFT, TOP); // 생존자 답변은 왼쪽 정렬
    let survivorTextY = dialogueBoxY + padding;
    // P5.js text() 함수는 너비와 높이 인자가 주어지면 해당 영역에 맞춰 텍스트를 줄 바꿈하고,
    // 영역을 넘어서는 텍스트는 잘립니다.
    // 여기서는 생존자 답변이 표시될 최대 높이를 계산하여 전달합니다.
    let survivorMaxHeight = dialogueBoxHeight - (padding * 2) - (lineHeight * 2); 
    text("생존자: " + currentSurvivorText, 
         dialogueBoxX + padding, survivorTextY, dialogueBoxWidth - padding * 2, survivorMaxHeight);

    // 플레이어 질문 그리기 (아래에, 오른쪽 정렬)
    fill(150, 200, 255); // 플레이어 텍스트 색상 (약간 파란색)
    textAlign(RIGHT, TOP); // 플레이어 텍스트는 오른쪽 정렬
    let playerMaxHeight = lineHeight * 2; // 플레이어 질문은 두 줄까지 가능하게
    let playerTextY = dialogueBoxY + dialogueBoxHeight - padding - playerMaxHeight; // 대화창 하단에 가깝게
    text("플레이어: " + currentPlayerText, 
         dialogueBoxX + padding, playerTextY, dialogueBoxWidth - padding * 2, playerMaxHeight);
    textAlign(LEFT, TOP); // 다음 그리기 작업을 위해 기본값으로 되돌림

}

// 이 함수는 conversation-UI.js에서 호출될 것입니다.
// 새로운 대화 텍스트를 설정합니다.
function setDialogueText(survivorText, playerText) {
    currentPlayerText = playerText; // 플레이어 질문 먼저 설정
    currentSurvivorText = survivorText; // 생존자 답변 설정
    console.log("setDialogueText 호출됨. 생존자:", currentSurvivorText, "플레이어:", currentPlayerText);
}

function mousePressed()
{
    mousePressedNote();
}
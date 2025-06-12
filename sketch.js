// preload() 함수: P5.js 스케치가 시작되기 전에 이미지, 폰트 등 외부 파일을 로드합니다.
// 캐릭터, 시스템 프롬프트, 노트 관련 리소스 로드 함수를 호출합니다.

let gameState = "intro";
// let startBtn; // ⭐ REMOVE THIS LINE if not used by intro.js button
function preload() {
    console.log("preload() 시작: 리소스 로드 중...");
    preloadIntro();
    loadCharacterImages();
    loadSystemPrompt();
    preloadNote();
    console.log("preload() 완료.");
    // ⭐ REMOVE THE FOLLOWING LINES if intro.js handles the start button ⭐
    // startBtn = createButton('게임 시작');
    // startBtn.position(width/2 - 50, height/2 + 40);
    // startBtn.mousePressed(() => {
    //     gameState = "main";
    //     startBtn.hide();
    // });
}

// setup() 함수: P5.js 스케치가 한 번 초기화될 때 실행됩니다.
// 캔버스 설정, HTML UI 요소 초기화, 게임 상태 준비 등을 담당합니다.
function setup() {
    console.log("setup() 시작");

    // 캔버스 생성
    let canvas = createCanvas(gameContainerWidth, gameContainerHeight);
    canvas.parent('p5-canvas-container');

    // HTML 요소 참조를 global-vars.js에 선언된 전역 변수에 할당합니다.
    p5CanvasContainer = select('#p5-canvas-container');
    scoreDisplayContainerElement = select('#score-display-container');

    // ⭐ ADD THIS LINE HERE, IMMEDIATELY AFTER SELECTING ELEMENTS ⭐
    // UI 요소들을 초기에 숨김. intro 단계에서 보이지 않도록 함.
    hideMainUI();

    // 캔버스 배경을 완전 투명하게 설정
    clear();
    setupIntro();

    // HTML UI 요소들을 초기화하고 이벤트 리스너를 설정합니다.
    initializeUIElements();

    // 디버깅용 대화 기록 저장 버튼 생성
    setSaveHistoryButton();
    saveBtn.position(10, 10);

    // 게임 시작 시 초기 대화 메시지 설정
    setDialogueText('', '');

    // 초기 수치 표시 업데이트
    updateScoreDisplays();

    // 탐정 노트 셋업 및 버튼 생성
    noteButton();
    setupNote();

    console.log("setup() 완료");
}


// draw() 함수: P5.js 스케치가 매 프레임마다 반복적으로 실행됩니다.
// 게임 요소 그리기 및 연속적인 업데이트를 처리합니다.
function draw() {
    // 캔버스를 매 프레임마다 투명하게 지웁니다.
    // 이렇게 해야 CSS로 설정된 배경 이미지가 계속 보입니다.
    clear(); 
    if (gameState === "intro") {
        hideMainUI();
        drawIntro();  // 인트로 화면만 그림
        return;       // 아래 코드 실행하지 않음
    }else {
        // 메인 상태에서는 메인 UI 보이기
        showMainUI();
    }
    // ⭐ 현재 장면 인덱스에 따라 배경 이미지를 그립니다.
    // backgroundImages는 character-loader.js에서 로드됩니다.
    // currentSceneIndex는 conversation-UI.js에서 업데이트됩니다.
    if (backgroundImages[currentSceneIndex]) {
        image(backgroundImages[currentSceneIndex], 0, 0, width, height);
    } else {
        console.warn(`배경 이미지 [${currentSceneIndex}]가 로드되지 않았습니다. 기본 배경색을 사용합니다.`);
        // 로드되지 않은 경우 대체 배경색이라도 채웁니다.
        fill(50, 50, 50);
        rect(0, 0, width, height);
    }

    // 캐릭터 이미지를 그립니다 (character-loader.js에 정의).
    drawCharacter(); 
    
    // 대화 텍스트를 캔버스에 그립니다 (dialogue-manager.js에 정의).
    drawDialogueText();

    // 탐정 노트를 그립니다 (detective-note.js에 정의).
    drawNote();
}

// mousePressed() 함수: 마우스 버튼이 클릭될 때 P5.js에 의해 자동으로 호출됩니다.
// 탐정 노트 관련 마우스 이벤트를 처리합니다.
function mousePressed() {
    if (gameState === "intro") {
        // scene 0: '수사 시작' 버튼 클릭
        if (
            scene === 0 &&
            lineIndex >= lines.length &&
            mouseX > button.x && // assuming 'button' is a global or passed variable from intro.js
            mouseX < button.x + button.width &&
            mouseY > button.y &&
            mouseY < button.y + button.height
        ) {
            changeScene(1); // transition to intro scene 1
            return;
        }
        // scene 1: '게임 시작' 버튼 클릭
        if (
            scene === 1 &&
            lineIndex >= lines.length &&
            mouseX > button.x && // assuming 'button' is a global or passed variable from intro.js
            mouseX < button.x + button.width &&
            mouseY > button.y &&
            mouseY < button.y + button.height
        ) {
            gameState = "main"; // This is the crucial line to transition to main game
            return;
        }
        return; // Don't process main game mouse clicks during intro
    }
    // Main game click handling
    mousePressedNote();
}
function hideMainUI() {
    select('#score-display-container')?.style('display', 'none');
    select('#input-area')?.style('display', 'none'); // Ensure this selects #input-area
    // 다른 UI도 필요하다면 여기에 추가
}

function showMainUI() {
    select('#score-display-container')?.style('display', 'flex');
    select('#input-area')?.style('display', 'flex'); // Ensure this selects #input-area
    // 다른 UI도 필요하다면 여기에 추가
}
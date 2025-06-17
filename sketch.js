
// sketch.js

// 전역 게임 상태를 'intro'로 초기화합니다.
let gameState = "intro";

// ... (다른 전역 변수들: global-vars.js에 정의되어 있을 것으로 예상) ...

/**
 * preload() 함수: P5.js 스케치가 시작되기 전에 이미지, 폰트 등 외부 파일을 로드합니다.
 * 캐릭터, 시스템 프롬프트, 노트 관련 리소스 로드 함수를 호출합니다.
 */
function preload() {
    console.log("preload() 시작: 리소스 로드 중...");
    preloadIntro(); // intro.js의 preload 함수 호출 (폰트 로드)
    loadCharacterImages();
    loadSystemPrompt();
    preloadNote();

    console.log("preload() 완료.");
}

/**
 * setup() 함수: P5.js 스케치가 한 번 초기화될 때 실행됩니다.
 * 캔버스 설정, HTML UI 요소 초기화, 게임 상태 준비 등을 담당합니다.
 */
function setup() {
    console.log("setup() 시작");

    // 캔버스 생성 및 부모 요소 지정
    let canvas = createCanvas(gameContainerWidth, gameContainerHeight);
    canvas.parent('p5-canvas-container');

    // HTML 요소 참조를 전역 변수에 할당 (global-vars.js에 선언됨)
    p5CanvasContainer = select('#p5-canvas-container');
    scoreDisplayContainerElement = select('#score-display-container');
    
    // intro 단계에서는 메인 게임 UI 요소들을 보이지 않도록 초기에 숨깁니다.
    hideMainUI(); 

    // 인트로 셋업 함수 호출 (intro.js)
    setupIntro();

    // HTML UI 요소들을 초기화하고 이벤트 리스너를 설정합니다.

    initializeUIElements();

    // 디버깅용 대화 기록 저장 버튼 생성
    setSaveHistoryButton();
    saveBtn.position(10, 10);

    // 게임 시작 시 초기 대화 메시지 설정 (dialogue-manager.js에 정의)
    setDialogueText('', '');

    // 초기 수치 표시 업데이트 (conversation-UI.js 또는 game-core.js에 정의)
    updateScoreDisplays();

    // 탐정 노트 셋업 및 버튼 생성 (detective-note.js에 정의)
    noteButton();
    setupNote();

    // 도움말 UI 셋업
    createHelpButton();

    console.log("setup() 완료");
}


// draw() 함수: P5.js 스케치가 매 프레임마다 반복적으로 실행됩니다.
// 게임 요소 그리기 및 연속적인 업데이트를 처리합니다.
function draw() {
    // CSS로 설정된 배경 이미지가 보이도록 매 프레임 캔버스를 투명하게 지웁니다.
    clear(); 

    // 배드엔딩 유형에 따라 해당 이미지를 표시하고 그리기를 종료합니다.
    if (badEndingType) {
        let img;
        if (badEndingType === "zero") img = badEndingImage0;
        else if (badEndingType === "tension") img = badEndingImageTension;
        else if (badEndingType === "affinity") img = badEndingImageAffinity;

        if (img) {
            image(img, 0, 0, width, height);
        } else {
            background(0);
            fill(255, 0, 0);
            textSize(48);
            textAlign(CENTER, CENTER);
            text("BAD ENDING", width / 2, height / 2);
        }
        return; // 배드엔딩 상태에서는 다른 게임 요소를 그리지 않음

    }

    // 게임 상태에 따라 그리기 로직을 분기합니다.
    if (gameState === "intro") {
        hideMainUI(); // 인트로 상태에서는 메인 UI를 숨깁니다.
        drawIntro();  // 인트로 화면만 그립니다. (intro.js)
    } else { // gameState === "main"
        showMainUI(); // 메인 게임 상태에서는 UI를 표시합니다.
        
        // 현재 장면에 맞는 배경 이미지를 그립니다.
       
        if (backgroundImages && backgroundImages[currentSceneIndex]) { // backgroundImages 존재 여부 확인 추가
            image(backgroundImages[currentSceneIndex], 0, 0, width, height);
        } else {
            console.warn(`배경 이미지 [${currentSceneIndex}]가 로드되지 않았습니다. 기본 배경색을 사용합니다.`);
            fill(50, 50, 50); // 대체 배경색
            rect(0, 0, width, height);
        }

        // 캐릭터 이미지를 그립니다 (character-loader.js에 정의).
        drawCharacter(); 
    
        // 대화 텍스트를 캔버스에 그립니다 (dialogue-manager.js에 정의).
        drawDialogueText();

        // 탐정 노트를 그립니다 (detective-note.js에 정의).
        drawNote();

        // 도움말 창을 그립니다.
        drawHelpUI();
    }
}

/**
 * mousePressed() 함수: 마우스 버튼이 클릭될 때 P5.js에 의해 자동으로 호출됩니다.
 * 게임 상태에 따라 다른 마우스 이벤트를 처리합니다.
 */
function mousePressed() {

    if (gameState === "intro") {
        // 인트로 화면의 마우스 클릭은 intro.js에서 직접 처리하고,
        // 게임 상태 전환이 필요한지 여부만 반환받습니다.
        const shouldTransition = handleIntroScreenClick(); // intro.js의 함수 호출
        if (shouldTransition) {
            gameState = "main"; // 메인 게임으로 전환
            console.log("게임 상태가 'main'으로 전환되었습니다.");
        }
    } else {
        // 메인 게임 상태에서는 탐정 노트 관련 마우스 이벤트를 처리합니다.
        mousePressedNote(); // detective-note.js의 함수 호출
        handleHelpMousePressed();
    }
}

/**
 * 메인 게임 UI를 숨기는 함수입니다.
 */
function hideMainUI() {
    select('#score-display-container')?.style('display', 'none');
    select('#input-area')?.style('display', 'none');
    select('#note-button')?.style('display', 'none'); // 탐정 노트 버튼도 숨깁니다.
}

/**
 * 메인 게임 UI를 표시하는 함수입니다.
 */
function showMainUI() {
    select('#score-display-container')?.style('display', 'flex');
    select('#input-area')?.style('display', 'flex');
    select('#note-button')?.style('display', 'flex'); // 탐정 노트 버튼도 표시합니다.

}
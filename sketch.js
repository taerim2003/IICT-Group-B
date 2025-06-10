// preload() 함수: P5.js 스케치가 시작되기 전에 이미지, 폰트 등 외부 파일을 로드합니다.
// 캐릭터, 시스템 프롬프트, 노트 관련 리소스 로드 함수를 호출합니다.
let gameState = "intro";
let startBtn;
function preload() {
    console.log("preload() 시작: 리소스 로드 중...");
    preloadIntro();
    loadCharacterImages();     // character-loader.js의 함수 호출
    loadSystemPrompt();        // system-prompt-manager.js의 함수 호출
    preloadNote();             // detective-note.js의 함수 호출
    console.log("preload() 완료.");
    startBtn = createButton('게임 시작');
    startBtn.position(width/2 - 50, height/2 + 40);
    startBtn.mousePressed(() => {
        gameState = "main";
        startBtn.hide();
    });
}

// setup() 함수: P5.js 스케치가 한 번 초기화될 때 실행됩니다.
// 캔버스 설정, HTML UI 요소 초기화, 게임 상태 준비 등을 담당합니다.
function setup() {
    console.log("setup() 시작");
    
    // 캔버스 생성 (global-vars.js의 gameContainerWidth, gameContainerHeight 사용)
    let canvas = createCanvas(gameContainerWidth, gameContainerHeight);
    canvas.parent('p5-canvas-container'); // 캔버스를 HTML div #p5-canvas-container의 자식으로 설정

    // HTML 요소 참조를 global-vars.js에 선언된 전역 변수에 할당합니다.
    p5CanvasContainer = select('#p5-canvas-container');
    scoreDisplayContainerElement = select('#score-display-container');

    // 캔버스 배경을 완전 투명하게 설정하여 아래에 있는 CSS 배경 이미지가 보이도록 함
    clear(); 
    setupIntro();
    // HTML UI 요소들을 초기화하고 이벤트 리스너를 설정합니다 (conversation-UI.js에 정의).
    initializeUIElements();

    // 디버깅용 대화 기록 저장 버튼을 생성합니다 (game-utilities.js에 정의).
    setSaveHistoryButton();
    saveBtn.position(10, 10); // 좌측 상단에 버튼 위치 설정

    // 게임 시작 시 초기 대화 메시지를 설정합니다 (dialogue-manager.js에 정의).
    setDialogueText('', ''); 

    // 초기 수치 표시를 업데이트합니다 (conversation-UI.js에 정의).
    updateScoreDisplays();

    // 탐정 노트를 셋업하고 버튼을 생성합니다 (detective-note.js에 정의).
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
      mouseX > button.x &&
      mouseX < button.x + button.width &&
      mouseY > button.y &&
      mouseY < button.y + button.height
    ) {
      changeScene(1); // scene만 1로!
      return;
    }
    // scene 1: '게임 시작' 버튼 클릭
    if (
      scene === 1 &&
      lineIndex >= lines.length &&
      mouseX > button.x &&
      mouseX < button.x + button.width &&
      mouseY > button.y &&
      mouseY < button.y + button.height
    ) {
      gameState = "main"; // 이제 메인 게임으로!
      return;
    }
    return;
  }
  // 메인 게임 클릭 처리
  mousePressedNote();
}
function hideMainUI() {
    select('#score-display-container')?.style('display', 'none');
    select('#input-container')?.style('display', 'none');
    // 다른 UI도 필요하다면 여기에 추가
}
function showMainUI() {
    select('#score-display-container')?.style('display', 'flex');
    select('#input-container')?.style('display', 'flex');
    // 다른 UI도 필요하다면 여기에 추가
}

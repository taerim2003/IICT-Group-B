
// sketch.js

// 전역 게임 상태를 'intro'로 초기화합니다.
let gameState = "start";

// ... (다른 전역 변수들: global-vars.js에 정의되어 있을 것으로 예상) ...

/**
 * preload() 함수: P5.js 스케치가 시작되기 전에 이미지, 폰트 등 외부 파일을 로드합니다.
 * 캐릭터, 시스템 프롬프트, 노트 관련 리소스 로드 함수를 호출합니다.
 */
function preload() {
    console.log("preload() 시작: 리소스 로드 중...");
    preloadStart();
    preloadIntro(); // intro.js의 preload 함수 호출 (폰트 로드)
    preloadBadEndings();
    loadCharacterImages();
    loadSystemPrompt();
    preloadNote();
    preloadKeywordBriefing();
    preloadEndingSequence();
    detectiveNoteIcon = loadImage("assets/button.png"); 
    noteNotificationIcon = loadImage("assets/notiButton.png");
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
       // 초기 클래스 설정
    detectiveNoteP5Button.addClass('note-button-normal');
    // 초기 알림 상태를 기반으로 외형 업데이트 (초기에는 false일 가능성이 높음)
    updateDetectiveNoteButtonAppearance();
    setupNote();

     // 인트로 시작 시 0번 장면의 대화를 로드합니다.
    //lines = getSceneLines(scene);
    
    // 도움말 UI 셋업
    createHelpButton();

    console.log("setup() 완료");
}


// draw() 함수: P5.js 스케치가 매 프레임마다 반복적으로 실행됩니다.
// 게임 요소 그리기 및 연속적인 업데이트를 처리합니다.
function draw() {
    // CSS로 설정된 배경 이미지가 보이도록 매 프레임 캔버스를 투명하게 지웁니다.
    clear(); 
    if (gameState === "start") {
    hideMainUI();
    drawStartScreen(); // ✅ start.js에서 정의된 시작 화면 그리기 함수
    return;
}

    // 배드엔딩 유형에 따라 해당 이미지를 표시하고 그리기를 종료합니다.
    if (badEndingType) {
        hideMainUI();
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
    }else if (gameState === "keywordBriefing"){
        hideMainUI();
        drawKeywordBriefing();
        return;
    } 
    else { // gameState === "main"
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
        
        // 메인 게임 상태일 때 알림 그리기
        drawNoteNotification(); // 새로 추가할 함수 호출
    }

        if (!isClosed) {
        drawNote();
    }
}

/**
 * mousePressed() 함수: 마우스 버튼이 클릭될 때 P5.js에 의해 자동으로 호출됩니다.
 * 게임 상태에 따라 다른 마우스 이벤트를 처리합니다.
 */
function mousePressed() {

    if (gameState === "start") {
        const shouldGoToIntro = handleStartScreenClick();
        if (shouldGoToIntro) {
            gameState = "intro";
            console.log("게임 상태가 'intro'로 전환되었습니다.");
        }
        return;
    }
    if (gameState === "intro") {
        // 인트로 화면의 마우스 클릭은 intro.js에서 직접 처리하고,
        // 게임 상태 전환이 필요한지 여부만 반환받습니다.
        const shouldTransition = handleIntroScreenClick(); // intro.js의 함수 호출
        if (shouldTransition) {
            if (gameState === "intro"){
                gameState = "main"; // 메인 게임으로 전환
                showMainUI();
                console.log("게임 상태가 'main'으로 전환되었습니다.");
            }
        }
        return;
    }
    else if (gameState === "keywordBriefing")
    {
        let trns = handleKeywordBriefingClick();
        if (trns) {
            gameState = "main"; //메인 게임으로 전환
            // 키워드 해금 뒤 다음 장면 전환
            showMainUI();
            currentSceneIndex = (currentSceneIndex + 1) % backgroundImages.length; //다음 배경으로
            console.log(`게임 상태 'main'으로 복귀. 배경 전환: ${currentSceneIndex}`);

        // 키워드 브리핑 완료 후, 탐정 노트 알림 활성화
            if (keyWordReveal > 0) { // 최소한 하나의 키워드가 해금된 경우
                newKeywordUnlockedNotification = true; 
                //showNoteNotification = true;
                noteNotificationText = `새로운 키워드 [키워드 #${keyWordReveal}]가 탐정 노트에 해금되었습니다!`;
                console.log("탐정 노트 알림 활성화:", noteNotificationText);
            }
        }
    }
    
    // 알림이 표시되어 있을 때 알림 클릭 처리
    if (gameState === "main" && showNoteNotification) {
        // 알림 영역을 클릭했는지 확인 (대략적인 위치로 설정)
        let notifX = width / 2 - 200;
        let notifY = height / 2 - 50;
        let notifW = 400;
        let notifH = 100;
        if (mouseX > notifX && mouseX < notifX + notifW &&
            mouseY > notifY && mouseY < notifY + notifH) {
            showNoteNotification = false; // 알림 닫기
            console.log("탐정 노트 알림 닫힘.");
            return; // 알림을 닫았으므로 다른 mousePressed 로직은 실행하지 않음
        }
    }
        // 키워드 브리핑 대기 중일 때, 클릭 시 브리핑으로 전환
        // 이 조건은 알림 닫기 로직 다음에 와야 합니다.
        if (keywordBriefingPending) {
           

            // 현재는 화면 아무 곳이나 클릭해도 브리핑으로 넘어갑니다.
            console.log("브리핑 대기 중: 클릭 감지. 키워드 브리핑 모드로 전환.");
            gameState = "keywordBriefing"; // 키워드 브리핑 모드로 전환
            keywordBriefingPending = false; // 대기 상태 해제
            //hideMainUI();

            // 브리핑 화면 타이핑 효과를 위한 변수 초기화
            displayedText = ""; 
            charIndex = 0;
            lineIndex = 0;
            nextCharTime = millis(); // 즉시 타이핑 시작
            typingSpeed = 30; // 브리핑 타이핑 속도 (intro.js에서 사용)
            setDialogueText('','');
            return; // 브리핑으로 전환했으므로 다른 mousePressed 로직은 실행하지 않음
        }

        // 노트가 닫혀있지 않은 경우 (즉, 열려있는 경우)에만 노트 내부 클릭을 처리합니다.
        if (!isClosed) {
            mousePressedNote(); // detective-note.js에 정의됨
            return; // 노트가 열려있을 때는 다른 메인 UI 클릭을 처리하지 않음
        }
        handleHelpMousePressed();
    }

// 탐정 노트 알림을 그리는 함수
function drawNoteNotification() {
    if (showNoteNotification) {
        // 알림 패널 위치 및 크기 설정
        let notifX = width / 2 - 200;
        let notifY = height / 2 - 50;
        let notifW = 400;
        let notifH = 100;

        // 알림 배경 (반투명 검은색)
        fill(0, 0, 0, 200);
        rect(notifX, notifY, notifW, notifH, 10); // 둥근 모서리

        // 알림 텍스트
        fill(255); // 흰색
        textSize(18);
        textAlign(CENTER, CENTER);
        text(noteNotificationText, notifX + notifW / 2, notifY + notifH / 2);

        // 닫기 안내 문구
        textSize(14);
        fill(150); // 회색
        textAlign(CENTER, BOTTOM);
        text("(클릭하여 닫기)", notifX + notifW / 2, notifY + notifH - 10);
    }
}

/**
 * 메인 게임 UI를 숨기는 함수입니다.
 */
// sketch.js (확인해주세요)

function hideMainUI() {
    select('#score-display-container')?.style('display', 'none');
    const inputArea = select('#input-area');
    if (inputArea) {
        inputArea.style('display', 'none'); 
        // ✅ 이 부분이 input disabled 처리
        select('#player-input')?.attribute('disabled', true); 
        select('#send-button')?.attribute('disabled', true); 
    }
    if (detectiveNoteP5Button) { 
        detectiveNoteP5Button.hide(); 
    }
}

function showMainUI() {
    select('#score-display-container')?.style('display', 'flex');
    const inputArea = select('#input-area');
    if (inputArea) {
        inputArea.style('display', 'flex');
        // ✅ 이 부분이 input 활성화 처리
        select('#player-input')?.removeAttribute('disabled'); 
        select('#send-button')?.removeAttribute('disabled'); 
    }
    if (detectiveNoteP5Button) { 
        detectiveNoteP5Button.show(); 
    }
}
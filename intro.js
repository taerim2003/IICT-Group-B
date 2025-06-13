// intro.js

let scene = 0; // 인트로 장면 상태 (0: 초기 대화, 1: 게임 시작 대화)
let lines = []; // 현재 장면에 해당하는 대화 텍스트 배열
let displayedText = ""; // 현재 화면에 타이핑되어 표시될 텍스트
let charIndex = 0; // 현재 줄에서 타이핑될 글자 인덱스
let lineIndex = 0; // 현재 타이핑 중인 대화 줄 인덱스
let nextCharTime = 0; // 다음 글자가 표시될 시간
let typingSpeed = 30; // 글자 타이핑 속도 (밀리초)
let button; // 버튼의 위치, 크기, 라벨 정보를 담는 객체 (P5.Element 아님)
let customFont; // 커스텀 폰트

function preloadIntro() {
    customFont = loadFont("Bold.ttf"); // 폰트 로드
}

function setupIntro() {
    // 폰트 설정은 drawIntro()에서도 반복되므로 여기서는 생략 가능하지만,
    // 초기 텍스트 측정 등을 위해 설정해두는 것은 나쁘지 않습니다.
    textFont(customFont);
    textSize(20);
    fill(255);
    
    // 초기 장면의 대화 내용 설정
    lines = getSceneLines(scene);
    
    // 버튼 객체 초기 설정
    setupButton(); 
    
    console.log("setupIntro() 완료.");
}

function drawIntro() {
    background(0); // 배경을 검은색으로 채움

    textAlign(CENTER, TOP); // 가로 중앙 정렬, 상단에 텍스트 시작
    textWrap(WORD); // 단어 단위로 줄바꿈
    textSize(20);
    textFont(customFont);
    fill(255); // 텍스트 색상 흰색

    // 텍스트 블록의 높이 계산 및 중앙 정렬
    let linesCount = displayedText.split('\n').length;
    let lineHeight = 30; // 줄 간격
    let totalHeight = linesCount * lineHeight;
    let yStart = (height - totalHeight) / 2; // 텍스트 블록의 y 시작 지점

    let boxWidth = width * 0.8; // 텍스트 박스 너비
    let boxX = width / 2 - boxWidth / 2; // 텍스트 박스 x 시작 지점
    text(displayedText, boxX, yStart, boxWidth); // 텍스트 그리기

    // 버튼 그리기 로직 (drawButton 함수 호출)
    drawButton();

    // 타이핑 효과 로직
    // 현재 시간이 다음 글자 표시 시간보다 크고, 아직 모든 대화 줄이 표시되지 않았다면
    if (millis() > nextCharTime && lineIndex < lines.length) {
        // 현재 줄의 모든 글자가 표시되지 않았다면
        if (charIndex < lines[lineIndex].length) {
            displayedText += lines[lineIndex][charIndex]; // 다음 글자 추가
            charIndex++;
        } else {
            // 현재 줄의 글자가 모두 표시되었으면, 새 줄로 넘어가기
            // 단, 마지막 줄인 경우 줄바꿈을 추가하지 않습니다.
            // (마지막 줄 이후에는 버튼이 나타날 것이기 때문)
            if (lineIndex < lines.length - 1) { 
                displayedText += "\n";
            }
            lineIndex++; // 다음 줄로 이동
            charIndex = 0; // 글자 인덱스 초기화
        }
        nextCharTime = millis() + typingSpeed; // 다음 글자 표시 시간 설정
    }
}

// 버튼 객체의 초기 위치 및 크기 설정
function setupButton() {
    // drawButton에서 실제 P5.js 그래픽으로 그려질 위치와 크기를 정의합니다.
    // 여기서의 button 객체는 단순히 클릭 판정 및 라벨 저장용입니다.
    button = {
        x: 0, // 실제 drawButton에서 계산될 것임
        y: 0, // 실제 drawButton에서 계산될 것임
        width: 100,
        height: 40,
        label: "수사 시작" // 초기 라벨
    };
}

// P5.js 캔버스에 버튼을 그리는 함수
function drawButton() {
    // 모든 대화 줄이 표시되었을 때만 버튼을 그립니다.
    if (lineIndex >= lines.length) {
        fill(50); // 버튼 배경색
        let btnW = 200; // 버튼 너비
        let btnH = 60; // 버튼 높이
        let btnX = width / 2 - btnW / 2; // 버튼 x 좌표 (중앙 정렬)
        let btnY = height - 120; // 버튼 y 좌표

        rect(btnX, btnY, btnW, btnH, 10); // 둥근 사각형 버튼 그리기

        fill(255); // 버튼 텍스트 색상
        textSize(24); // 버튼 텍스트 크기
        textAlign(CENTER, CENTER); // 버튼 텍스트 중앙 정렬
        
        let label = (scene === 0) ? "수사 시작" : "게임 시작"; // 장면에 따른 라벨 변경
        text(label, width / 2, btnY + btnH / 2); // 버튼 텍스트 그리기

        // **중요: 클릭 판정을 위해 button 객체의 속성을 업데이트합니다.**
        button.x = btnX;
        button.y = btnY;
        button.width = btnW;
        button.height = btnH;
        button.label = label; // 라벨도 업데이트
    }
}

// 장면 전환 함수
function changeScene(newScene) {
    scene = newScene;
    lines = getSceneLines(scene); // 새 장면의 대화 내용 로드
    displayedText = ""; // 표시된 텍스트 초기화
    charIndex = 0; // 글자 인덱스 초기화
    lineIndex = 0; // 줄 인덱스 초기화
    nextCharTime = 0; // 타이핑 시간 초기화
    console.log(`인트로 장면 전환: ${scene}. 대화 수: ${lines.length}`);
}

// 장면별 대화 내용을 반환하는 함수
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
            "", // 빈 줄도 대화의 일부로 포함
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
    return []; // 해당 장면이 없을 경우 빈 배열 반환
}

/**
 * 인트로 화면의 마우스 클릭 이벤트를 처리합니다.
 * 이 함수는 P5.js의 mousePressed()에서 호출됩니다.
 * @returns {boolean} 게임 상태를 "main"으로 전환해야 할 경우 true, 아니면 false
 */
function handleIntroScreenClick() {
    // 타이핑 효과가 아직 진행 중일 경우, 클릭하면 모든 텍스트를 즉시 표시
    if (lineIndex < lines.length) {
        displayedText = lines.slice(0, lineIndex).join("\n"); // 이미 표시된 줄 + 현재 줄의 모든 텍스트
        displayedText += lines[lineIndex].substring(0, charIndex); // 현재 줄의 이미 표시된 텍스트
        
        // 현재 줄의 남은 텍스트 추가
        displayedText += lines[lineIndex].substring(charIndex, lines[lineIndex].length);
        
        // 남아있는 줄도 모두 추가
        for (let i = lineIndex + 1; i < lines.length; i++) {
            displayedText += "\n" + lines[i];
        }

        lineIndex = lines.length; // 모든 줄이 표시된 것으로 간주
        charIndex = 0; // charIndex 초기화 (더 이상 타이핑할 글자 없음)
        nextCharTime = 0; // 타이핑 타이머 비활성화
        // console.log("인트로 대화 즉시 완료됨.");
        return false; // 아직 인트로 진행 중 (버튼을 클릭해야 전환)
    }

    // 모든 대화가 표시되었고 (lineIndex >= lines.length), 버튼이 활성화된 상태에서 클릭되었을 때
    // 마우스 좌표가 버튼 영역 내에 있는지 확인
    if (
        mouseX > button.x && mouseX < button.x + button.width &&
        mouseY > button.y && mouseY < button.y + button.height
    ) {
        if (scene === 0) {
            // '수사 시작' 버튼 클릭 -> 장면 1로 전환
            changeScene(1);
            console.log("인트로 장면 0 -> 1 전환 (수사 시작)");
            return false; // 여전히 인트로 진행 중 (두 번째 인트로 장면)
        } else if (scene === 1) {
            // '게임 시작' 버튼 클릭 -> 메인 게임으로 전환
            console.log("인트로 완료: 메인 게임으로 전환 요청 (게임 시작)");
            return true; // 이제 메인 게임으로 전환해야 함을 알림
        }
    }
    return false; // 아무것도 발생하지 않았거나, 버튼 클릭이 아닌 다른 영역 클릭
}
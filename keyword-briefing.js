// keyword-briefing.js

let keywordBriefingIndex = 0; // 0: 키워드1, 1: 키워드2, 2: 키워드3
let keywordBriefingLines = [];
let keywordBriefingDisplayed = "";
let keywordBriefingCharIndex = 0;
let keywordBriefingLineIndex = 0;
let keywordBriefingNextCharTime = 0;
let keywordBriefingTypingSpeed = 30;
let keywordBriefingFont;

function preloadKeywordBriefing() {
    keywordBriefingFont = loadFont("Bold.ttf"); // 폰트 경로 맞게 수정
}

function setupKeywordBriefing(idx) {
    keywordBriefingIndex = idx;
    keywordBriefingLines = getKeywordBriefingLines(idx);
    keywordBriefingDisplayed = "";
    keywordBriefingCharIndex = 0;
    keywordBriefingLineIndex = 0;
    keywordBriefingNextCharTime = 0;
}


function drawKeywordBriefing() {
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


// 키워드별 브리핑 텍스트 반환
function getKeywordBriefingLines(idx) {
    if (idx === 0) {
        return ["다음날 남지연씨를 근처 카페에서 만났다."];
    } else if (idx === 1) {
        return ["사건의 가장 핵심을 밝혀내기 위해 남지연씨를 데리고 장이섬에 갔다."];
    } else if (idx === 2) {
        return [
            "그러면 지금까지의 이야기를 종합해보면 다음과 같다.",
            "",
            "촉법 범죄로 딸을 잃은 고유미는 교사로 잠입해 <잔화 프로토콜> 프로젝트에 참여했지만, 실상은 교화를 부정하고 죽은 딸에 대한 트라우마와 분노로 인해, 학생들을 사고로 위장해 제거하려는 척결극을 위한 계획이었다.",
            "",
            "결국 수학여행 날 인적이 드문 산 속 창고에 ‘장기자랑’을 명분으로 모두를 가두고 자신까지 한번에 죽는 방화 살인을 저질렀다.",
            "",
            "다만 남지연은 살기를 바라는 마음에 따로 빼돌렸다…"
        ];
    }
    return [];
}

// 클릭 시 전체 출력 또는 다음 씬 전환
function handleKeywordBriefingClick() {
    if (lineIndex < lines.length)
    {
        // 아직 출력이 덜 된 상태 → 전체 출력
        displayedText = lines.join("\n");
        lineIndex = lines.length;      // 전부 출력되었다고 표시
        charIndex = 0;                 // 더 이상 글자 출력 없음
        return false;
    }

    // 모두 출력된 후 → 다음 씬 전환 허용
    return true;
}

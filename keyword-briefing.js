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
    background(0);
    textFont(keywordBriefingFont);
    textSize(24);
    fill(255);
    textAlign(CENTER, TOP);

    // 텍스트 중앙 정렬
    let linesCount = keywordBriefingDisplayed.split('\n').length;
    let lineHeight = 36;
    let totalHeight = linesCount * lineHeight;
    let yStart = (height - totalHeight) / 2;

    text(keywordBriefingDisplayed, width / 2, yStart);

    // 타이핑 효과
    if (millis() > keywordBriefingNextCharTime && keywordBriefingLineIndex < keywordBriefingLines.length) {
        if (keywordBriefingCharIndex < keywordBriefingLines[keywordBriefingLineIndex].length) {
            keywordBriefingDisplayed += keywordBriefingLines[keywordBriefingLineIndex][keywordBriefingCharIndex];
            keywordBriefingCharIndex++;
        } else {
            if (keywordBriefingLineIndex < keywordBriefingLines.length - 1) {
                keywordBriefingDisplayed += "\n";
            }
            keywordBriefingLineIndex++;
            keywordBriefingCharIndex = 0;
        }
        keywordBriefingNextCharTime = millis() + keywordBriefingTypingSpeed;
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
    if (keywordBriefingLineIndex < keywordBriefingLines.length) {
        // 타이핑 중이면 즉시 전체 출력
        keywordBriefingDisplayed = keywordBriefingLines.join("\n");
        keywordBriefingLineIndex = keywordBriefingLines.length;
        keywordBriefingCharIndex = 0;
        return false;
    }
    // 모두 출력된 후 클릭 시 메인 게임으로 전환
    return true;
}

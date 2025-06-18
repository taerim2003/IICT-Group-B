let scene = 0;
let Introlines = [];
let displayedText = "";
let charIndex = 0;
let lineIndex = 0;
let nextCharTime = 0;
let typingSpeed = 40;
let button;
let customFont;

function preloadIntro() {
    customFont = loadFont("Bold.ttf");
}

function setupIntro() {
    textFont(customFont);
    textSize(20);
    fill(255);

    Introlines = getSceneLines(scene);
    setupButton();
    console.log("setupIntro() 완료.");
}

function drawIntro() {
    background(0);

    textAlign(CENTER, TOP);
    textWrap(WORD);
    textSize(20);
    textFont(customFont);
    fill(255);

    let linesCount = displayedText.split('\n').length;
    let lineHeight = 30;
    let totalHeight = linesCount * lineHeight;
    let yStart = (height - totalHeight) / 2;
    let boxWidth = width * 0.8;
    let boxX = width / 2 - boxWidth / 2;
    text(displayedText, boxX, yStart, boxWidth);

    drawButton();

    if (millis() > nextCharTime && lineIndex < Introlines.length) {
        if (charIndex < Introlines[lineIndex].length) {
            displayedText += Introlines[lineIndex][charIndex];
            charIndex++;
        } else {
            if (lineIndex < Introlines.length - 1) {
                displayedText += "\n";
            }
            lineIndex++;
            charIndex = 0;
        }
        nextCharTime = millis() + typingSpeed;
    }
}

function setupButton() {
    button = {
        x: 0,
        y: 0,
        width: 200,
        height: 60,
        label: "수사 시작"
    };
}

function drawButton() {
    if (lineIndex >= Introlines.length) {
        fill(50);
        let btnW = 200;
        let btnH = 60;
        let btnX = width / 2 - btnW / 2;
        let btnY = height - 120;
        rect(btnX, btnY, btnW, btnH, 10);

        fill(255);
        textSize(24);
        textAlign(CENTER, CENTER);

        let label = (scene === 0) ? "다음" : (scene === 1) ? "다음" : "게임 시작";
        text(label, width / 2, btnY + btnH / 2);

        button.x = btnX;
        button.y = btnY;
        button.width = btnW;
        button.height = btnH;
        button.label = label;
    }
}

function changeScene(newScene) {
    scene = newScene;
    Introlines = getSceneLines(scene);
    displayedText = "";
    charIndex = 0;
    lineIndex = 0;
    nextCharTime = 0;
    console.log(`인트로 장면 전환: ${scene}. 대화 수: ${Introlines.length}`);
}

function getSceneLines(scene) {
    if (scene === 0) {
        return [
            "Q봇: 수사관님, 요청하신 <장이섬 수학여행 화재 사건> 브리핑 파일 가져왔습니다."
        ];
    } else if (scene === 1) {
        return [
            "Case Name: 장이섬 수학여행 화재 사건",
            "",
            "Who: 엠버 아카데미 학생 12명(개인정보 비공개), 교장, 교사 1명",
            "When: 2100년 5월 24일 18시경",
            "Where: 장이섬",
            "What: 밖에서 잠긴 건물에 화재 사고가 일어나 학생 12명, 교장, 교사 1명을 포함한 학급 전체가 단체로 사망하였다.",
            "멀리서 건물에 연기가 나는 것을 목격한 교사 남지연이 유일한 생존자이자 신고자이다.",
            "Why: 화재 사고(?) → Unknown",
            "",
            "!고의로 계획된 방화 단체 살인일 수 있다는 가능성!"
        ];
    } else if (scene === 2) {
        return [
            "당신은 해당 사건을 조사하는 수사관으로, 유일한 생존자인 교사 남지연을 심문하여 사고인지 살인인지 밝혀주십시오.",
            "",
            "목표",
            "긴장도 친밀도 조절: 당신이 나누는 대화 내용, 말투의 온도까지 모두 민감하게 반영됩니다. 협박과 회유를 적절히 섞어 긴장도와 친밀도 모두 수치를 80이상으로 끌어올려야 합니다. 밸런스를 어기고 한쪽만 먼저 100 이상의 수치를 찍을 경우.. 심문 종결입니다.",
            "",
            "사건 수첩을 통한 키워드 해금: 긴장도와 친밀도가 모두 80의 수치에 도달할 때 남지연은 중요한 정보를 말해줄 지도 모릅니다. 수사관님을 위해 이를 사건 수첩에 키워드 형태로 정리해놓겠습니다. 꼭 확인하여 주십시오. 키워드 3개를 모으면 두뇌가 명석하신 수사관님은 사건의 전말을 알아내실 수 있을지도 모르겠군요."
        ];
    }
    return [];
}

function handleIntroScreenClick() {
    if (lineIndex < Introlines.length) {
        displayedText = Introlines.slice(0, lineIndex).join("\n");
        displayedText += Introlines[lineIndex].substring(0, charIndex);
        displayedText += Introlines[lineIndex].substring(charIndex, Introlines[lineIndex].length);
        for (let i = lineIndex + 1; i < Introlines.length; i++) {
            displayedText += "\n" + Introlines[i];
        }
        lineIndex = Introlines.length;
        charIndex = 0;
        nextCharTime = 0;
        return false;
    }

    if (
        mouseX > button.x && mouseX < button.x + button.width &&
        mouseY > button.y && mouseY < button.y + button.height
    ) {
        if (scene === 0) {
            changeScene(1);
            return false;
        } else if (scene === 1) {
            changeScene(2);
            return false;
        } else if (scene === 2) {
            return true;
        }
    }
    return false;
}
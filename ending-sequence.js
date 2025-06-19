// ending-sequence.js

let endingSequence = [
    { type: "image", src: "assets/namjiyeon.jpeg" },
    { type: "text", text: "그런데요 수사관님," },
    { type: "image", src: "assets/transition1.png" },
    { type: "image", src: "assets/transition2.png" },
    { type: "image", src: "assets/transition3.png" },
    { type: "image", src: "assets/transition4.png" },
    { type: "text", text: "그리고 장이섬에는.." },
    { type: "image", src: "assets/namjiyeon_redeyes.png" },
    { type: "text", text: "아무도 없었거든요." },
    { type: "text", text: "끝" }
];

let endingImages = [];
let endingStep = 0;
let endingTextDisplayed = "";
let endingCharIndex = 0;
let endingNextCharTime = 0;
let endingTypingSpeed = 30;
let endingFont;
let endingActive = false;

function preloadEndingSequence() {
    endingFont = loadFont("Bold.ttf");
    // 이미지 미리 로드
    for (let item of endingSequence) {
        if (item.type === "image") {
            endingImages[item.src] = loadImage(item.src);
        }
    }
}

function setupEndingSequence() {
    endingStep = 0;
    endingTextDisplayed = "";
    endingCharIndex = 0;
    endingNextCharTime = 0;
    endingActive = true;
}

function drawEndingSequence() {
    background(0);
    textFont(endingFont);
    textSize(32);
    fill(255);
    textAlign(CENTER, CENTER);

    let item = endingSequence[endingStep];
    if (!item) return;

    if (item.type === "image") {
        let img = endingImages[item.src];
        if (img) {
            let imgW = width * 0.7;
            let imgH = img.height * (imgW / img.width);
            image(img, width/2 - imgW/2, height/2 - imgH/2, imgW, imgH);
        } else {
            fill(255,0,0);
            text("이미지 로드 실패: " + item.src, width/2, height/2);
        }
    } else if (item.type === "text") {
        // 타이핑 효과
        if (endingCharIndex < item.text.length && millis() > endingNextCharTime) {
            endingTextDisplayed += item.text[endingCharIndex];
            endingCharIndex++;
            endingNextCharTime = millis() + endingTypingSpeed;
        }
        text(endingTextDisplayed, width/2, height/2);
    }
}

function handleEndingSequenceClick() {
    let item = endingSequence[endingStep];
    if (!item) return;

    if (item.type === "text" && endingCharIndex < item.text.length) {
        // 타이핑 중이면 즉시 전체 출력
        endingTextDisplayed = item.text;
        endingCharIndex = item.text.length;
        return;
    }
    // 다음 단계로
    endingStep++;
    if (endingStep >= endingSequence.length) {
        endingActive = false;
        // 엔딩 종료 후 원하는 상태로 전환 (예: 게임 재시작, 엔딩 화면 등)
        // gameState = "start";
        return;
    }
    // 다음 텍스트 준비
    if (endingSequence[endingStep].type === "text") {
        endingTextDisplayed = "";
        endingCharIndex = 0;
        endingNextCharTime = 0;
    }
}

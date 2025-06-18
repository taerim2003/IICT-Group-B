// start.js

let startScreenImage;

function preloadStart() {
    startScreenImage = loadImage('assets/title.png'); // 시작 화면 이미지 경로
}

function drawStartScreen() {
    if (startScreenImage) {
        image(startScreenImage, 0, 0, width, height);
    } else {
        background(0);
        fill(255, 0, 0);
        text("이미지가 없습니다.", width/2, height/2);
    }
}

function handleStartScreenClick() {
    // 화면 어디든 클릭하면 true 반환
    return true;
}


let currentPage = "사건 개요";
let bgImage;
let namjiyeonImage;
let sageonImage;
let contentImages = {};
let contentText = {
  "키워드 #1": "잔화 프로토콜",
  "키워드 #2": "딸",
  "키워드 #3": "문호 대학교"
};
let isClosed = true;

let buttons = [];

function preloadNote() {
  bgImage = loadImage("assets/note.jpg");
  namjiyeonImage = loadImage("assets/namjiyeon.png");
  sageonImage = loadImage("assets/sageon.png"); // 사건 개요 이미지

  // 텍스트 대신 이미지로 대체할 항목들
  contentImages = {
    "사건 개요": sageonImage,
    "남지연 프로필": namjiyeonImage
  };
}

function setupNote() {
  textFont('monospace');

  buttons.push(new Button("사건 개요", 80, 135, () => { currentPage = "사건 개요"; isClosed = false; }));
  buttons.push(new Button("남지연 프로필", 80, 225, () => { currentPage = "남지연 프로필"; isClosed = false; }));
  buttons.push(new Button("키워드 #1", 80, 305, () => { currentPage = "키워드 #1"; isClosed = false; }));
  buttons.push(new Button("키워드 #2", 80, 395, () => { currentPage = "키워드 #2"; isClosed = false; }));
  buttons.push(new Button("키워드 #3", 80, 480, () => { currentPage = "키워드 #3"; isClosed = false; }));
  buttons.push(new Button("닫기", 1170, 60, () => { isClosed = true; }));  // 닫기 버튼
}

function drawNote() {
  if (isClosed) {
    // 닫기 눌린 경우: 화면 비움
    return;
  }

  // 사건 개요 / 남지연 프로필은 전용 이미지로 전체 배경 대체
  if (contentImages[currentPage]) {
    image(contentImages[currentPage], 0, 0, width, height);
  } else {
    // 나머지 키워드는 기본 배경 note.jpg
    image(bgImage, 0, 0, width, height);

    // 텍스트 출력
    fill(255);
    textSize(24);
    textAlign(LEFT, TOP);
    let txt = contentText[currentPage] || "내용 없음";
    text(txt, 330, 200, width - 320, height - 120);
  }

  // 버튼 표시 (항상)
  for (let btn of buttons) {
    btn.display();
  }
}


function mousePressedNote() {
  for (let btn of buttons) {
    if (btn.isMouseInside()) {
      btn.onClick();
    }
  }
}

// 임시 탐정노트 버튼 코드 noteButton(), noteButtonPressed()
function noteButton()
{
    noteBtn = createButton('임시 탐정노트 버튼');
    noteBtn.position(10, 50);
    noteBtn.mousePressed(noteButtonPressed)
}

function noteButtonPressed()
{
    isClosed = !isClosed;
    console.log(isClosed);
}

class Button {
  constructor(label, x, y, onClick) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.w = 200;
    this.h = 50;
    this.onClick = onClick;
  }

  display() {
    noStroke();
    noFill();
    // rect(this.x, this.y, this.w, this.h); // 디버깅용 클릭 영역
    fill(255,0); // 텍스트도 투명
    textSize(20);
    textAlign(CENTER, CENTER);
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);
  }

  isMouseInside() {
    return mouseX > this.x && mouseX < this.x + this.w &&
           mouseY > this.y && mouseY < this.y + this.h;
  }
}

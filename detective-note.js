let keywordUnlocked = {
  "키워드 #1": false,
  "키워드 #2": false,
  "키워드 #3": false
};
let keyword1Image, keyword1undefinedImage;
let keyword2Image, keyword2undefinedImage;
let keyword3Image, keyword3undefinedImage;

function preloadNote() {
  bgImage = loadImage("assets/note.jpg");
  namjiyeonImage = loadImage("assets/namjiyeon.png");
  sageonImage = loadImage("assets/sageon.png"); 
  keyword1Image=loadImage("assets/keyword1.png");
  keyword1undefinedImage=loadImage("assets/keyword1Undefined.png");
  keyword2Image=loadImage("assets/keyword2.png");
  keyword2undefinedImage=loadImage("assets/keyword2Undefined.png");
  keyword3Image=loadImage("assets/keyword3.png");
  keyword3undefinedImage=loadImage("assets/keyword3Undefined.png");

  // 텍스트 대신 이미지로 대체할 항목들
  contentImages = {
    "사건 개요": sageonImage,
    "남지연 프로필": namjiyeonImage
  };
}

function setupNote() {
  
  textFont('monospace');


  buttons.push(new Button("사건 개요", 60, 120, () => { currentPage = "사건 개요"; isClosed = false; }));
  buttons.push(new Button("남지연 프로필", 60, 180, () => { currentPage = "남지연 프로필"; isClosed = false; }));
  buttons.push(new Button("키워드 #1", 60, 280, () => { currentPage = "키워드 #1"; isClosed = false; }));
  buttons.push(new Button("키워드 #2", 60, 350, () => { currentPage = "키워드 #2"; isClosed = false; }));
  buttons.push(new Button("키워드 #3", 60, 420, () => { currentPage = "키워드 #3"; isClosed = false; }));
  buttons.push(new Button("닫기", 1170, 60, () => { toggleNote(); }));  // 닫기 버튼

}

// 메인 "탐정 노트" 버튼을 생성합니다.
// sketch.js의 setup() 함수에서 호출됩니다.
function noteButton() {
  let noteBtn = createButton('탐정 노트'); 
  noteBtn.id('note-button');
  noteBtn.position(10, 50); // ⭐ 좌측 상단 (10, 50) 위치로 재설정
  noteBtn.mousePressed(toggleNote); // 노트 토글을 위한 클릭 핸들러 할당
  console.log("탐정 노트 버튼 생성 완료.");
}

// 탐정 노트의 가시성을 토글합니다.
// 캔버스 컨테이너와 점수 표시 컨테이너의 z-index를 관리합니다.

function toggleNote() {
  isClosed = !isClosed; // 닫힘 상태 토글
  console.log("탐정 노트 가시성 토글됨, isClosed:", isClosed);

  // p5CanvasContainer와 scoreDisplayContainerElement는 global-vars.js에 선언, sketch.js에서 할당됩니다.
  if (!p5CanvasContainer || !scoreDisplayContainerElement) {

    console.error("p5CanvasContainer 또는 scoreDisplayContainerElement가 초기화되지 않았습니다. z-index를 변경할 수 없습니다.");
    return;
  }

  // 입력창 컨테이너 선택 (id가 다르면 실제 id로 바꿔주세요)
  let inputContainer = select('#input-area'); // 혹은 select('#player-input').parent()
  if (!inputContainer) {
    console.warn("입력창 컨테이너(#input-container)를 찾을 수 없습니다.");
    return;
  }

  if (!isClosed) { // 노트가 열리는 경우
      // 캔버스 컨테이너(P5.js가 그리는 곳)의 z-index를 높게 설정하여 모든 HTML 요소 위에 오도록 합니다.
      p5CanvasContainer.style('z-index', '999'); 
      console.log("Canvas z-index set to 999 (Note open)");
      
      // 점수 표시 컨테이너의 z-index를 낮게 설정하여 노트 뒤로 숨깁니다.
      // 이것은 사라지는 것이 아니라, 노트 뒤에 가려져 보이게 하는 것입니다.
      scoreDisplayContainerElement.style('z-index', '0'); 
      console.log("Score Display z-index set to 0 (Note open)");

  } else { // 노트가 닫히는 경우
      // 캔버스 컨테이너의 z-index를 기본값으로 재설정합니다.
      p5CanvasContainer.style('z-index', '1'); 
      console.log("Canvas z-index set to 1 (Note closed)");

      // 점수 표시 컨테이너의 z-index를 원래 값으로 재설정합니다 (style.css에서 정의된 값).
      scoreDisplayContainerElement.style('z-index', '15'); 
      console.log("Score Display z-index set to 15 (Note closed)");
  }
}


function drawNote() {
  if (isClosed) {
    // 닫기 눌린 경우: 화면 비움
    return;
  }

  if (currentPage.startsWith("키워드")) {
    let imgToShow;
  
    if (currentPage === "키워드 #1") {
      imgToShow = keywordUnlocked["키워드 #1"] ? keyword1Image : keyword1undefinedImage;
    } else if (currentPage === "키워드 #2") {
      imgToShow = keywordUnlocked["키워드 #2"] ? keyword2Image : keyword2undefinedImage;
    } else if (currentPage === "키워드 #3") {
      imgToShow = keywordUnlocked["키워드 #3"] ? keyword3Image : keyword3undefinedImage; // 없는 경우 대체
    }
  
    image(imgToShow, 0, 0, width, height);
  }
  else if (contentImages[currentPage]) {
    image(contentImages[currentPage], 0, 0, width, height);
  }
  // 사건 개요 / 남지연 프로필은 전용 이미지로 전체 배경 대체
  
  else {
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
    this.w = 250;
    this.h = 80;
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

function unlockKeyword(keywordName) {
  keywordUnlocked[keywordName] = true;
}

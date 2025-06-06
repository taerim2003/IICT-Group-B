// 이 파일은 탐정 노트의 기능, UI 및 상태를 관리합니다.
// global-vars.js에 정의된 전역 변수와 상호 작용합니다.

// 노트 자산을 위한 P5.js preload 함수 훅입니다.
function preloadNote() {
    console.log("노트 리소스 로드 중...");
    // 이 변수들은 global-vars.js에 선언되어 있습니다.
    bgImage = loadImage("assets/note.jpg");
    namjiyeonImage = loadImage("assets/namjiyeon.png");
    sageonImage = loadImage("assets/sageon.png"); // 사건 개요 이미지

    // 콘텐츠 제목을 해당 이미지에 매핑합니다.
    contentImages = {
        "사건 개요": sageonImage,
        "남지연 프로필": namjiyeonImage
    };
}

// 탐정 노트의 버튼을 설정합니다.
// sketch.js의 setup() 함수에서 호출됩니다.
function setupNote() {
    textFont('monospace');

    // 노트 탐색을 위한 버튼을 생성합니다.
    buttons.push(new Button("사건 개요", 80, 135, () => { currentPage = "사건 개요"; isClosed = false; }));
    buttons.push(new Button("남지연 프로필", 80, 225, () => { currentPage = "남지연 프로필"; isClosed = false; }));
    buttons.push(new Button("키워드 #1", 80, 305, () => { currentPage = "키워드 #1"; isClosed = false; }));
    buttons.push(new Button("키워드 #2", 80, 395, () => { currentPage = "키워드 #2"; isClosed = false; }));
    buttons.push(new Button("키워드 #3", 80, 480, () => { currentPage = "키워드 #3"; isClosed = false; }));
    buttons.push(new Button("닫기", 1170, 60, () => { isClosed = true; })); // 닫기 버튼
    console.log("탐정 노트 셋업 완료.");
}

// 메인 "탐정 노트" 버튼을 생성합니다.
// sketch.js의 setup() 함수에서 호출됩니다.
function noteButton() {
    // noteBtn은 global-vars.js에 선언되어 있습니다.
    let noteBtn = createButton('탐정 노트'); 
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

// 노트 내용을 캔버스에 그립니다 (노트가 열려있을 경우).
// sketch.js의 draw() 함수에서 호출됩니다.
function drawNote() {
    if (isClosed) {
        return; // 닫혀있으면 아무것도 그리지 않습니다.
    }

    // 현재 페이지에 특정 콘텐츠 이미지가 있는 경우 전체 배경 이미지를 그립니다.
    if (contentImages[currentPage]) {
        image(contentImages[currentPage], 0, 0, width, height);
    } else {
        // 그렇지 않으면 기본 노트 배경 이미지를 그립니다.
        image(bgImage, 0, 0, width, height);

        // 키워드 페이지의 텍스트 콘텐츠를 그립니다.
        fill(255);
        textSize(24);
        textAlign(LEFT, TOP);
        let txt = contentText[currentPage] || "내용 없음"; // global-vars.js에서 텍스트 콘텐츠 가져옴
        text(txt, 330, 200, width - 320, height - 120);
    }

    // 모든 노트 탐색 버튼을 표시합니다.
    for (let btn of buttons) {
        btn.display();
    }
}

// 노트 버튼에 대한 마우스 클릭 이벤트를 처리합니다.
// sketch.js의 mousePressed() 함수에서 호출됩니다.
function mousePressedNote() {
    for (let btn of buttons) {
        if (btn.isMouseInside()) {
            btn.onClick();
        }
    }
}

// 탐정 노트 내 인터랙티브 요소를 위한 Button 클래스입니다.
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
        // rect(this.x, this.y, this.w, this.h); // 디버깅: 클릭 영역을 보려면 주석 해제
        fill(255,0); // 텍스트 색상 (초기 투명)
        textSize(20);
        textAlign(CENTER, CENTER);
        text(this.label, this.x + this.w / 2, this.y + this.h / 2);
    }

    isMouseInside() {
        return mouseX > this.x && mouseX < this.x + this.w &&
               mouseY > this.y && mouseY < this.y + this.h;
    }
}

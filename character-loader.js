// 이 파일은 캐릭터 이미지 로딩을 담당합니다.
// sketch.js의 preload() 함수에서 호출됩니다.

function loadCharacterImages() {
    console.log("캐릭터 및 배경 이미지 로드 중..."); 

    // 기본 캐릭터 이미지 로드
    characterImage = loadImage('assets/witness.png', 
        () => console.log("기본 캐릭터 이미지 (witness.png) 로드 성공!"),
        (event) => {
            console.error("기본 캐릭터 이미지 (witness.png) 로드 실패:", event);
            console.error("경로를 다시 확인해주세요: 'assets/witness.png'");
        }
    ); 
    // 긴장 캐릭터 이미지 로드
    tensionCharacterImage = loadImage('assets/anxious.png', 
        () => console.log("긴장 캐릭터 이미지 (anxious.png) 로드 성공!"),
        (event) => {
            console.error("긴장 캐릭터 이미지 (anxious.png) 로드 실패:", event); 
            console.error("경로를 다시 확인해주세요: 'assets/anxious.png'");
        }
    ); 
    // 친밀 캐릭터 이미지 로드
    happyCharacterImage = loadImage('assets/smile.png', 
        () => console.log("친밀 캐릭터 이미지 (smile.png) 로드 성공!"),
        (event) => {
            console.error("친밀 캐릭터 이미지 (smile.png) 로드 실패:", event);
            console.error("경로를 다시 확인해주세요: 'assets/smile.png'");
        }
    ); 

    // ⭐ 배경 이미지 로드 (장면별 이미지 다시 추가)
    // 이 파일명들을 팀원이 제공할 실제 이미지 파일명으로 교체해주세요.
    // 'assets/background_1.png'는 초기 배경입니다.
    backgroundImages[0] = loadImage('assets/background_1.png', 
        () => console.log("배경 이미지 1 로드 성공!"),
        (event) => { console.error("배경 이미지 1 로드 실패: 'assets/background_1.png'", event); });
    backgroundImages[1] = loadImage('assets/background_2.png', // 1번째 키워드 해금 후 배경
        () => console.log("배경 이미지 2 로드 성공!"),
        (event) => { console.error("배경 이미지 2 로드 실패: 'assets/background_2.jpg'", event); });
    backgroundImages[2] = loadImage('assets/background_3.png', // 2번째 키워드 해금 후 배경
        () => console.log("배경 이미지 3 로드 성공!"),
        (event) => { console.error("배경 이미지 3 로드 실패: 'assets/background_3.png'", event); });
    backgroundImages[3] = loadImage('assets/background_4.png', // 3번째 키워드 해금 후 배경
        () => console.log("배경 이미지 4 로드 성공!"),
        (event) => { console.error("배경 이미지 4 로드 실패: 'assets/background_4.jpg'", event); });

    catImage_idle = loadImage('assets/cat_idle.png', 
        () => console.log("고양이 idle 로드 성공!"),
        (event) => { console.error("고양이 idle 로드 실패: 'assets/cat_idle.png'", event); });
    catImage_smiling = loadImage('assets/cat_smiling.png', 
        () => console.log("고양이 smiling 로드 성공!"),
        (event) => { console.error("고양이 smiling 로드 실패: 'assets/cat_smiling.png'", event); });
        question_mark_image = loadImage('assets/question_mark.png', 
        () => console.log("물음표 로드 성공!"),
        (event) => { console.error("물음표 로드 실패: 'assets/question_mark.png'", event); });
}   

// 캔버스에 캐릭터 이미지를 그리는 함수입니다.
// sketch.js의 draw() 함수에서 호출됩니다.
function drawCharacter() {

    let currentCharacterImage;

    if (status == Status.TENSION) 
    { 
        currentCharacterImage = tensionCharacterImage; 
    } 
    else if (status == Status.AFFINITY) {
        currentCharacterImage = happyCharacterImage; 
    }
    else
    {
        currentCharacterImage = characterImage;
    }


    // 로드된 유효한 캐릭터 이미지가 있는 경우 그립니다.
    if (currentCharacterImage && currentCharacterImage.width > 0 && currentCharacterImage.height > 0) {
        imageMode(CENTER); 
        // 캔버스 크기에 비례하여 이미지 크기 및 위치를 조정합니다.
        image(currentCharacterImage, width * 0.5, height * 0.5, currentCharacterImage.width * 0.5, currentCharacterImage.height * 0.5);
        imageMode(CORNER); // 다른 P5.js 그리기 작업에 영향을 주지 않도록 기본값으로 되돌립니다.
    } else {
        // console.warn("캐릭터 이미지가 아직 로드되지 않았거나 유효하지 않습니다. 경로를 확인해주세요.");
    }
}

// 이 파일은 여러 P5.js 및 UI 스크립트에서 사용되는 모든 전역 변수를 선언합니다.
// 이 변수를 사용하는 다른 스크립트보다 먼저 index.html에서 로드되어야 합니다.

// 이 파일은 여러 P5.js 및 UI 스크립트에서 사용되는 모든 전역 변수를 선언합니다.
// 이 변수를 사용하는 다른 스크립트보다 먼저 index.html에서 로드되어야 합니다.

// 게임 컨테이너 크기
let gameContainerWidth = 1280; 
let gameContainerHeight = 720; 

// 캐릭터 이미지 변수 (character-loader.js에서 로드)
let characterImage;         // 기본 표정 (witness.png)
let tensionCharacterImage;  // 긴장 표정 (anxious.png)
let happyCharacterImage;    // 미소 표정 (smile.png)

// ⭐ 배경 이미지를 담을 배열 선언. 이 부분이 필수입니다.
let backgroundImages = [];
// ⭐ 현재 게임 장면의 인덱스 (0부터 시작, 키워드 해금에 따라 변경됩니다)
let currentSceneIndex = 0; 

// 게임 점수 (game-core.js 및 conversation-UI.js에서 업데이트)
const initTensionScore = 50;
const initAffinityScore = 50;
const scoreMax = 15;
const scoreMin = -8;
const difference = 20;
let tensionScore = initTensionScore; 
let affinityScore = initAffinityScore;

// 대답 스테이터스 목록
const Status = {
  IDLE: 'idle',       // 경계 태세
  TENSION: 'tension', // 긴장 태세
  AFFINITY: 'affinity', // 친밀 태세
  HELPFUL: 'helpful'  // 협조 태세
};

// 현재 스테이터스
let status = Status.IDLE;

// 대화 텍스트 (dialogue-manager.js에서 관리)
let currentSurvivorText = ''; // 현재 생존자의 답변
let currentPlayerText = '';   // 현재 플레이어의 질문

// 디버깅: 대화 기록 저장 버튼 (game-utilities.js에서 생성)
let saveBtn; 

// 탐정 노트 변수 (detective-note.js에서 관리)
let currentPage = "사건 개요";
let bgImage; // 노트 배경 이미지 (note.jpg)
let namjiyeonImage; // 남지연 프로필 이미지
let sageonImage; // 사건 개요 이미지
let contentImages = {}; // 노트 내용 (예: "사건 개요", "남지연 프로필")의 이미지를 저장
let contentText = { // 노트 내용의 텍스트
  "키워드 #1": "잔화 프로토콜",
  "키워드 #2": "딸",
  "키워드 #3": "문호 대학교"
};
let isClosed = true; // 탐정 노트 상태 (true = 닫힘, false = 열림)
let buttons = []; // 노트 버튼 인스턴스를 담을 배열

// 키워드 해금 상태 (conversation-UI.js에서 관리)
let keyWordReveal = 0;

// HTML 요소 참조 (sketch.js setup에서 할당)
let p5CanvasContainer; // P5.js 캔버스를 감싸는 HTML div 참조
let scoreDisplayContainerElement; // 긴장도/친밀도 점수 컨테이너 HTML div 참조
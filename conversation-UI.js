let playerInput; // HTML <input> 요소를 참조할 변수
let sendButton;  // HTML <button> 요소를 참조할 변수


// 수치 표시 HTML 요소들을 참조할 변수
let tensionValueDisplay; 
let affinityValueDisplay;

// 수치 바 및 컨테이너 참조 변수
let tensionBar; 
let affinityBar;
let tensionScoreDisplayContainer; 
let affinityScoreDisplayContainer; // 친밀도 수치 전체 div


// 이 함수는 sketch.js의 setup()에서 한 번만 호출되어 HTML UI 요소들을 초기화합니다.
function initializeUIElements() {
    console.log("initializeUIElements() 시작");
    playerInput = select('#player-input'); 
    sendButton = select('#send-button');   


    // 수치 표시 HTML 요소 참조
    tensionValueDisplay = select('#anxiety-value'); 
    console.log("tensionValueDisplay selected:", tensionValueDisplay); // 디버깅 로그
    affinityValueDisplay = select('#affinity-value');
    console.log("affinityValueDisplay selected:", affinityValueDisplay); // 디버깅 로그

    tensionBar = select('#anxiety-bar'); 
    affinityBar = select('#affinity-bar'); // 친밀도 바 요소 참조
    tensionScoreDisplayContainer = select('#anxiety-score-display'); 
    affinityScoreDisplayContainer = select('#affinity-score-display'); // 친밀도 수치 div 참조
    

    // 버튼 클릭 이벤트 리스너 활성화
    sendButton.mousePressed(handleUserInput);

    // 입력창에서 엔터 키 누르면 질문 전송 이벤트 리스너 활성화
    playerInput.elt.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });

    // 수치 표시 영역 마우스 오버/아웃 이벤트 리스너 추가
    // 마우스를 올리면 숫자 표시
    tensionScoreDisplayContainer.elt.addEventListener('mouseover', () => { 
        console.log("Mouseover tensionScoreDisplayContainer"); // 디버깅 로그
        showTensionScore(true); 
    });
    affinityScoreDisplayContainer.elt.addEventListener('mouseover', () => {
        console.log("Mouseover affinityScoreDisplayContainer"); // 디버깅 로그
        showAffinityScore(true);
    });
    // 마우스를 떼면 숫자 숨김
    tensionScoreDisplayContainer.elt.addEventListener('mouseout', () => { 
        console.log("Mouseout tensionScoreDisplayContainer"); // 디버깅 로그
        showTensionScore(false); 
    });
    affinityScoreDisplayContainer.elt.addEventListener('mouseout', () => {
        console.log("Mouseout affinityScoreDisplayContainer"); // 디버깅 로그
        showAffinityScore(false);
    });
    

    console.log("initializeUIElements() 완료");
}

// 플레이어 입력 처리 및 AI 응답 요청 함수
async function handleUserInput() {
    const userText = playerInput.value().trim(); 
    if (userText === '') return; 
    
    console.log("handleUserInput() 시작. 사용자 입력:", userText);

    // 1. 플레이어의 질문을 먼저 표시하고, 생존자의 이전 답변은 지웁니다.
    setDialogueText('', userText); 
    // 2. 입력창을 비웁니다.
    playerInput.value(''); 

    // AI 응답 요청 (gemini.js의 generateContent 함수 호출)
    const aiResponse = await generateContent(userText);
    console.log("AI 응답 받음:", aiResponse);
    
    // AI 응답이 오면, 플레이어의 질문은 유지하고 생존자의 답변을 업데이트합니다.
    setDialogueText(aiResponse, userText); 
    console.log("setDialogueText 호출 완료.");

    // TODO: 여기에 키워드 감지 및 게임 진행 로직 추가
    // AI 응답 내용에 따라 긴장도/친밀도 수치를 변경하는 로직을 추가해야 합니다.
    // 현재는 테스트를 위해 임의로 수치를 변경하게 했습니다!
    
    let newTension = tensionScore;
    let newAffinity = affinityScore; // sketch.js의 전역 변수 affinityScore 사용

    // 예시: 특정 키워드에 따라 수치 변경 시뮬레이션
    if (aiResponse.includes("무서워요") || userText.includes("거짓말")) {
        newTension += 20; // 긴장도 수치 증가
        newAffinity -= 5; // 친밀도 수치 감소
    } else if (aiResponse.includes("감사해요") || userText.includes("괜찮아요")) {
        newAffinity += 15; // 친밀도 수치 증가
        newTension -= 5; // 긴장도 수치 감소
    } else {
        // 아무 키워드도 없으면 기본적으로 변화 없음
        newAffinity += 0;
        newTension -= 0; 
    }

    // 수치 업데이트 함수 호출 (sketch.js에 정의된 함수)
    // 이 함수가 sketch.js의 전역 변수를 업데이트하고 HTML UI도 업데이트합니다.
    updateGameScores(newTension, newAffinity); 
    console.log("handleUserInput() 완료.");
}

// 수치 표시 HTML UI를 업데이트하는 함수 
// sketch.js의 updateGameScores 함수에서도 호출됩니다.
function updateScoreDisplays() {
    // console.log("updateScoreDisplays() 호출됨");

    // 수치 바의 너비를 업데이트 
    tensionBar.style('width', tensionScore + '%'); 
    affinityBar.style('width', affinityScore + '%');
    

    // 숫자가 보이는 상태일 때만 숫자 값 업데이트
    // showTensionScore/showAffinityScore 함수에서 이미 html() 업데이트를 처리하므로,
    // 이 부분은 숫자가 이미 보이는 상태에서만 값을 갱신하도록 유지합니다.
    if (tensionValueDisplay.elt.style.display === 'inline-block') {
        tensionValueDisplay.html(tensionScore); 
    }
    if (affinityValueDisplay.elt.style.display === 'inline-block') { // display 속성으로 직접 확인
        affinityValueDisplay.html(affinityScore); 
    }
    
}

// === 긴장도 수치 숫자 표시를 제어하는 함수 === 
function showTensionScore(show) { 
    console.log("showTensionScore called with:", show, "Current tensionScore:", tensionScore); // 디버깅 로그
    if (show) {
        tensionValueDisplay.style('display', 'inline-block', 'important'); 
        tensionValueDisplay.html(tensionScore); // 보일 때 최신 값으로 업데이트 
        console.log("Tension score set to visible. Current display style:", tensionValueDisplay.elt.style.display); // 변경 후 display 확인
    } else {
        tensionValueDisplay.style('display', 'none', 'important'); 
        console.log("Tension score set to hidden. Current display style:", tensionValueDisplay.elt.style.display); // 변경 후 display 확인 
    }
}

// === 친밀도 수치 숫자 표시를 제어하는 함수 ===
function showAffinityScore(show) {
    console.log("showAffinityScore called with:", show, "Current affinityScore:", affinityScore); // 디버깅 로그
    if (show) {
        affinityValueDisplay.style('display', 'inline-block', 'important'); // !important 추가
        affinityValueDisplay.html(affinityScore); // 보일 때 최신 값으로 업데이트
        console.log("Affinity score set to visible. Current display style:", affinityValueDisplay.elt.style.display); // 변경 후 display 확인
    } else {
        affinityValueDisplay.style('display', 'none', 'important'); // !important 추가
        console.log("Affinity score set to hidden. Current display style:", affinityValueDisplay.elt.style.display); // 변경 후 display 확인
    }
}

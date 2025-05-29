let playerInput; // HTML <input> 요소를 참조할 변수
let sendButton;  // HTML <button> 요소를 참조할 변수


// 수치 표시 HTML 요소들을 참조할 변수
let tensionValueDisplay; 
let affinityValueDisplay;

// 키워드 얼마나 했는지
let keyWordReveal = 0;

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
        //console.log("Mouseover tensionScoreDisplayContainer"); // 디버깅 로그
        showTensionScore(true); 
    });
    affinityScoreDisplayContainer.elt.addEventListener('mouseover', () => {
        //console.log("Mouseover affinityScoreDisplayContainer"); // 디버깅 로그
        showAffinityScore(true);
    });
    // 마우스를 떼면 숫자 숨김
    tensionScoreDisplayContainer.elt.addEventListener('mouseout', () => { 
        //console.log("Mouseout tensionScoreDisplayContainer"); // 디버깅 로그
        showTensionScore(false); 
    });
    affinityScoreDisplayContainer.elt.addEventListener('mouseout', () => {
        //console.log("Mouseout affinityScoreDisplayContainer"); // 디버깅 로그
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
    setDialogueText('(그녀는 답변을 고민하고 있다.)', userText); 
    // 2. 입력창을 비웁니다.
    playerInput.value(''); 

    // AI 응답 요청 (gemini.js의 generateContent 함수 호출)
    const aiResponse = await generateContent(userText);
    console.log("AI 응답 받음:", aiResponse);
    
    // AI 응답 내용에 따라 긴장도/친밀도 수치 받아옴
     // sketch.js의 전역 변수 affinityScore 사용

    const { affinity, tension, relevance, response } = aiResponse;

    if ( // 타입 검사. 답변 json이 제대로 구성되었는지.
        typeof affinity === 'number' &&
        typeof tension === 'number' &&
        typeof relevance === 'number' &&
        typeof response === 'string'
    )
    {
        let newTension = tensionScore;
        let newAffinity = affinityScore;

        // 키워드 해금 검사: 관련도가 높고 친밀도랑 긴장도도 높을 시
        if (relevance >= 70 && tensionScore >= 80 && affinityScore >= 80) 
        {
            RevealKeyWord(response, userText);
            updateGameScores(30, 30);
            return;
        }

        // 질문의 관련도에 따라 분기.
        if (relevance <= 20) // 관련도가 낮으면 친밀도, 긴장도 분석 수치에 관계 없이 하락 (10 ~ 30까지 하락)
        {
            newTension += relevance - 30;
            newAffinity += relevance - 30;
        }
        else // 그 외의 경우에는 분석된 친밀도와 긴장도 증감을 적용.
        {
            newTension += tension;
            newAffinity += affinity;
        }

        updateGameScores(newTension, newAffinity);
        setDialogueText(response, userText); 

        //console.log("handleUserInput() 완료.");
    }
    else // 답변 형태가 이상한 경우..
    {
        console.warn("AI 응답 형식이 예상과 다릅니다:", aiResponse);
        setDialogueText("응답을 처리할 수 없습니다. 다시 시도해 주세요.", userText);
    }

    
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

function RevealKeyWord(response, userText)
{
    switch (keyWordReveal)
    {
        case 0:
            // 1번 키워드
            setDialogueText(response + "키워드#1: 잔화 프로토콜 해금! 내용은 나중에~~!!", userText); 
            break;
        case 1:
            // 2번 키워드
            setDialogueText(response + "키워드#2: 딸 해금! 내용은 나중에~~!!", userText); 
            break;
        case 2:
            // 3번 키워드
            setDialogueText(response + "키워드#3: 문호 대학교 해금! 내용은 나중에~~!!", userText); 
            break;
        default:
            break;
    }
}

// 이 파일은 대화 및 점수 표시와 관련된 주요 게임 UI 상호 작용을 처리합니다.
// global-vars.js의 전역 변수와 다른 모듈의 함수를 사용합니다.

// HTML 입력 및 버튼 요소에 대한 참조 (global-vars.js에 선언, 여기에서 할당).
let playerInput; 
let sendButton;  

// 점수 표시를 위한 HTML 요소에 대한 참조 (global-vars.js에 선언, 여기에서 할당).
let tensionValueDisplay; 
let affinityValueDisplay;

// 수치 바 및 컨테이너 참조 변수
let tensionBar; 
let affinityBar;
let tensionScoreDisplayContainer; 
let affinityScoreDisplayContainer; 

// 이 함수는 HTML UI 요소를 초기화하고 이벤트 리스너를 설정합니다.
// sketch.js의 setup() 함수에서 호출됩니다.
function initializeUIElements() {
    console.log("initializeUIElements() 시작.");
    
    // HTML 요소를 전역 변수에 할당합니다 (P5.js의 select() 메서드 사용).
    // 디버깅을 위한 강력한 null 체크를 포함합니다.
    playerInput = select('#player-input'); 
    if (!playerInput) console.error("오류: #player-input 요소를 찾을 수 없습니다!");

    sendButton = select('#send-button');   
    if (!sendButton) console.error("오류: #send-button 요소를 찾을 수 없습니다!");

    tensionValueDisplay = select('#anxiety-value'); 
    if (!tensionValueDisplay) console.error("오류: #anxiety-value 요소를 찾을 수 없습니다!");
    else console.log("tensionValueDisplay selected:", tensionValueDisplay); 

    affinityValueDisplay = select('#affinity-value');
    if (!affinityValueDisplay) console.error("오류: #affinity-value 요소를 찾을 수 없습니다!");
    else console.log("affinityValueDisplay selected:", affinityValueDisplay); 

    tensionBar = select('#anxiety-bar'); 
    if (!tensionBar) console.error("오류: #anxiety-bar 요소를 찾을 수 없습니다!");

    affinityBar = select('#affinity-bar'); 
    if (!affinityBar) console.error("오류: #affinity-bar 요소를 찾을 수 없습니다!");

    tensionScoreDisplayContainer = select('#anxiety-score-display'); 
    if (!tensionScoreDisplayContainer) console.error("오류: #anxiety-score-display 요소를 찾을 수 없습니다!");

    affinityScoreDisplayContainer = select('#affinity-score-display'); 
    if (!affinityScoreDisplayContainer) console.error("오류: #affinity-score-display 요소를 찾을 수 없습니다!");
    
    // 입력 및 버튼에 대한 이벤트 리스너를 설정합니다.
    // 리스너를 추가하기 전에 요소가 존재하는지 확인합니다.
    if (sendButton) {
        sendButton.mousePressed(handleUserInput);
    } else {
        console.warn("sendButton 요소가 없어 mousePressed 리스너를 추가할 수 없습니다.");
    }

    if (playerInput && playerInput.elt) { // playerInput이 P5.Element이므로 .elt 속성 존재 여부를 확인합니다.
        playerInput.elt.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleUserInput();
            }
        });
    } else {
        console.warn("playerInput 요소가 없어 keypress 리스너를 추가할 수 없습니다.");
    }

    console.log("initializeUIElements() 완료.");
}
async function handleUserInput() {
    if (!isValidInput(playerInput)) return;

    const userText = playerInput.value().trim();
    console.log("handleUserInput() 시작. 사용자 입력:", userText);


    setDialogueText('(그녀는 답변을 고민하고 있다.)', userText);
    playerInput.value('');

    const aiResponse = await generateContent(userText, keyWordReveal, scoreMax, scoreMin, status);
    console.log("AI 응답 받음:", aiResponse);

    const { affinity, tension, relevance, response } = aiResponse;

    helpVisible = false;

    if (isValidAIResponse(affinity, tension, relevance, response)) {
        if (shouldRevealKeyword(relevance)) {
            checkStatus();
            revealKeyWord(response, userText);

        } else {
            const updated = processScores(relevance, affinity, tension);
            updateGameScores(updated.newTension, updated.newAffinity);
            checkGameOver();

            const tempStatus = status;
            checkStatus();

            const finalResponse = (tempStatus !== status)
                ? appendStatusReaction(response)
                : response;

            setDialogueText(finalResponse, userText);
        }
    } else {
        console.warn("AI 응답 형식이 예상과 다릅니다:", aiResponse);
        setDialogueText("어... 잠깐만요. 잘 못 들었는데, 다시 한번 말씀해주시겠어요?\n(오류입니다. 새로고침 해주세요.)", userText);
    }

    updateScoreDisplays();
    console.log("현재 진행도:", keyWordReveal);
}

function isValidInput(inputElement) {
    if (!inputElement || inputElement.value().trim() === '') {
        console.warn("사용자 입력이 비어있거나 playerInput 요소를 찾을 수 없습니다.");
        return false;
    }
    return true;
}

function isValidAIResponse(affinity, tension, relevance, response) {
    return (
        typeof affinity === 'number' &&
        typeof tension === 'number' &&
        typeof relevance === 'number' &&
        typeof response === 'string'
    );
}

function shouldRevealKeyword(relevance) {
    return relevance >= 70 && affinityScore >= 75 && tensionScore >= 75;
}

function processScores(relevance, affinity, tension) {
    let newTension = tensionScore;
    let newAffinity = affinityScore;

    if (relevance <= 20) {
        const penalty = relevance - 20; // 음수
        newTension += penalty;
        newAffinity += penalty;
    } else {
        newTension += Math.max(scoreMin, Math.min(scoreMax, tension));
        newAffinity += Math.max(scoreMin, Math.min(scoreMax, affinity));
    }

    return { newTension, newAffinity };
}

function appendStatusReaction(response) {
    switch (status) {
        case Status.IDLE:
            return response + "\n\n(그녀는 경계심을 드러내며 시선을 피했다.)";
        case Status.TENSION:
            return response + "\n\n(많이 긴장한 듯 보인다.)";
        case Status.AFFINITY:
            return response + "\n\n(마음이 편해진 듯해 보인다. 너무 긴장이 풀린 건 아닌지 우려스럽다.)";
        case Status.HELPFUL:
            return response + "\n\n(그녀의 경계심이 풀린 듯 보인다.)";
        default:
            return response + "\n\n(그녀의 상태가 바뀌었다.)";
    }
}

// 긴장도 및 친밀도 점수를 위한 HTML UI 요소를 업데이트합니다.
// handleUserInput() 및 sketch.js의 setup()에서 호출됩니다.
function updateScoreDisplays() {
    // 점수 바 및 표시 요소가 초기화되었는지 확인합니다.
    if (!tensionBar || !affinityBar || !tensionValueDisplay || !affinityValueDisplay) {
        console.error("점수 바 또는 표시 요소가 초기화되지 않았습니다. updateScoreDisplays를 실행할 수 없습니다.");
        return;
    }

    // 현재 점수(global-vars.js)를 기반으로 점수 바의 너비를 업데이트합니다.
    tensionBar.style('width', tensionScore + '%'); 
    affinityBar.style('width', affinityScore + '%');
    
    // 빛나는 효과를 위한 'glowing' 클래스 추가/제거 로직
    // requestAnimationFrame을 사용하여 DOM이 업데이트된 후 다음 프레임에서 클래스 제거를 예약합니다.
    // 이렇게 하면 브라우저가 glowing 클래스가 추가된 상태를 렌더링할 시간을 갖게 됩니다.

    // 긴장도 바에 glowing 클래스 추가
    tensionBar.elt.classList.add('glowing');
    requestAnimationFrame(() => {
        setTimeout(() => {
            tensionBar.elt.classList.remove('glowing');
        }, 500); // 빛나는 효과 지속 시간: 0.5초
    });

    // 친밀도 바에 glowing 클래스 추가
    affinityBar.elt.classList.add('glowing');
    requestAnimationFrame(() => {
        setTimeout(() => {
            affinityBar.elt.classList.remove('glowing');
        }, 500); // 빛나는 효과 지속 시간: 0.5초
    });


    //  숫자가 항상 보이도록 바로 업데이트
    tensionValueDisplay.html(tensionScore); 
    affinityValueDisplay.html(affinityScore); 
}


function revealKeyWord(response, userText)
{
    if (keyWordReveal >= 3) {
        console.log("모든 키워드가 이미 공개되었습니다. 추가 키워드 없음.");
        checkGameClear();
        return;
    }

    let briefingContent = ""; // 브리핑 화면에 표시될 내용
    let keywordId = "";
    let characterSpecificText = ""; //캐릭터가 말할 특정 메시지

    //키워드 해금 후 점수 여기서 적용
    updateGameScores(initTensionScore, initAffinityScore);

    switch (keyWordReveal)
    {
        case 0:
            characterSpecificText = "저, 수사관님. 수사에 도움이 될진 모르겠지만 말씀드리고 싶은 것이 있는데요...\n(그녀가 중요한 이야기를 하려는 것 같다.)";
            briefingContent = "남지연씨에게 학교라는 이름 뒤에 숨어있던 정부 주도 비밀 프로젝트에 대해 듣게 되었다.\n평범한 학교가 아니라고 하긴 했지만, 이런 정보를 알게 줄은 몰랐는데...\n정말 모든 것은 단순 사고였던 것일까?.\n더 물어보고 싶었지만, 남지연씨의 상태가 좋지 못해서 그렇게 조사는 끝이 났다.\n\n풀리지 않은 의문을 남긴 조사가 끝나고 다음 날,\n우연히 간 카페에서 마주친 남지연씨에게 사건에 대한 이야기를 더 들어보기로 했다.";
            keywordId = "키워드 #1";
            break;
        case 1:
            characterSpecificText = "그런데 수사관님. 혹시 이 정보가 도움이 될까요?\n(그녀가 중요한 이야기를 하려는 것 같다.)";
            briefingContent = "동료 교사 고유미씨에 대해 듣게 되었다.\n그녀는 잔화 프로토콜에 대해 회의적인 것을 넘어 적대적이었다고 한다.\n 그리고 이는 딸을 잃은 것과 관련이 있다는데...\n아무리 그렇다고 해도 이야기를 들으며 현장에 직접 가야겠다는 생각이 들었고\n확실한 기억을 찾고 싶다는 남지연씨의 말에 함께 장이섬으로 향하기로 했다.";
            keywordId = "키워드 #2";
            break;
        case 2:
            characterSpecificText = "근데 저...이제 다 기억났어요...\n(그녀가 중요한 이야기를 하려는 것 같다.)";
            briefingContent = "대학 시절부터 친한 사이였던 둘의 관계를 알게 되었다.\n 고유미가 딸을 잃고 슬퍼하는 모습을 다 지켜봤고\n고유미에게 힘이 되기 위해 고유미를 따라 잔화 프로토콜에 합류했다고 한다.\n 다만 고유미의 목적은 교화가 아닌 복수였고\n남지연이 자리를 비운 틈을 타 건물에 불을 질러 모두를 죽이고 자신도 불에 뛰어들었다고 한다.\n\n 이제 모든 것을 밝혀낸 걸까?\n\n남지연씨는 어떻게 되는 거지?";
            keywordId = "키워드 #3";
            break;
        default:
            console.log("revealKeyWord: 더 이상 공개할 키워드가 없거나, 예상치 못한 keyWordReveal 값입니다:", keyWordReveal);
            return;
    }


    // AI 응답과 캐릭터 특정 메시지를 먼저 표시합니다.
    setDialogueText(response + "\n\n" + characterSpecificText, userText); 

    // 브리핑 화면에 표시될 텍스트를 전역 lines 변수에 할당
    lines = briefingContent.split('\n'); 
    
    keyWordReveal++; // 키워드 카운트 증가
    unlockKeyword(keywordId); // 탐정 노트에 키워드 잠금 해제

    // 브리핑 모드 활성화 및 장면 인덱스 설정
    keywordBriefingPending = true; 
    briefingScene = keyWordReveal; // 1이면 키워드1 브리핑, 2이면 키워드2 브리핑...
    hideMainUI();

    console.log(`키워드 해금됨: ${keywordId}. 브리핑 화면 전환 대기 중.`);
    // 브리핑 화면 타이핑 효과를 위한 변수 초기화는 sketch.js의 mousePressed에서 gameState 변경 시 수행됩니다.
}

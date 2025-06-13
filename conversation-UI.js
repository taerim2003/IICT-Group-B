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

    if (isValidAIResponse(affinity, tension, relevance, response)) {
        if (shouldRevealKeyword(relevance)) {
            updateGameScores(initTensionScore, initAffinityScore);
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


function RevealKeyWord(response, userText)
{
    switch (keyWordReveal)
    {
        case 0:
            // 1번 키워드
            setDialogueText(response + "\n\n저, 수사관님. 수사에 도움이 될진 모르겠지만 말씀드리고 싶은 것이 있는데요...\n(그녀가 중요한 이야기를 하려는 것 같다.)", userText); 
            keyWordReveal++;
            unlockKeyword("키워드 #1");
            console.log(keywordUnlocked)
            break;
        case 1:
            // 2번 키워드
            setDialogueText(response + "\n\n그런데 수사관님. 혹시 이 정보가 도움이 될까요?\n(그녀가 중요한 이야기를 하려는 것 같다.)", userText); 
            keyWordReveal++;
            unlockKeyword("키워드 #2");
            console.log(keywordUnlocked)
            break;
        case 2:
            // 3번 키워드
            setDialogueText(response + "\n\n그런데 저, 그, 사실은... 아까 미처 말씀 못 드린 부분이 있는데...\n(그녀가 중요한 이야기를 하려는 것 같다.)", userText); 
            keyWordReveal++;
            unlockKeyword("키워드 #3");
            console.log(keywordUnlocked)
            break;
        default:
            break;
    }

}

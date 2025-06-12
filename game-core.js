// 이 파일은 점수 업데이트와 관련된 핵심 게임 로직을 포함합니다.
// global-vars.js의 tensionScore 및 affinityScore 변수를 사용합니다.

// 게임 점수(긴장도 및 친밀도)를 업데이트합니다.
// conversation-UI.js의 handleUserInput() 함수에서 호출됩니다.
function updateGameScores(newTension, newAffinity) { 
    tensionScore = constrain(newTension, 0, 100); // 점수를 0-100 사이로 제한
    affinityScore = constrain(newAffinity, 0, 100); // 점수를 0-100 사이로 제한
    
    // updateScoreDisplays()는 여기에서 직접 호출되지 않고,
    // handleUserInput에서 모든 관련 점수 계산 후에 UI 업데이트가 이루어지도록 합니다.
    console.log(`점수 업데이트됨: 긴장도=${tensionScore}, 친밀도=${affinityScore}`);
}

// 키워드 해금 로직 (global-vars.js의 keyWordReveal 변수 사용).
// 키워드 잠금 해제 조건이 충족될 때 handleUserInput()에서 호출됩니다.
function revealKeyWord(response, userText)
{
    switch (keyWordReveal)
    {
        case 0:
            // 1번 키워드
            setDialogueText(response + "\n\n저, 수사관님. 수사에 도움이 될진 모르겠지만 말씀드리고 싶은 것이 있는데요...\n(그녀가 중요한 이야기를 하려는 것 같다.)", userText); 
            keyWordReveal++;
            break;
        case 1:
            // 2번 키워드
            setDialogueText(response + "\n\n그런데 수사관님. 혹시 이 정보가 도움이 될까요?\n(그녀가 중요한 이야기를 하려는 것 같다.)", userText); 
            keyWordReveal++;
            break;
        case 2:
            // 3번 키워드
            setDialogueText(response + "\n\n그런데 저, 그, 사실은... 아까 미처 말씀 못 드린 부분이 있는데...\n(그녀가 중요한 이야기를 하려는 것 같다.)", userText); 
            keyWordReveal++;
            break;
        default:
            break;
    }
}

function checkGameOver()
{
    if (tensionScore <= 0 || affinityScore <= 0)
    {
        //여기에 배드엔딩을 띄워주세요
        console.log("배드엔딩 - 0");
    }
    else if (tensionScore >= 100 && tensionScore - affinityScore >= difference * 2)
    {
        //여기에 배드엔딩을 띄워주세요
        console.log("배드엔딩 - 긴장도 100");
    }
    else if (affinityScore >= 100 && affinityScore - tensionScore >= difference * 2)
    {
        //여기에 배드엔딩을 띄워주세요
        console.log("배드엔딩 - 친밀도 100");
    }
}

function checkStatus() {
    if (tensionScore <= 60 || affinityScore <= 60) {
        status = Status.IDLE;
    }
    else if (tensionScore - affinityScore >= difference) {
        status = Status.TENSION;
    }
    else if (affinityScore - tensionScore >= difference) {
        status = Status.AFFINITY;
    }
    else {
        status = Status.HELPFUL;
    }

    console.log(status);
}

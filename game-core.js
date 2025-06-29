
// 이 파일은 점수 업데이트와 관련된 핵심 게임 로직을 포함합니다.

// global-vars.js의 tensionScore 및 affinityScore 변수를 사용합니다.

// 게임 점수(긴장도 및 친밀도)를 업데이트합니다.
// conversation-UI.js의 handleUserInput() 함수에서 호출됩니다.


let badEndingImage0, badEndingImageTension, badEndingImageAffinity;


function preloadBadEndings() {
    badEndingImage0 = loadImage('assets/bad3.png');         // 점수 0 이하
    badEndingImageTension = loadImage('assets/bad2.jpg'); // 긴장도 100
    badEndingImageAffinity = loadImage('assets/bad1.JPG'); // 친밀도 100
}


function updateGameScores(newTension, newAffinity) { 
    tensionScore = constrain(newTension, 0, 100); // 점수를 0-100 사이로 제한
    affinityScore = constrain(newAffinity, 0, 100); // 점수를 0-100 사이로 제한

    // updateScoreDisplays()는 여기에서 직접 호출되지 않고,
    // handleUserInput에서 모든 관련 점수 계산 후에 UI 업데이트가 이루어지도록 합니다.
    console.log(`점수 업데이트됨: 긴장도=${tensionScore}, 친밀도=${affinityScore}`);
}



function checkGameOver() {
    if (tensionScore <= 0 || affinityScore <= 0) {
        badEndingType = "zero";
        console.log("배드엔딩 - 0");
    }
    else if (tensionScore >= 100 && tensionScore - affinityScore >= difference * 2) {
        badEndingType = "tension";
        console.log("배드엔딩 - 긴장도 100");
    }
    else if (affinityScore >= 100 && affinityScore - tensionScore >= difference * 2) {
        badEndingType = "affinity";

        console.log("배드엔딩 - 친밀도 100");
    }
}

function revealKeyWord(response, userText)
{
    switch (keyWordReveal)
    {
        case 0:
            // 1번 키워드
            setDialogueText(response + "\n\n저, 수사관님. 수사에 도움이 될진 모르겠지만 말씀드리고 싶은 것이 있는데요...\n(그녀가 중요한 이야기를 하려는 것 같다.)", userText); 
            keyWordReveal++;
            unlockKeyword("키워드 #1");
            setupKeywordBriefing(0);
            gameState = "keywordBriefing";
            console.log(keywordUnlocked)
            break;
        case 1:
            // 2번 키워드
            setDialogueText(response + "\n\n그런데 수사관님. 혹시 이 정보가 도움이 될까요?\n(그녀가 중요한 이야기를 하려는 것 같다.)", userText); 
            keyWordReveal++;
            unlockKeyword("키워드 #2");
            setupKeywordBriefing(1);
            gameState = "keywordBriefing";
            console.log(keywordUnlocked)
            break;
        case 2:
            // 3번 키워드
            setDialogueText(response + "\n\n그런데 저, 그, 사실은... 아까 미처 말씀 못 드린 부분이 있는데...\n(그녀가 중요한 이야기를 하려는 것 같다.)", userText); 
            keyWordReveal++;
            unlockKeyword("키워드 #3");
            setupKeywordBriefing(2);
            gameState = "keywordBriefing";
            setupEndingSequence();
            endingActive = true;

            console.log(keywordUnlocked)
            break;
        default:
            break;
    }

}

function checkStatus() {
    if (tensionScore - affinityScore >= difference) {
        status = Status.TENSION;
    }
    else if (affinityScore - tensionScore >= difference) {
        status = Status.AFFINITY;
    }
    else if (tensionScore <= 60 || affinityScore <= 60) {
        status = Status.IDLE;
    }
    else {
        status = Status.HELPFUL;
    }

    console.log(status);
}

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

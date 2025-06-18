let helpVisible = false;
let helpProgress = 0;
let helpSpeed = 0.1;
let helpMaxWidth = 500;
let helpHeight = 60;
let fontSize = 20;
let catImage_idle;
let catImage_smiling;
let helpText;
let question_mark_image;

// 버튼 인스턴스
let helpButton;

const helpTexts = {
    0: {
        idle: [
            "생존자는 당신을 다소 경계하고 있습니다.",
            "사건에 대한 전반적인 개요를 물어보면서 대화를 터봅시다.",
            "아직 묻지 않았다면 사건 당시 어디에 있었냐고 물어봅시다.",
            "자극적인 질문은 피하고, 간단한 질문으로 신뢰를 쌓아 봅시다.",
            "상대가 당황하지 않도록 사건에 대해 조심히 물어봅시다."
        ],
        affinity: [
            "생존자가 당신을 만만하게 보고 있습니다. 거친 말투로 압박해 주세요.",
            "친밀도가 높으니 조금은 무섭게 압박해 봅시다.",
            "생존자를 너무 상냥하게 대해서 긴장이 과하게 풀린 것 같습니다.",
            "친밀도가 높습니다. 강한 어조로 분위기를 잡아 주세요.",
            "생존자가 너무 여유롭습니다. 분위기를 다잡고 주도권을 되찾아야 합니다."
        ],
        tension: [
            "생존자가 긴장한 상태입니다. 상냥한 말투로 달래 주세요.",
            "친밀도를 올리지 않으면 묻는 말에 제대로 답하지 않을 것 같습니다.",
            "생존자의 긴장을 풀어줘야 합니다. 부드러운 어조로 공감해주세요.",
            "지금은 감정을 자극하기보단 안정감을 주는 것이 중요합니다.",
            "긴장을 유도하는 질문은 피하고, 공감과 격려로 친밀도를 쌓으세요."
        ],
        helpful: [
            "지금이라면 묻는 질문에 잘 대답해줄 것 같습니다.",
            "무엇을 물어야 할 지 모르겠다면, 학교에 대해 조금 더 물어봅시다.",
            "아직 묻지 않았다면, 평소에 학생들이 어땠는지 물어봅시다."
        ]
    },
    1: {
        idle: [
            "생존자는 다시 당신을 다소 경계하고 있습니다.",
            "탐정 노트를 참고하여 궁금한 점을 물어봅시다.",
            "자연스러운 대화로 친밀도와 긴장도를 올려 봅시다.",
            "갑작스러운 질문보다는, 지금까지의 이야기를 정리해주는 편이 좋습니다.",
            "의심을 사지 않도록, 감정 없이 중립적인 태도를 유지해 주세요."
        ],
        affinity: [
            "생존자가 당신을 만만하게 보고 있습니다. 거친 말투로 압박해 주세요.",
            "친밀도가 높으니 조금은 무섭게 압박해 봅시다.",
            "생존자를 너무 상냥하게 대해서 긴장이 과하게 풀린 것 같습니다.",
            "친밀도가 높습니다. 강한 어조로 분위기를 잡아 주세요.",
            "생존자가 너무 여유롭습니다. 분위기를 다잡고 주도권을 되찾아야 합니다."
        ],
        tension: [
            "생존자가 긴장한 상태입니다. 상냥한 말투로 달래 주세요.",
            "친밀도를 올리지 않으면 묻는 말에 제대로 답하지 않을 것 같습니다.",
            "생존자의 긴장을 풀어줘야 합니다. 부드러운 어조로 공감해주세요.",
            "지금은 감정을 자극하기보단 안정감을 주는 것이 중요합니다.",
            "긴장을 유도하는 질문은 피하고, 공감과 격려로 친밀도를 쌓으세요."
        ],
        helpful: [
            "생존자가 협조적 태도를 보이고 있습니다.",
            "무엇을 물어야 할 지 모르겠다면, 다른 선생님들에 대해 조금 더 물어봅시다.",
            "조금 더 친밀도와 긴장도를 올리면 중요한 정보를 제공해줄 것 같습니다."
        ]
    },
    2: {
        idle: [
            "생존자는 다시 당신을 다소 경계하고 있습니다.",
            "의심스러운 인물이 있다면, 조심스럽게 물어 봅시다.",
            "탐정 노트를 다시 읽고, 의심스러운 점을 물어봅시다.",
            "단도직입적인 질문보다, 이유를 묻는 방식이 효과적일 수 있습니다.",
            "지금은 신뢰 회복이 필요합니다. 너무 몰아붙이지 마세요."
        ],
        affinity: [
            "생존자가 당신을 만만하게 보고 있습니다. 거친 말투로 압박해 주세요.",
            "친밀도가 높으니 조금은 무섭게 압박해 봅시다.",
            "생존자를 너무 상냥하게 대해서 긴장이 과하게 풀린 것 같습니다.",
            "친밀도가 높습니다. 강한 어조로 분위기를 잡아 주세요.",
            "생존자가 너무 여유롭습니다. 분위기를 다잡고 주도권을 되찾아야 합니다."
        ],
        tension: [
            "생존자가 긴장한 상태입니다. 상냥한 말투로 달래 주세요.",
            "친밀도를 올리지 않으면 묻는 말에 제대로 답하지 않을 것 같습니다.",
            "생존자의 긴장을 풀어줘야 합니다. 부드러운 어조로 공감해주세요.",
            "지금은 감정을 자극하기보단 안정감을 주는 것이 중요합니다.",
            "긴장을 유도하는 질문은 피하고, 공감과 격려로 친밀도를 쌓으세요."
        ],
        helpful: [
            "지금이라면 솔직한 대답을 들을 수 있을 것 같습니다.",
            "의심스러운 인물에 대해 더 캐물어 봅시다.",
            "머지 않았습니다. 조금 더 친밀도와 긴장도를 올리면 사건의 전말이 모두 밝혀질 것 같습니다.",
            "정확한 단서와 함께 물어본다면 결정적인 증언을 들을 수 있을지도 모릅니다."
        ]
    }
};

// 버튼 초기화 함수
function createHelpButton() {
    helpButton = new Button("도움말", 30, 100, 70, 80, () => {
      helpVisible = !helpVisible;
    });
  }
  
function drawHelpUI() {
    if (helpButton) {
        helpButton.display();
    }

    // 도움말 패널 애니메이션
    if (helpVisible && helpProgress < 1) {
        helpProgress += helpSpeed;
        if (helpProgress > 1) helpProgress = 1;
    } else if (!helpVisible && helpProgress > 0) {
        helpProgress -= helpSpeed;
        if (helpProgress < 0) helpProgress = 0;
    }

    // 도움말 패널 그리기
    if (helpProgress > 0) {
        let x = 100;
        let y = 110;
        let paddingX = 20;

        // 텍스트 너비 계산
        textSize(fontSize);
        textAlign(LEFT, CENTER);
        let textWidthPixels = textWidth(helpText);
        let targetWidth = textWidthPixels + paddingX * 2;
        let currentWidth = targetWidth * helpProgress;

        fill(100, 100, 100, 220);
        noStroke();
        rect(x, y, currentWidth, helpHeight, 20);

        if (helpProgress > 0.95) {
            fill(255);
            text(helpText, x + paddingX, y + helpHeight / 2);
        }

        image(catImage_smiling, 20, 90, 100, 100);
    } else {
        image(catImage_idle, 20, 90, 100, 100);
    }

    image(question_mark_image, 80, 90, 50, 50);
}


// 마우스 클릭 처리 함수
function handleHelpMousePressed() {
    if (helpButton && helpButton.isMouseInside()) {
        helpButton.onClick();
        helpText = getHelpText(keyWordReveal, status);
    }
}
function getHelpText(progress, status)
{
    const statusGroup = helpTexts[progress];
    if (!statusGroup)
    {
        return "현재 단계에 대한 도움말이 없습니다.";
    }

    const candidates = statusGroup[status];

    if (!candidates || candidates.length === 0)
    {
        return "현재 상태에 대한 조언이 없습니다.";
    }

    return candidates[Math.floor(Math.random() * candidates.length)];
}
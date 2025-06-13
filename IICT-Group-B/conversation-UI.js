let aiResponse = '';

function initializeInput() 
{
    inputBox = createInput();
    inputBox.position(10, height - 60);
    inputBox.size(width - 120, 30);
    //inputBox.elt.addEventListener('keydown', onInputKeyDown);
}

async function handleUserInput() 
{
    const userText = inputBox.value().trim();
    if (userText === '') return;
    inputBox.value('');

    aiResponse = await generateContent(userText);
}

function DrawOutputText()
{
    textSize(14);
    fill(0);
    textAlign(CENTER, CENTER);
    text(aiResponse, 30, 50, width - 60, height - 100);
}
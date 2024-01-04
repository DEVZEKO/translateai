const app = document.getElementById('app');
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const translateButton = document.getElementById('translate-button');
const nightModeToggle = document.getElementById('night-mode-toggle');
const languageSelect = document.getElementById('language-select');
const apiKey = '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';

translateButton.addEventListener('click', async () => {
    console.log("Click");
    const text = inputText.value;
    const targetLanguage = languageSelect.value;
    if (text && targetLanguage) {
        showSpinner();
        const translation = await translateText(text, targetLanguage);
        outputText.value = translation;
        hideSpinner();
    }
});

nightModeToggle.addEventListener('click', () => {
    const nightModeElements = [
        app, 
        ...Array.from(document.querySelectorAll('.header, .footer')), 
        inputText, 
        outputText, 
        languageSelect
    ];

    nightModeElements.forEach(element => {
        element.classList.toggle('night');
    });
});

async function translateText(text, targetLanguage) {


    const prompt = `Translate the following text to ${targetLanguage}: ${text}`;
    if (prompt) {
        try {
            console.log("prompt is", prompt)
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    //model: 'gpt-3.5-turbo-0301', //Needed for CogSmart API key that won't support GPT4 :(
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 1.0,
                    top_p: 0.7,
                    n: 1,
                    stream: false,
                    presence_penalty: 0,
                    frequency_penalty: 0,
                }),
            });

            if (response.ok) {
                console.log("response", response)
                const data = await response.json();
                console.log("data", data) // Move this line after initializing the `data` variable
                return data.choices[0].message.content;
            } else {
                console.log("response", response)
                return 'Error: Unable to process your request.';
            }
        } catch (error) {
            console.error(error);
            return 'Error: Unable to process your request.';
        }
    }

}

function showSpinner() {
    const spinnerContainer = document.getElementById('spinner-container');
    spinnerContainer.style.opacity = '1';
    spinnerContainer.style.visibility = 'visible';
    translateButton.setAttribute('disabled', true);
}

function hideSpinner() {
    const spinnerContainer = document.getElementById('spinner-container');
    spinnerContainer.style.opacity = '0';
    spinnerContainer.style.visibility = 'hidden';
    translateButton.removeAttribute('disabled');
}

const copyButton = document.getElementById('copy-button');

copyButton.addEventListener('click', () => {
    outputText.select();
    document.execCommand('copy');
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "play-audio"){
        const uint8Array = new Uint8Array(message.audioData);
        const blob = new Blob([uint8Array], {type :'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
    }
});
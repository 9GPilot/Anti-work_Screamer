// load the saved key into the input when page opens
chrome.storage.local.get('apiKey', (result) => {
    if (result.apiKey) {
        document.getElementById('api-key').value = result.apiKey;
    }
});

// save it when the button is clicked
document.getElementById('save-btn').addEventListener('click', () => {
    const key = document.getElementById('api-key').value;
    chrome.storage.local.set({ apiKey: key }, () => {
        document.getElementById('status').textContent = 'Saved!';
    });
});
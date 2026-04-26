chrome.tabs.query({}, (tabs) => {

    // get the current web page show the count of the tabs
    document.getElementById('tab-count').textContent = tabs.length;

    // list every tab 
    const list = document.getElementById('tab-list');
    tabs.forEach((tab) => {
        // create a tab list item of the tab
        const li = document.createElement('li');
        li.title = tab.url;

        // if this tab has a icon associated with it then pull it and put it next to it 
        if (tab.favIconUrl){
            const img = document.createElement('img')
            img.src = tab.favIconUrl;
            img.onerror = () => img.remove(); // hide the broken favicons
            li.appendChild(img);
        }

        // Create a span element to hold the title of the tab
        const span = document.createElement('span');
        span.textContent = tab.title || tab.url;
        li.appendChild(span);

        // create a button to close the tab 
        const btn = document.createElement('button');
        btn.innerText = 'X';
        btn.addEventListener('click', () => {
            chrome.tabs.remove(tab.id)
            li.remove()
        });
        li.appendChild(btn);

        list.appendChild(li);
    });
});

setInterval(() => {
    chrome.runtime.sendMessage({ type: 'get-timer'});
}, 1000);

// listen for the response and update the display
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'timer-update') {
        const mins = Math.floor(message.seconds / 60);
        const secs = message.seconds % 60;
        document.getElementById('timer-display').textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
});

document.getElementById('start-btn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'start-timer' });
});

document.getElementById('stop-btn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'stop-timer'});
    document.getElementById('timer-display').textContent = '25:00';
});
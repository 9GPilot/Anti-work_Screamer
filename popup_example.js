chrome.tabs.query({}, (tabs) => {
  // Show count
  document.getElementById('tab-count').textContent = tabs.length;

  // List every tab
  const list = document.getElementById('tab-list');
  tabs.forEach((tab) => {
    const li = document.createElement('li');
    li.title = tab.url;

    // Favicon
    if (tab.favIconUrl) {
      const img = document.createElement('img');
      img.src = tab.favIconUrl;
      img.onerror = () => img.remove(); // hide broken favicons
      li.appendChild(img);
    }

    // Title
    const span = document.createElement('span');
    span.textContent = tab.title || tab.url;
    li.appendChild(span);

    // Click to switch to that tab
    li.addEventListener('click', () => {
      chrome.tabs.update(tab.id, { active: true });
      chrome.windows.update(tab.windowId, { focused: true });
      li.remove()
    });

    list.appendChild(li);
  });
});

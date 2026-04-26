let blockingActive = false;
let timerInterval = null;
let secondsRemaining = 0;

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'set-blocking'){
        blockingActive = message.active;
    }

    if (message.type === 'start-timer'){
        secondsRemaining = 25*60;
        blockingActive = true;
        clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            secondsRemaining--;
            if (secondsRemaining <= 0){
                clearInterval(timerInterval);
                blockingActive = false;
            }
        }, 1000);
    }

    if (message.type === 'stop-timer'){
        clearInterval(timerInterval);
        secondsRemaining = 0;
        blockingActive = false;
    }

    if (message.type === 'get-timer'){
        chrome.runtime.sendMessage({ type: 'timer-update', seconds: secondsRemaining});
    }
});

chrome.tabs.onUpdated.addListener( (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && blockingActive){
        const nonWorkSites = [
            // Video
            'youtube.com',
            'netflix.com',
            'twitch.tv',
            'hulu.com',
            'disneyplus.com',
            'primevideo.com',
            'hbomax.com',
            'peacocktv.com',
            'tiktok.com',
            'vimeo.com',
            'dailymotion.com',
            'crunchyroll.com',

            // Social media
            'instagram.com',
            'facebook.com',
            'twitter.com',
            'x.com',
            'snapchat.com',
            'pinterest.com',
            'linkedin.com',
            'threads.net',
            'tumblr.com',
            'mastodon.social',
            'bereal.com',

            // News & time wasters
            'reddit.com',
            'buzzfeed.com',
            '9gag.com',
            'imgur.com',
            'digg.com',
            'hackernews.com',
            'news.ycombinator.com',

            // Gaming
            'twitch.tv',
            'store.steampowered.com',
            'epicgames.com',
            'roblox.com',
            'miniclip.com',
            'poki.com',
            'chess.com',
            'lichess.org',

            // Shopping
            'amazon.com',
            'ebay.com',
            'etsy.com',
            'walmart.com',
            'target.com',
            'bestbuy.com',
            'asos.com',
            'shein.com',
            'aliexpress.com',
            'wish.com',

            // Sports
            'espn.com',
            'nfl.com',
            'nba.com',
            'mlb.com',
            'nhl.com',
            'fifa.com',
            'bleacherreport.com',
            'cbssports.com',

            // Music
            'spotify.com',
            'soundcloud.com',
            'pandora.com',
            'music.apple.com',
            'last.fm',

            // Memes & fun
            'ifunny.co',
            'memedroid.com',
            'knowyourmeme.com',
            'cheezburger.com',
            'funny-jokes.com',

            // Dating
            'tinder.com',
            'bumble.com',
            'hinge.co',
            'match.com',
            'okcupid.com',

            // Gambling
            'draftkings.com',
            'fanduel.com',
            'betmgm.com',
            'pokerstars.com',
        ];
        const isNonWork = nonWorkSites.some(site => tab.url.includes(site))
    
        if (isNonWork){
            chrome.tabs.remove(tab.id);
            screamAtUser();
        }
    }
});


async function screamAtUser() {
    const messages = [
        // Disappointed
        "Common man, you gotta keep working",
        "I thought we were being productive today",
        "You were doing so well too",
        "Come on, you know better than this",
        "This is not what we agreed on",

        // Aggressive
        "GET BACK TO WORK RIGHT NOW",
        "Close that tab immediately",
        "What do you think you are doing",
        "absolutely not, get back to work",
        "I will not allow this, back to work",
        "No. No no no no no. Work. Now.",

        // Sarcastic
        "Oh yeah sure, totally work related",
        "Wow great job, very productive",
        "Yes because watching videos is definitely on your todo list",
        "Oh I am sure your boss would love to see this",
        "Fascinating, tell me more about how this helps your deadline",
        "Sure take a break, it is not like you have things to do",

        // Motivational
        "You are so close to finishing, do not give up now",
        "Future you will thank present you for staying focused",
        "You got this, now close that tab and get back to it",
        "Every minute counts, make them all matter",
        "The work is not going to do itself, let us go",
        "You are better than this distraction, prove it",

        // Threatening
        "I am watching every tab you open",
        "Do not make me do this again",
        "This is your only warning",
        "I have my eye on you",
        "Try that again and see what happens",

        // Guilt tripping
        "Your future self is very disappointed right now",
        "Think about how good you will feel when this is done",
        "Is this really how you want to spend your time",
        "Your deadlines are not going to move themselves",
        "While you browse, your competition is working",
    ];

    const voices = [
        "wBXNqKUATyqu0RtYt25i",
        "goT3UYdM9bhm0n2lmKQx",
        "4YYIPFl9wE5c4L2eu2Gb",
        "WAhoMTNdLdMoq1j3wf3I",
        "AeRdCCKzvd23BpJoofzx",
        "lxYfHSkYm1EzQzGhdbfc"
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const randomVoice = voices[Math.floor(Math.random() * voices.length)];

    // read the api key from local storage
    chrome.storage.local.get('apiKey', async (result) => {
        const key = result.apiKey;

        if (!key) {
            console.error('No API key found. Please set it in the extension options.');
            return;
        }

        const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + randomVoice, {
            method: "POST",
            headers: {
                "xi-api-key": key,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: randomMessage,
                model_id: "eleven_monolingual_v1"
            })
        });

        const audioBlob = await response.blob();
        const audioBuffer = await audioBlob.arrayBuffer();
        const audioData = Array.from(new Uint8Array(audioBuffer));

        // create the offscreen document then send it the audio data
        const existing = await chrome.offscreen.hasDocument();
        if (!existing) {
            await chrome.offscreen.createDocument({
                url: 'offscreen.html',
                reasons: ["AUDIO_PLAYBACK"],
                justification: "Playing text-to-speech audio"
            });
        }

        chrome.runtime.sendMessage({ type: "play-audio", audioData: audioData });
    });
}
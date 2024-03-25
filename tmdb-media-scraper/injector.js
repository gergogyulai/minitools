javascript: (function() {
    var githubScriptURL = 'https://raw.githubusercontent.com/gergogyulai/minitools/main/tmdb-media-scraper/scraper.js';
    fetch(githubScriptURL)
        .then(function(response) {
            console.log('INJECTOR: Fetching ' + githubScriptURL.substring(githubScriptURL.lastIndexOf('/') + 1) + ' from ' + githubScriptURL + '...')
            return response.text()
        })
        .then(function(scriptText) {
            var injectedScript = document.createElement('script');
            injectedScript.textContent = scriptText;
            document.head.appendChild(injectedScript);
            console.log('INJECTOR: Successfully injected ' + githubScriptURL.substring(githubScriptURL.lastIndexOf('/') + 1) + ' from ' + githubScriptURL)
        })
        .catch(function(error) {
            console.error('INJECTOR: Error fetching the script:', error)
        })
})();
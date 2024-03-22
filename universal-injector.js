javascript: (function() {
    // put script link to inject here.
    var githubScriptURL = '';
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
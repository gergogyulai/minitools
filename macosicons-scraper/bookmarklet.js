javascript:(()=>{var githubScriptURL='https://raw.githubusercontent.com/gergogyulai/minitools/main/macosicons-scraper/scraper.min.js';fetch(githubScriptURL).then(r=>{console.log('INJECTOR: Fetching '+githubScriptURL.substring(githubScriptURL.lastIndexOf('/')+1)+' from '+githubScriptURL+'...');return r.text()}).then(t=>{var e=document.createElement('script');e.textContent=t,document.head.appendChild(e),console.log('INJECTOR: Successfully injected '+githubScriptURL.substring(githubScriptURL.lastIndexOf('/')+1)+' from '+githubScriptURL)}).catch(t=>{console.error('INJECTOR: Error fetching the script:',t)})})();
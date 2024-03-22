# macOS Icons Downloader

This script allows you to download icons from a webpage with a single click. It also provides an option for infinite scrolling.

## Usage

1. **Downloading Images:**
    - Click on the "Download Images" button to scrape the webpage for image links and download them as a zip file.
  
2. **Infinite Scrolling:**
    - Click on the "Start Infinite Scroll" button to initiate automatic scrolling down the page.
    - To stop scrolling, press the spacebar. The page will then scroll to the top, and scrolling will not resume.

## How to Use

1. **Bookmarklet:**
    - Create a new bookmark in your browser.
    - Set the name to whatever you like (e.g., "macOS Icons Downloader").
    - Set the URL or address to the following JavaScript code:

    ```javascript
    javascript:(()=>{fetch('https://raw.githubusercontent.com/gergogyulai/minitools/main/macosicons-scraper/scraper.min.js').then(r=>{console.log('INJECTOR: Fetching '+t.substring(t.lastIndexOf('/')+1)+' from '+t+'...');return r.text()}).then(t=>{var e=document.createElement('script');e.textContent=t,document.head.appendChild(e),console.log('INJECTOR: Successfully injected '+t.substring(t.lastIndexOf('/')+1)+' from '+t)}).catch(t=>{console.error('INJECTOR: Error fetching the script:',t)})})();
    ```

    - Whenever you want to use the script on a webpage, simply click the bookmark.

2. **Manual Execution:**
    - Open the Developer Tools console in your browser (usually accessed by pressing F12).
    - Copy the entire content of the script provided [here](https://raw.githubusercontent.com/gergogyulai/minitools/main/macosicons-scraper/scraper.js).
    - Paste the copied script into the console and press Enter.

3. **Ensure JSZip is Available:**
    - The script relies on the JSZip library to create zip files. Make sure JSZip is loaded in your browser environment.

4. **Buttons Placement:**
    - After executing the script, two buttons ("Download Images" and "Start Infinite Scroll") will be added to the top of the page. Click on the respective buttons to perform the desired action.
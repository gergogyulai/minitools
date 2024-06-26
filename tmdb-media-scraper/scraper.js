// Function to initiate infinite scrolling
function startInfiniteScroll() {
  // Define the scrolling speed (in pixels)
  const scrollSpeed = 100; // Adjust as needed

  // Scroll down the page at the defined speed until spacebar is pressed
  const scrollInterval = setInterval(() => {
    window.scrollBy(0, scrollSpeed); // Scroll down at the defined speed
  }, 100); // Adjust the scrolling interval if needed

  // Listen for the spacebar keypress to stop scrolling and scroll to the top
  const stopScrolling = (event) => {
    if (event.code === 'Space') {
      clearInterval(scrollInterval);
      window.scrollTo(0, 0); // Scroll to the top of the page
      window.removeEventListener('keydown', stopScrolling);
    }
  };

  window.addEventListener('keydown', stopScrolling);
}

// Function to reload the page
function reloadPage() {
  location.reload();
}

// Function to add buttons to the DOM
function addButtons() {
  // Create a container for buttons
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'inline-block';
  buttonContainer.style.marginRight = '10px';
  buttonContainer.style.marginTop = '80px'

  // Create the download button
  const downloadButton = document.createElement('button');
  downloadButton.textContent = 'Download Images';
  downloadButton.addEventListener('click', scrapeAndDownloadImages);
  buttonContainer.appendChild(downloadButton);

  // Create the infinite scroll button
  const infiniteScrollButton = document.createElement('button');
  infiniteScrollButton.textContent = 'Start Infinite Scroll';
  infiniteScrollButton.addEventListener('click', startInfiniteScroll);
  buttonContainer.appendChild(infiniteScrollButton);

  // Create the reload button
  const reloadButton = document.createElement('button');
  reloadButton.textContent = 'Reload Page';
  reloadButton.addEventListener('click', reloadPage);
  buttonContainer.appendChild(reloadButton);

  // Insert the button container into the document
  document.body.insertBefore(buttonContainer, document.body.firstChild);

  // Call the function to initiate scraping and downloading
  scrapeAndDownloadImages();
}

// Function to download an image and add it to the zip
// Function to download an image and add it to the zip
async function downloadAndAddToZip(url, zip) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    // Get the filename from the URL
    const filename = url.substring(url.lastIndexOf('/') + 1);

    // Add the blob to the zip file
    zip.file(filename, blob);

    console.log(`Downloaded and added to zip: ${filename}`);
  } catch (error) {
    console.error(`Error downloading: ${url}`, error);
  }
}



// Function to create and download the zip file
function createAndDownloadZip(zip, title) {
  zip.generateAsync({ type: 'blob' }).then(function (blob) {
    const zipFilename = `${title}.zip`; // Use the webpage title as the zip filename
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = zipFilename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log('Zip file downloaded:', zipFilename);
  });
}

// Function to scrape "View Original" links and download images
function scrapeAndDownloadImages() {
  // Check if JSZip is defined
  if (typeof JSZip === 'undefined') {
    // Inject JSZip library if not already loaded
    var jsZipScript = document.createElement('script');
    jsZipScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js';
    jsZipScript.onload = () => {
      // Call the function to initiate scraping and downloading
      scrapeAndDownloadImages();
    };
    document.head.appendChild(jsZipScript);
    return;
  }

  // Get the webpage's title
  const title = document.title;

  // Find all <a> elements with alt text "View Original"
  const linkElements = document.querySelectorAll('a[alt="View Original"]');

  // Create a new instance of JSZip
  const zip = new JSZip();

  // Iterate through the found <a> elements and download their images
  const downloadPromises = Array.from(linkElements).map((linkElement) => {
    const imageUrl = linkElement.getAttribute('href');
    return downloadAndAddToZip(imageUrl, zip);
  });

  // Wait for all downloads to complete and then create and download the zip
  Promise.all(downloadPromises).then(() => {
    createAndDownloadZip(zip, title); // Pass the webpage title as the zip filename
  });
}

// Call the function to add buttons to the DOM
addButtons();
console.log("SCRAPERSCRIPT: Successfully got injected");

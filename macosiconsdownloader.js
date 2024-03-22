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

// Function to scrape image links from <a> tags inside <div> elements with the class "card-img-wrapper" and download them
function scrapeAndDownloadImages() {
  // Check if JSZip is defined
  if (typeof JSZip === 'undefined') {
    console.error('JSZip library is not available.');
    return;
  }

  // Get the webpage's title
  const title = document.title;

  // Find all <div> elements with the class "card-img-wrapper"
  const divElements = document.querySelectorAll('div.card-img-wrapper');

  // Create a new instance of JSZip
  const zip = new JSZip();

  // Iterate through the found <div> elements and find <a> tags inside them to download images
  const downloadPromises = Array.from(divElements).flatMap((divElement) => {
    const linkElements = divElement.querySelectorAll('a');
    return Array.from(linkElements).map((linkElement) => {
      const imageUrl = linkElement.getAttribute('href');
      return downloadAndAddToZip(imageUrl, zip);
    });
  });

  // Wait for all downloads to complete and then create and download the zip
  Promise.all(downloadPromises).then(() => {
    createAndDownloadZip(zip, title); // Pass the webpage title as the zip filename
  });
}

// Function to inject the JSZip library and start scraping and downloading images
function injectAndStartDownload() {
  // Inject JSZip library
  var jsZipScript = document.createElement('script');
  jsZipScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js';
  jsZipScript.onload = scrapeAndDownloadImages; // Call the function once JSZip is loaded
  document.head.appendChild(jsZipScript);
}

// Function to add a download button to the top of the page
function addDownloadButton() {
  const button = document.createElement('button');
  button.textContent = 'Download Images';
  button.addEventListener('click', injectAndStartDownload);
  document.body.insertBefore(button, document.body.firstChild);
}

// Call the function to add the download button to the top of the page
addDownloadButton();

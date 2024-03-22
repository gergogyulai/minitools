// Inject the JSZip library
var jsZipScript = document.createElement('script');
jsZipScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js';
document.head.appendChild(jsZipScript);

// Function to download an image and add it to the zip
async function downloadAndAddToZip(url, filename, zip) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

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

// Function to scrape image links and titles and download them
function scrapeAndDownloadImages() {
  // Check if JSZip is defined
  if (typeof JSZip === 'undefined') {
    console.error('JSZip library is not available.');
    return;
  }

  // Get the webpage's title
  const title = document.title;

  // Find all <div> elements with the specified classes
  const cardWrappers = document.querySelectorAll('div.card-wrapper.card-hover.coral-card.m-0');

  // Create a new instance of JSZip
  const zip = new JSZip();

  // Array to hold all download promises
  const downloadPromises = [];

  // Iterate through the found <div> elements
  cardWrappers.forEach((cardWrapper, index) => {
    // Find <a> tags inside the current card wrapper
    const linkElements = cardWrapper.querySelectorAll('div.card-img-wrapper a');
    linkElements.forEach((linkElement, linkIndex) => {
      const imageUrl = linkElement.getAttribute('href');

      // Find the corresponding <h3> tag for the title
      const h3Title = cardWrapper.querySelector('h3');
      if (h3Title) {
        const titleText = h3Title.textContent.trim();
        const filename = `${titleText}_${index}_${linkIndex}.${imageUrl.split('.').pop()}`; // Keep the original extension

        // Create a download promise and add it to the array
        const downloadPromise = downloadAndAddToZip(imageUrl, filename, zip);
        downloadPromises.push(downloadPromise);
      }
    });
  });

  // After all download promises resolve, create and download the zip file
  Promise.all(downloadPromises).then(() => {
    createAndDownloadZip(zip, title);
  });
}

// Function to add a download button to the top of the page
function addDownloadButton() {
  const button = document.createElement('button');
  button.textContent = 'Download Images';
  button.addEventListener('click', scrapeAndDownloadImages);
  document.body.insertBefore(button, document.body.firstChild);
}

// Call the function to add the download button to the top of the page
addDownloadButton();

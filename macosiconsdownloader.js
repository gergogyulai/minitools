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

// Function to initiate infinite scrolling
function startInfiniteScroll() {
  // Scroll down the page at max speed until spacebar is pressed
  const scrollInterval = setInterval(() => {
    window.scrollBy(0, window.innerHeight); // Scroll down at max speed
  }, 0); // Adjust the scrolling interval for max speed

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
}

// Call the function to add buttons to the DOM
addButtons();
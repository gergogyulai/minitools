var jsZipScript = document.createElement('script');
jsZipScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js';
document.head.appendChild(jsZipScript);
async function downloadAndAddToZip(url, filename, zip) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    zip.file(filename, blob);
    console.log(`Downloaded and added to zip: ${filename}`);
  } catch (error) { console.error(`Error downloading: ${url}`, error);}
}
function createAndDownloadZip(zip, title) {
  zip.generateAsync({ type: 'blob' }).then(function (blob) {
    const zipFilename = `${title}.zip`;
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
function scrapeAndDownloadImages() {
  if (typeof JSZip === 'undefined') { console.error('JSZip library is not available.'); return; }
  const title = document.title;
  const cardWrappers = document.querySelectorAll('div.card-wrapper.card-hover.coral-card.m-0');
  const zip = new JSZip();
  const downloadPromises = [];
  cardWrappers.forEach((cardWrapper, index) => {
    const linkElements = cardWrapper.querySelectorAll('div.card-img-wrapper a');
    linkElements.forEach((linkElement, linkIndex) => {
      const imageUrl = linkElement.getAttribute('href');
      const h3Title = cardWrapper.querySelector('h3');
      if (h3Title) {
        const titleText = h3Title.textContent.trim();
        const filename = `${titleText}_${index}_${linkIndex}.${imageUrl.split('.').pop()}`;
        const downloadPromise = downloadAndAddToZip(imageUrl, filename, zip);
        downloadPromises.push(downloadPromise);
      }
    });
  });
  Promise.all(downloadPromises).then(() => { createAndDownloadZip(zip, title); });
}
function startInfiniteScroll() {
  const scrollSpeed = 100;
  const scrollInterval = setInterval(() => {window.scrollBy(0, scrollSpeed);}, 100);
  const stopScrolling = (event) => {
    if (event.code === 'Space') {
      clearInterval(scrollInterval);
      window.scrollTo(0, 0);
      window.removeEventListener('keydown', stopScrolling);
    }
  };
  window.addEventListener('keydown', stopScrolling);
}
function reloadPage() {
  location.reload();
}
function addButtons() {
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'inline-block';
  buttonContainer.style.marginRight = '10px';
  const downloadButton = document.createElement('button');
  downloadButton.textContent = 'Download Images';
  downloadButton.addEventListener('click', scrapeAndDownloadImages);
  buttonContainer.appendChild(downloadButton);
  const infiniteScrollButton = document.createElement('button');
  infiniteScrollButton.textContent = 'Start Infinite Scroll';
  infiniteScrollButton.addEventListener('click', startInfiniteScroll);
  buttonContainer.appendChild(infiniteScrollButton);
  const reloadButton = document.createElement('button');
  reloadButton.textContent = 'Reload Page';
  reloadButton.addEventListener('click', reloadPage);
  buttonContainer.appendChild(reloadButton);
  document.body.insertBefore(buttonContainer, document.body.firstChild);
}
addButtons();
console.log("SCRAPERSCRIPT: Successfully got injected")
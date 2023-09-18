/*
██████╗ ███████╗ █████╗ ██████╗     ███╗   ███╗███████╗
██╔══██╗██╔════╝██╔══██╗██╔══██╗    ████╗ ████║██╔════╝
██████╔╝█████╗  ███████║██║  ██║    ██╔████╔██║█████╗  
██╔══██╗██╔══╝  ██╔══██║██║  ██║    ██║╚██╔╝██║██╔══╝  
██║  ██║███████╗██║  ██║██████╔╝    ██║ ╚═╝ ██║███████╗
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝     ╚═╝     ╚═╝╚══════╝
 - This scirpt is intended to scrape TMDB (themoviedb.org) images
 - It works by iterating through the page and then creating a zip file with the images using the library JSZip
 - Unlike other approaches this results only 1 file downloaded onto your computer
 - Usage: 1. Open devtools (ctrl+shift+I)
          2. Navigate to the console tab
          3. Now copy all of the contents from this file, then paste it into there
          4. Press enter and then wait until your browser prompts you with the download. (It may take some time to run depending the ammount of images scraped)
        It's best practice to download the zip file into an empty folder, as the files are not in a folder within the zip file
*/

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
  function createAndDownloadZip(zip) {
    zip.generateAsync({ type: 'blob' }).then(function (blob) {
      const zipFilename = 'downloaded_images.zip';
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
      console.error('JSZip library is not available.');
      return;
    }
  
    // Find all <a> elements with alt text "View Original"
    const linkElements = document.querySelectorAll('a[alt="View Original"]');
  
    // Create a new instance of JSZip
    const zip = new JSZip();
  
    // Iterate through the found <a> elements and download their images
    const downloadPromises = Array.from(linkElements).map((linkElement) => {
      const imageUrl = `https://www.themoviedb.org${linkElement.getAttribute('href')}`;
      return downloadAndAddToZip(imageUrl, zip);
    });
  
    // Wait for all downloads to complete and then create and download the zip
    Promise.all(downloadPromises).then(() => {
      createAndDownloadZip(zip);
    });
  }
  
  // Inject JSZip library
  var jsZipScript = document.createElement('script');
  jsZipScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js';
  jsZipScript.onload = scrapeAndDownloadImages; // Call the function once JSZip is loaded
  document.head.appendChild(jsZipScript);
  

function extractAndReformatLinks() {
    return Array.from(document.querySelectorAll('a.photos-thumbnail__link'))
      .map(link => {
        const photoId = new URL(link.href).searchParams.get('id');
        return `https://fortepan.download/_photo/download/fortepan_${photoId}.jpg`;
      });
  }
  
  function saveLinksToFile(links) {
    const blob = new Blob([links.join('\n')], { type: 'text/plain' });
    const link = Object.assign(document.createElement('a'), {
      download: 'reformatted_links.txt',
      href: URL.createObjectURL(blob),
    });
    link.click();
  }
  
  const reformattedLinks = extractAndReformatLinks();
  saveLinksToFile(reformattedLinks);
  console.log(`Successfully grabbed ${reformattedLinks.length} link(s)`);
window.Webflow ||= [];
window.Webflow.push(() => {
  main();
});

function main() {
  const slidesWrapper = document.querySelector('.slides-wrapper') as HTMLElement;
  const slides = document.querySelectorAll('.slides-wrapper .slide');

  if (!slidesWrapper || !slides.length) return;

  let currentSlideIndex = 0;
  const numSlides = slides.length;

  document.addEventListener('keydown', (e) => handleKeydown(e));

  initDownloadButton();

  function initDownloadButton() {
    console.log('Adding download button');
    const url = 'https://slides-download-production.up.railway.app/generate';
    const downloadButton = document.querySelector('.download-button') as HTMLButtonElement;
    if (!downloadButton) return;

    downloadButton.addEventListener('click', async () => {
      console.log('Downloading...');
      downloadButton.disabled = true;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok.');

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'slides.pdf';
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(link);
      } catch (error) {
        console.error('Download failed', error);
      }

      downloadButton.disabled = false;
    });
    console.log('Download button added');
  }

  function handleKeydown(e: KeyboardEvent) {
    // override tabs behavior
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement) activeElement.blur();
    }, 0);

    if (e.key === 'ArrowRight' && currentSlideIndex < numSlides - 1) {
      e.preventDefault();
      currentSlideIndex++;
    } else if (e.key === 'ArrowLeft' && currentSlideIndex > 0) {
      e.preventDefault();
      currentSlideIndex--;
    }

    slidesWrapper.style.transform = `translateX(${currentSlideIndex * -100}vw)`;
    updateSlideNumber();
  }

  function updateSlideNumber() {
    const slideNumberElement = document.querySelector('[data-DIQ="slide-number"]') as HTMLElement;
    if (slideNumberElement) {
      slideNumberElement.textContent = (currentSlideIndex + 1).toString();
    }
  }
}

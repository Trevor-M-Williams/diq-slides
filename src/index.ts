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
  initConfidentialityNotices();
  initSlideButtons();
  initSlideNumbers();

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
  }

  function initConfidentialityNotices() {
    const placeholder = document.querySelector('.confidential');
    if (placeholder) placeholder.remove();

    slides.forEach((slide) => {
      const notice = document.createElement('div');
      notice.classList.add('confidential');
      notice.textContent = '*Confidential information. Not for distribution.';
      slide.appendChild(notice);
    });
  }

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

  function initSlideButtons() {
    const slideButtons = document.querySelectorAll('.slide-button');
    const prevButton = slideButtons[0] as HTMLButtonElement;
    const nextButton = slideButtons[1] as HTMLButtonElement;

    prevButton.addEventListener('click', () => {
      if (currentSlideIndex > 0) currentSlideIndex--;
      slidesWrapper.style.transform = `translateX(${currentSlideIndex * -100}vw)`;
    });

    nextButton.addEventListener('click', () => {
      if (currentSlideIndex < numSlides - 1) currentSlideIndex++;
      slidesWrapper.style.transform = `translateX(${currentSlideIndex * -100}vw)`;
    });
  }

  function initSlideNumbers() {
    const placeholder = document.querySelector('.slide-number');
    if (placeholder) placeholder.remove();

    slides.forEach((slide, index) => {
      const slideNumber = document.createElement('div');
      slideNumber.classList.add('slide-number');
      slideNumber.textContent = `${index + 1}`;
      slide.appendChild(slideNumber);
    });
  }
}

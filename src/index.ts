import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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

  async function downloadSlides() {
    const doc = new jsPDF({
      orientation: 'landscape',
    });

    for (let i = 0; i < numSlides; i++) {
      currentSlideIndex = i;
      slidesWrapper.style.transform = `translateX(${i * -100}vw)`;
      updateSlideNumber();
      await new Promise((resolve) => setTimeout(resolve, 500));

      const slide = slides[i] as HTMLElement;

      await html2canvas(slide).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        if (i > 0) {
          doc.addPage();
        }
        doc.addImage(imgData, 'JPEG', 10, 10, 280, 150);
      });
    }

    slidesWrapper.style.transform = `translateX(${currentSlideIndex * -100}vw)`;
    doc.save('slides.pdf');
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
    } else if (e.key === 'd') {
      e.preventDefault();
      downloadSlides();
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

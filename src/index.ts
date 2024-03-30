window.Webflow ||= [];
window.Webflow.push(() => {
  main();
});

function main() {
  console.log('Webflow loaded');

  let transformValue = 0;
  const slidesWrapper = document.querySelector('.slides-wrapper') as HTMLElement;
  const slides = document.querySelectorAll('.slides-wrapper .slide');

  if (!slidesWrapper) return;
  if (!slides.length) return;

  document.addEventListener('keydown', async function (event) {
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement) activeElement.blur();
    }, 0);

    const slidesCount = slides.length;
    const maxTransform = -(slidesCount - 1) * 100;

    if (event.key === 'ArrowRight' && transformValue > maxTransform) {
      event.preventDefault();
      transformValue -= 100;
    } else if (event.key === 'ArrowLeft' && transformValue < 0) {
      event.preventDefault();
      transformValue += 100;
    }

    slidesWrapper.style.transform = `translateX(${transformValue}vw)`;
  });
}

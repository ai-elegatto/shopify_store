document.addEventListener('DOMContentLoaded', function () {
  const isDesktop = () => window.innerWidth >= 1024;
  const items = document.querySelectorAll('.accordion-item');
  const desktopContainer = document.querySelector('.accordion-container-desktop');

  function closeAll() {
    items.forEach(item => item.classList.remove('active'));
  }

  function openAccordion(item) {
    closeAll();
    item.classList.add('active');
  }

  function updateDesktopContent() {
    const active = document.querySelector('.accordion-item.active');
    if (isDesktop() && desktopContainer && active) {

      const answer = active.querySelector('.accordion-answer-receive');
      if (answer) {
        desktopContainer.innerHTML = answer.innerHTML;

        desktopContainer.className = 'accordion-container-desktop';

        const typeDiv = answer.querySelector('div');
        if (typeDiv && typeDiv.className) {
          desktopContainer.classList.add(typeDiv.className);
        }
      }
    }
  }

  function handleClick(item) {
    if (isDesktop()) {
      openAccordion(item);
      updateDesktopContent();
    } else {
      const isActive = item.classList.contains('active');
      closeAll();
      if (!isActive) {
        item.classList.add('active');
      }
    }
  }


  items.forEach(item => {
    const title = item.querySelector('.accordion-title');
    title.addEventListener('click', function () {
      handleClick(item);

    });
  });


  function setInitialState() {
    closeAll();
    if (isDesktop()) {

      if (items.length > 0) {
        items[0].classList.add('active');
        updateDesktopContent();
      }
      if (desktopContainer) desktopContainer.style.display = 'flex';
      items.forEach(item => {
        item.querySelector('.accordion-answer-receive').style.display = 'none';
      });
    } else {

      if (desktopContainer) desktopContainer.style.display = 'none';
      items.forEach(item => {
        const answer = item.querySelector('.accordion-answer-receive');
        answer.style.display = 'none';
      });
    }
  }


  function updateMobileAnswers() {
    if (!isDesktop()) {
      items.forEach(item => {
        const answer = item.querySelector('.accordion-answer-receive');
        if (item.classList.contains('active')) {
          answer.style.display = 'flex';
        } else {
          answer.style.display = 'none';
        }
      });
    }
  }


  items.forEach(item => {
    const title = item.querySelector('.accordion-title');
    title.addEventListener('click', function () {
      if (!isDesktop()) {
        updateMobileAnswers();
      }
    });
  });

  setInitialState();


  let lastIsDesktop = isDesktop();
  window.addEventListener('resize', function () {
    const nowIsDesktop = isDesktop();
    if (nowIsDesktop !== lastIsDesktop) {
      setInitialState();
      lastIsDesktop = nowIsDesktop;
    }
  });
});
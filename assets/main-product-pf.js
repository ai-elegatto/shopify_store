document.addEventListener("DOMContentLoaded", function () {
  // Key Features Accordion
  const toggle = document.getElementById("key-features-toggle");
  const content = document.getElementById("key-features-content");
  const icon = toggle ? toggle.querySelector(".key-features-icon") : null;
  if (toggle && content && icon) {
    toggle.addEventListener("click", function () {
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", !isExpanded);
      content.setAttribute("aria-hidden", isExpanded);
      icon.textContent = !isExpanded ? "−" : "+";
    });
  }

  // Anchor Accordions
  document.querySelectorAll('.product-anchors .anchor-item').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();

      const target = anchor.getAttribute('data-target').trim();
      let targetElem = null;

      if (/^\d+$/.test(target)) {
        const index = parseInt(target, 10) - 1;
        targetElem = document.querySelector(`#accordion-wrapper .accordion-container .accordion-item[data-index="${index}"] .accordion-title`);
        if (!targetElem) return;

        if (!targetElem.parentElement.classList.contains('active')) {
          targetElem.click();
        }
        const rect = targetElem.parentElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        window.scrollTo({
          top: rect.top + scrollTop - 174,
          behavior: 'smooth'
        });
      } else {
        const idElem = document.querySelector(target);
        if (!idElem) return;

        const header = idElem.querySelector('.key-features-header');
        if (header && header.getAttribute('aria-expanded') === "false") {
          header.click();
        }

        const rect = idElem.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        window.scrollTo({
          top: rect.top + scrollTop - 174,
          behavior: 'smooth'
        });
      }
    });
  });

  // Size Options Toggle and Show Selected Size
  const sizeLabels = document.querySelectorAll(".size-options label.size-label-button");
  const sizeSelected = document.querySelector(".size-label .size-selected");

  sizeLabels.forEach((label) => {
    let fullText = label.textContent.trim();
    label.setAttribute("data-full-size", fullText);
  });

  // Rename Size Options (visual only)
  sizeLabels.forEach((label) => {
    let text = label.textContent.trim();
    let newText = text.split("(")[0].trim();
    const input = label.querySelector("input");
    label.textContent = "";
    if (input) label.appendChild(input);
    label.appendChild(document.createTextNode(" " + newText));
  });

  function updateSizeSelected(label) {
    if (sizeSelected && label) {
      sizeSelected.textContent = label.getAttribute("data-full-size") || "";
    }
  }
  if (sizeLabels.length > 0) {
    sizeLabels.forEach((label) => label.classList.remove("selected"));
    sizeLabels[0].classList.add("selected");
    updateSizeSelected(sizeLabels[0]);
  }
  sizeLabels.forEach((label) => {
    label.addEventListener("click", function () {
      sizeLabels.forEach((l) => l.classList.remove("selected"));
      this.classList.add("selected");
      updateSizeSelected(this);
    });
  });

  // Swiper Thumbs Gallery
  const mainImage = document.querySelector(".main-image");
  const thumbsSwiperContainer = document.querySelector(".product-thumbs-swiper");
  if (mainImage && thumbsSwiperContainer && typeof Swiper !== "undefined") {
    const thumbsSwiper = new Swiper(thumbsSwiperContainer, {
      slidesPerView: "auto",
      spaceBetween: 8,
      freeMode: true,
      watchSlidesProgress: true,
      scrollbar: {
        el: ".swiper-scrollbar",
        draggable: true,
        hide: false,
      },
    });
    const slides = thumbsSwiperContainer.querySelectorAll(".swiper-slide");
    if (slides.length > 0) {
      slides.forEach((s) => s.classList.remove("activated"));
      slides[0].classList.add("activated");
    }
    slides.forEach((slide, index) => {
      slide.addEventListener("click", () => {
        slides.forEach((s) => s.classList.remove("activated"));
        slide.classList.add("activated");
        const img = slide.querySelector("img");
        if (img) {
          const largeSrc = img.getAttribute("data-large-src");
          if (largeSrc) mainImage.src = largeSrc;
        }
        thumbsSwiper.slideTo(index);
      });
    });
  }

  // Review Swiper
  const reviewsSwiper = new Swiper(".swiper-container.review-highlight", {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
    },
    watchOverflow: true,
    noSwiping: false,
    breakpoints: {
      768: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
    },
    on: {
      slideChange: function () {
        const nextBtn = document.querySelector(".swiper-button-next");
        if (this.isEnd) {
          nextBtn.classList.add("disabled");
        } else {
          nextBtn.classList.remove("disabled");
        }
      },
    },
  });

  document.addEventListener("DOMContentLoaded", function () {
    reviewsSwiper.emit("slideChange");
  });

  // Gallery Modal
  const modal = document.getElementById("gallery-modal");
  const modalImage = modal ? modal.querySelector("#modal-main-image") : null;
  const currentIndexSpan = modal ? modal.querySelector(".current-index") : null;
  const totalImagesSpan = modal ? modal.querySelector(".total-images") : null;
  const productImages = [];
  document.querySelectorAll(".gallery-thumb").forEach((img) => {
    productImages.push(img.getAttribute("data-full-src") || img.src);
  });
  if (totalImagesSpan) totalImagesSpan.textContent = productImages.length;
  let currentIndex = 0;
  function openModal(index) {
    currentIndex = index;
    updateImage();
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }
  function updateImage() {
    if (modalImage) modalImage.src = productImages[currentIndex];
    if (currentIndexSpan) currentIndexSpan.textContent = currentIndex + 1;
  }
  function nextImage() {
    currentIndex = (currentIndex + 1) % productImages.length;
    updateImage();
  }
  function prevImage() {
    currentIndex = (currentIndex - 1 + productImages.length) % productImages.length;
    updateImage();
  }

  /* Drag Event img modal */
   let startX = 0;
   let startY = 0;
  modalImage.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    startY = e.clientY;

    const onMouseMove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
          runLTR(); // left to right
        } else {
          runRTL(); // right to left
        }
      }

      document.removeEventListener('mousemove', onMouseMove);
    };

    document.addEventListener('mousemove', onMouseMove);

    modalImage.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', onMouseMove);
    }, { once: true });
  });

  // 🎯 Replace these with your own logic
  function runLTR() { 
    const mediaBackBtn = document.querySelector("#gallery-modal .pswp__button.modal-prev");
    mediaBackBtn && mediaBackBtn.click()
   }
  function runRTL() { 
    const mediaBackBtn = document.querySelector("#gallery-modal .pswp__button.modal-next");
    mediaBackBtn && mediaBackBtn.click();
   }

  document.querySelectorAll(".gallery-thumb").forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      openModal(index);
    });
  });
  const mainImageMobile = document.querySelector(".main-image");
  if (mainImageMobile) {
    mainImageMobile.addEventListener("click", () => {
      openModal(0);
    });
  }
  if (modal) {
    modal.querySelector(".modal-close").addEventListener("click", closeModal);
    modal.querySelector(".modal-next").addEventListener("click", nextImage);
    modal.querySelector(".modal-prev").addEventListener("click", prevImage);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (modal.style.display === "flex") {
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "Escape") closeModal();
      }
    });
  }

  // Sticky add-to-cart
  const showcase = document.querySelector(".product-showcase-wrapper");
  const sticky = document.querySelector(".sticky-add-to-cart");
  const stickyForm = sticky ? sticky.querySelector("form") : null;
  const stickyInput = stickyForm ? stickyForm.querySelector('input[name="id"]') : null;
  const mainForm = document.querySelector(".product-form");
  const mainInputs = mainForm ? mainForm.querySelectorAll('input[name="id"]') : [];

  if (window.length >= 768) {
    return;
  }

  function selectFirstVariantIfNone() {
    if (!mainInputs.length) return;
    const checked = mainForm.querySelector('input[name="id"]:checked');
    if (!checked) {
      mainInputs[0].checked = true;
      mainInputs[0].dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function syncVariant() {
    if (!mainForm || !stickyInput) return;
    const checked = mainForm.querySelector('input[name="id"]:checked');
    if (checked) {
      stickyInput.value = checked.value;
    }
  }

  mainInputs.forEach((input) => {
    input.addEventListener("change", syncVariant);
  });

  selectFirstVariantIfNone();
  syncVariant();

  function handleScroll() {
    if (!showcase || !sticky) return;
    const rect = showcase.getBoundingClientRect();
    const isBelow = rect.bottom < window.innerHeight - 60;
    if (isBelow) {
      sticky.style.display = "flex";
    } else {
      sticky.style.display = "none";
    }
  }

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll);

  if (stickyForm) {
    stickyForm.addEventListener("submit", function (e) {
      if (!stickyInput.value) {
        e.preventDefault();
        // Optionally, show a user-friendly message here
      }
    });
  }

  handleScroll();

  // Show anchor on scroll
  var anchors = document.querySelector(".product-anchors");
  if (!anchors) return;

  function handleAnchorsVisibility() {
    if (window.scrollY > 0) {
      anchors.classList.add("visible");
    } else {
      anchors.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", handleAnchorsVisibility);
  handleAnchorsVisibility();

  // Okendo
  function moveWriteReviewButton() {
    const writeReviewBtn = document.querySelector('.okeReviews-reviewsWidget-header-controls-writeReview');
    const sortContainer = document.querySelector('.okeReviews-reviews-controls-sort');
    if (writeReviewBtn && sortContainer) {
      if (!sortContainer.contains(writeReviewBtn)) {
        sortContainer.appendChild(writeReviewBtn);
      }
      return true;
    }
    return false;
  }

  function moveReviewDates() {
    document.querySelectorAll('.okeReviews-review').forEach(function (review) {
      const date = review.querySelector('.okeReviews-review-date');
      const details = review.querySelector('.okeReviews-review-reviewer-profile-details-inner');
      if (date && details && !details.contains(date)) {
        if (details.children.length > 1) {
          details.insertBefore(date, details.children[1]);
        } else {
          details.appendChild(date);
        }
      }
    });
  }

  function injectSortByWrapper() {
    const selectContainer = document.querySelector('.okeReviews-reviews-controls-select');
    if (selectContainer && !selectContainer.querySelector('.sort-by-wrapper')) {
      const sortByHTML = `
      <div class="sort-by-wrapper">
        <div class="sort-by-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
            <path d="M12 5.08984L20 5.08984M4 19.0898L7 19.0898M4 5.08984L8 5.08984M11 19.0898L20 19.0898M17 12.0898L20 12.0898M4 12.0898L13 12.0898" stroke="#707070" stroke-linecap="round"/>
            <path d="M8 5.08984C8 6.19441 8.89543 7.08984 10 7.08984C11.1046 7.08984 12 6.19441 12 5.08984C12 3.98527 11.1046 3.08984 10 3.08984C8.89543 3.08984 8 3.98527 8 5.08984Z" stroke="#707070" stroke-linecap="round"/>
            <path d="M13 12.0898C13 13.1944 13.8954 14.0898 15 14.0898C16.1046 14.0898 17 13.1944 17 12.0898C17 10.9853 16.1046 10.0898 15 10.0898C13.8954 10.0898 13 10.9853 13 12.0898Z" stroke="#707070" stroke-linecap="round"/>
            <path d="M7 19.0898C7 20.1944 7.89543 21.0898 9 21.0898C10.1046 21.0898 11 20.1944 11 19.0898C11 17.9853 10.1046 17.0898 9 17.0898C7.89543 17.0898 7 17.9853 7 19.0898Z" stroke="#707070" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="sort-by-title">
          Show by
        </div>
      </div>
    `;
      selectContainer.insertAdjacentHTML('afterbegin', sortByHTML);
      return true;
    }
    return false;
  }

  const okendoWidgetContainer = document.getElementById('shopify-product-reviews-eo');
  if (okendoWidgetContainer) {
    const observer = new MutationObserver(() => {
      moveWriteReviewButton();
      moveReviewDates();
      injectSortByWrapper();
    });

    observer.observe(okendoWidgetContainer, {
      childList: true,
      subtree: true,
    });

    moveWriteReviewButton();
    moveReviewDates();
    injectSortByWrapper();
  }

  // Swiper for mobile (if needed)
  function isMobile() {
    return window.innerWidth < 1024;
  }

  function createMobileSwiper() {
    if (document.querySelector('.rebuy-swiper-mobile')) return;
    var splide = document.getElementById('splide02');
    if (!splide) return;
    var swiperContainer = document.createElement('div');
    swiperContainer.className = 'rebuy-swiper-mobile';
    swiperContainer.style.display = 'none';
    swiperContainer.innerHTML = `
      <div class="swiper">
        <div class="swiper-wrapper"></div>
        <div class="swiper-scrollbar"></div>
      </div>
    `;
    splide.parentNode.insertBefore(swiperContainer, splide.nextSibling);
    var slides = splide.querySelectorAll('.rebuy-product-block');
    var swiperWrapper = swiperContainer.querySelector('.swiper-wrapper');
    slides.forEach(function (slide) {
      var clone = slide.cloneNode(true);
      clone.classList.remove('splide__slide', 'rebuy-carousel__slide', 'is-active', 'is-visible', 'is-next');
      clone.classList.add('swiper-slide');
      swiperWrapper.appendChild(clone);
    });
  }

  function showSwiperIfMobile() {
    var splide = document.getElementById('splide02');
    var swiperContainer = document.querySelector('.rebuy-swiper-mobile');
    if (!splide || !swiperContainer) return;
    if (isMobile()) {
      splide.style.display = 'none';
      swiperContainer.style.display = 'block';
      if (!swiperContainer.dataset.inited) {
        new Swiper('.rebuy-swiper-mobile .swiper', {
          slidesPerView: 2,
          spaceBetween: 16,
          scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true,
          },
        });
        swiperContainer.dataset.inited = "1";
      }
    } else {
      splide.style.display = '';
      swiperContainer.style.display = 'none';
    }
  }

  createMobileSwiper();
  showSwiperIfMobile();
  window.addEventListener('resize', function () {
    showSwiperIfMobile();
  });

});
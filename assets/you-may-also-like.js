document.addEventListener('DOMContentLoaded', function () {
  new Swiper('.you-may-also-like__swiper', {
    slidesPerView: 2.1,
    spaceBetween: 8,
    navigation: {
      nextEl: '.you-may-also-like__nav-next',
      prevEl: '.you-may-also-like__nav-prev',
    },
    pagination: false,
    scrollbar: false,
    breakpoints: {
      768: {
        slidesPerView: 3,
        spaceBetween: 8,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 24,
      }
    }
  });

  document.querySelectorAll('.smallcaps.text-xxs.text-subdued').forEach(function (el) {
    el.textContent = el.textContent.replace(/[()]/g, '');
  });

});
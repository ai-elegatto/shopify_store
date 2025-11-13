document.addEventListener('DOMContentLoaded', function() {
    function initSwiper() {
      if (window.innerWidth >= 768) {
        const swiper = new Swiper('.our-collections__swiper', {
          slidesPerView: 4,
          spaceBetween: 0,
          navigation: {
            nextEl: '.our-collections__wrapper .our-collections__nav-next',
            prevEl: '.our-collections__wrapper .our-collections__nav-prev',
          },
          pagination: false,
          scrollbar: false,
          breakpoints: {
            768: {
              slidesPerView: 3,
              spaceBetween: 0,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 0,
            }
          }
        });
      }
    }

    initSwiper();
    window.addEventListener('resize', initSwiper);
  });
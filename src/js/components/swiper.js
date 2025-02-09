import Swiper, {
  Pagination,
  Navigation,
  FreeMode
} from 'swiper';

Swiper.use([Pagination, Navigation]);

const swiperBrands = new Swiper('.swiper-brands', {
  slidesPerView: 1,
  spaceBetween: 10,
  slidesPerView: 1,
  loop: true,
  pagination: {
    el: '.swiper-brands-box__pagination',
    clickable: true,
    dynamicBullets: true,
    dynamicMainBullets: 3,
  },
});

const swiperPromo = new Swiper('.swiper-promo', {
  spaceBetween: 10,
  slidesPerView: 1,
  navigation: {
    prevEl: '.swiper-promo__prev',
    nextEl: '.swiper-promo__next',
    clickable: true,
  },
  pagination: {
    el: '.swiper-promo__pagination',
    clickable: true,
    dynamicBullets: true,
    dynamicMainBullets: 3,
  },
});

window.addEventListener('DOMContentLoaded', () => {

  const resizableSwiper = (breakpoint, swiperClass, swiperSettings, callback) => {
    let swiper;

    breakpoint = window.matchMedia(breakpoint);

    const enableSwiper = function (className, settings) {
      swiper = new Swiper(className, settings);

      if (callback) {
        callback(swiper);
      }
    }

    const checker = function () {
      if (breakpoint.matches) {
        return enableSwiper(swiperClass, swiperSettings);
      } else {
        if (swiper !== undefined) swiper.destroy(true, true);
        return;
      }
    };

    breakpoint.addEventListener('change', checker);
    checker();
  }

  // const someFunc = (instance) => {
  //   if (instance) {
  //     instance.on('slideChange', function (e) {
  //       console.log('dsf')
  //     });
  //   }
  // };

  if (document.querySelector('.swiper-catalog')) {
    resizableSwiper(
      '(max-width: 576px)',
      '.swiper-catalog', {
        // spaceBetween: 10,
        slidesPerView: 1,
        pagination: {
          el: '.swiper-catalog__pagination',
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 2,
        },
      },
    );
  }

  if(document.querySelector('.swiper-catalog-watched')) {
    resizableSwiper(
      '(max-width: 576px)',
      '.swiper-catalog-watched', {
        // spaceBetween: 10,
        slidesPerView: 1,
        pagination: {
          el: '.swiper-catalog-watched__pagination',
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 2,
        },
      },
    );
  }

  // resizableSwiper(
  //   '(min-width: 320px)',
  //   '.swiper-promo', {
  //     spaceBetween: 10,
  //     slidesPerView: 1,
  //     navigation: {
  //       prevEl: '.swiper-promo__prev',
  //       nextEl: '.swiper-promo__next',
  //       clickable: true,
  //     },
  //     pagination: {
  //       el: '.swiper-promo__pagination',
  //       clickable: true,
  //       dynamicBullets: true,
  //       dynamicMainBullets: 3,
  //     },
  //   },
  // );

  // resizableSwiper(
  //   '(min-width: 320px)',
  //   '.swiper-brands', {
  //     spaceBetween: 10,
  //     slidesPerView: 1,
  //     loop: true,
  //     pagination: {
  //       el: '.swiper-brands__pagination',
  //       clickable: true,
  //       dynamicBullets: true,
  //       dynamicMainBullets: 3,
  //     },
  //   },
  // );
});

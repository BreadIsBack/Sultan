const showMore = document.querySelector('.catalog-content__btn-more');
const cardsLength = document.querySelectorAll('.catalog-content__label--producer').length;
let items = 4;

// const { compileString } = require("sass");


if (showMore) {


  showMore.addEventListener('click', (evt) => {
    evt.preventDefault();
    items += 2;
    const array = Array.from(document.querySelector('.catalog-content__checkbox-wrapper').children);
    const visItems = array.slice(0, items);

    visItems.forEach(el => el.classList.add('is-shown'));

    if (visItems.length === cardsLength) {
      showMore.style.cursor = 'not-allowed';
      showMore.disabled = true;
    }
  });
}



// function showMore(itemClass, btnClass, counter) {

//   itemsNeededLength = 0;
//   const btn = document.querySelector(btnClass);
//   const itemsLength = document.querySelectorAll(itemClass).length;

//   btn.addEventListener('click', (evt) => {
//     evt.preventDefault();
//     itemsNeededLength += counter;
//     const array = Array.from(document.querySelector('.catalog-content__checkbox-wrapper').children);
//     const visItems = array.slice(0, itemsNeededLength);

//     visItems.forEach(el => el.classList.add('is-shown'));

//     if (visItems.length === itemsLength) {
//       btn.style.cursor = 'not-allowed';
//       btn.disabled = true;
//     }
//   })
// }

// showMore('.catalog-content__label--producer', '.catalog-content__btn-more--producer', 2);
// showMore('.catalog-content__label--brand', '.catalog-content__btn-more--brand', 2);


// Количество показываемых карточек при первом рендере
const COUNT_SHOW_CARDS_CLICK = 8;

const ERROR_SERVER = 'Ошибка сервера, попробуйте позже!';
const NO_PRODUCTS_IN_THIS_CATEGORY = 'Товаров в этой категории нет!';
const PRODUCT_INFORMATION_NOT_FOUND = 'Информация о товаре не найдена!';
const NO_ITEMS_CART = 'В корзине нет товаров!';

function showErrorMessage(message) {
  const h1 = document.querySelector('.wrapper h1')
  const msg =
      `<div class="error">
          <p>${message}</p>
          <p><a href="/">Перейти к списку товаров!</a></p>
      </div>`;
  h1.insertAdjacentHTML('afterend', msg);
}

function getBasketLocalStorage() {
  const cartDataJSON = localStorage.getItem('basket');
  return cartDataJSON ? JSON.parse(cartDataJSON) : [];
}

function setBasketLocalStorage(basket) {
  const basketCount = document.querySelector('.cart__counter');
  localStorage.setItem('basket', JSON.stringify(basket));
  basketCount.textContent = basket.length;
}

function checkingRelevanceValueBasket(productsData) {
  const basket = getBasketLocalStorage();

  basket.forEach((basketId, index) => {
      const existsInProducts = productsData.some(item => item.id === Number(basketId));
      if (!existsInProducts) {
          basket.splice(index, 1);
      }
  });

  setBasketLocalStorage(basket);
}


const cards = document.querySelectorAll('.swiper-catalog__slide');
const catalogCards = document.querySelector('.catalog-content__products-items');
const catalog = document.querySelector('[data-catalog]');
const catalogPromo = document.querySelectorAll('[data-promo]');
const catalogSimilar = document.querySelectorAll('[data-similar]');
const catalogWatched = document.querySelectorAll('[data-watched]');

let shownCards = COUNT_SHOW_CARDS_CLICK;
let productsData = [];

getProducts();

cards.forEach(item => {
  item.addEventListener('click', handleCardClick);
})

if (catalogCards) {
  catalogCards.addEventListener('click', handleCardClick);
}

async function getProducts() {

  try {

    if (!productsData.length) {
      const res = await fetch('../card.json');
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      productsData = await res.json();
    }

    renderStartPage(productsData);

  } catch (err) {
    // showErrorMessage(ERROR_SERVER);
    console.log(err);
  }
}

function renderStartPage(data) {
  if (!data || !data.length) {
    // showErrorMessage(NO_PRODUCTS_IN_THIS_CATEGORY);
    console.log('Error')
    return
  };

  const arrCards = data.slice(0, COUNT_SHOW_CARDS_CLICK);
  createCards(arrCards);

  checkingRelevanceValueBasket(data);

  const basket = getBasketLocalStorage();
  chekingActiveButtons(basket);
}

function createCards(data) {
  let cardsArray = []; //создаю общий массив карт
  data.forEach(card => {
    const {
      id,
      img,
      size,
      title,
      titleText,
      code,
      codeNumber,
      producer,
      producerName,
      brand,
      brandName,
      price,
      dataAttr,
    } = card;

    const cardItem =
      `
    <article class="catalog-item" data-attr="${dataAttr}" data-product-id="${id}">
    <a href="/product-card.html?id=${id}" class="catalog-item__link">
      <picture>
        <source srcset="img/catalog/desktop/${img}.webp" type="image/webp">
        <source srcset="./img/catalog/mobile/${img}.png" media="(max-width: 576px)">
        <img loading="lazy" src="img/catalog/desktop/${img}.png" class="image catalog-item__img"
          alt="${title} ${titleText}">
      </picture>
    </a>
    <p class="catalog-item__size item-size">${size}</p>
    <a href="/product-card.html?id=${id}" class="item-link catalog-item__text-link">
      <p class="item-link__text"><span class="item-link__word">${title} </span>${titleText}</p>
    </a>
    <ul class="catalog-item__descr-list item-descr list-reset">
      <li class="item-descr__item">
        <p class="item-descr__name">${code}</p>
        <p class="item-descr__value">${codeNumber}</p>
      </li>
      <li class="item-descr__item">
        <p class="item-descr__name">${producer}</p>
        <p class="item-descr__value">${producerName}</p>
      </li>
      <li class="item-descr__item">
        <p class="item-descr__name">${brand}</p>
        <p class="item-descr__value">${brandName}</p>
      </li>
    </ul>
    <div class="catalog-item__price-box">
      <span class="catalog-item__price-value">${price}</span>
      <button class="catalog-item__btn btn btn-reset">В корзину</button>
    </div>
  </article>
          `

          if (catalog) {
            cardsArray.push(cardItem)
            catalog.insertAdjacentHTML('beforeend', cardItem);
          }
    cardsArray.push(cardItem)

  });

  let counter = 0;
  catalogPromo.forEach(item => {
    item.insertAdjacentHTML('beforeend', cardsArray[counter])
    counter++;
  })

  catalogSimilar.forEach(item => {
    item.insertAdjacentHTML('beforeend', cardsArray[counter])
    counter++;
  })

  catalogWatched.forEach(item => {
    item.insertAdjacentHTML('beforeend', cardsArray[counter])
    counter++;
  })
}


function handleCardClick (event) {
  const targetButton = event.target.closest('.catalog-item__btn');

  if (!targetButton) {
    return;
  }

  const card = targetButton.closest('.catalog-item');
  const id = card.dataset.productId;
  const basket = getBasketLocalStorage();

  if (basket.includes(id)) {
    return;
  }

  basket.push(id);
  setBasketLocalStorage(basket);
  chekingActiveButtons(basket);
}

function chekingActiveButtons (basket) {
  const buttons = document.querySelectorAll('.catalog-item__btn');

  buttons.forEach(btn => {
    const card = btn.closest('.catalog-item');
    const id = card.dataset.productId;
    const isInBasket = basket.includes(id);

    btn.disabled = isInBasket;
    btn.classList.toggle('active', isInBasket);
    btn.textContent = isInBasket ? 'В корзине' : 'В корзину';
  });
}


// рендер карточки в корзине

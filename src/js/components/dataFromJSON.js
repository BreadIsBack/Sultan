const ERROR_SERVER = 'Ошибка сервера, попробуйте позже!';
const NO_PRODUCTS_IN_THIS_CATEGORY = 'Товаров в этой категории нет!';
const PRODUCT_INFORMATION_NOT_FOUND = 'Информация о товаре не найдена!';
const NO_ITEMS_CART = 'В корзине нет товаров!';

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
    const existsInProducts = productsData.some(item => item.id == Number(basketId));

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
const basketList = document.querySelector('.basket__list');
const aboutItem = document.querySelector('.item-wrapper');
const orderList = document.querySelector('.order__cart-list');

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
      const res = await fetch('./card.json');
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

  const arrCards = data.slice();
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
    <a href="product-card.html?id=${id}" class="catalog-item__link">
      <picture>
        <source srcset="img/catalog/desktop/${img}.webp" type="image/webp">
        <source srcset="./img/catalog/mobile/${img}.png" media="(max-width: 576px)">
        <img loading="lazy" src="img/catalog/desktop/${img}.png" class="image catalog-item__img"
          alt="${title} ${titleText}">
      </picture>
    </a>
    <p class="catalog-item__size item-size">${size}</p>
    <a href="product-card.html?id=${id}" class="item-link catalog-item__text-link link">
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
      <button class="catalog-item__btn btn btn-reset btn-to-cart">В корзину</button>
    </div>
  </article>
          `

    if (catalog) {
      catalog.insertAdjacentHTML('beforeend', cardItem);
    }
    cardsArray.push(cardItem)

  });

  function insertArray(array) {
    array.forEach((item, index) => {
      item.insertAdjacentHTML('beforeend', cardsArray[index])
    })
  }

  insertArray(catalogPromo);
  insertArray(catalogSimilar);
  insertArray(catalogWatched);
}

function handleCardClick(event) {
  const targetButton = event.target.closest('.btn-to-cart');

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

function chekingActiveButtons(basket) {
  const buttons = document.querySelectorAll('.btn-to-cart');

  buttons.forEach(btn => {
    const card = btn.closest('.catalog-item');
    const id = card.dataset.productId;
    const isInBasket = basket.includes(id);

    btn.disabled = isInBasket;
    btn.classList.toggle('active', isInBasket);
    btn.textContent = isInBasket ? 'В корзине' : 'В корзину';
  });
}

// Рендер карточки в корзине

getProductsInfo();

async function getProductsInfo() {

  try {

    if (!productsData.length) {
      const res = await fetch('./card.json');
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      productsData = await res.json();
    }

    loadProductDetails(productsData);

  } catch (err) {
    // showErrorMessage(ERROR_SERVER);
    console.log(err);
  }
}

function getParematerFromURL(parameter) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(parameter);
}

function loadProductDetails(data) {
  if (!data || !data.length) {
    console.log('Error')
    return
  }

  checkingRelevanceValueBasket(data);

  const productId = Number(getParematerFromURL('id'));

  if (!productId) {
    console.log('Error');
    return;
  }

  const findProduct = data.find(card => card.id == productId); // == потому что в JSONe id в кавычках

  if (!findProduct) {
    console.log('Error');
    return
  }

  renderInfoProduct(findProduct);

}

function renderInfoProduct(product) {
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
  } = product;

  const productItem =
    `
    <div class="item-wrapper__img-box">
    <picture>
      <source srcset="img/catalog/desktop/${img}.webp" type="image/webp">
      <img loading="lazy" src="img/catalog/desktop/${img}.png" class="image item-wrapper__img" width="664" height="300" alt="${title} ${titleText}">
    </picture>
  </div>
  <div class="item-wrapper__content">
    <span class="item-wrapper__stock">В наличии</span>
    <a class="item-link">
      <p class="item-link__text item-wrapper__text"><span class="item-link__word item-wrapper__word">${title} </span>${titleText}</p>
    </a>
    <p class="item-wrapper__size item-size item-size--stock">${size}</p>
    <div class="item-wrapper__price-content">
      <span class="item-wrapper__price">${price}</span>
      <div class="item-wrapper__price-btns">
        <button class="item-wrapper__btn btn-reset item-wrapper__btn--min">-</button>
        <span class="item-wrapper__counter">1</span>
        <button class="item-wrapper__btn btn-reset item-wrapper__btn--max">+</button>
      </div>
      <button class="item-wrapper__btn-action btn btn-reset btn-to-cart">В корзину</button>
    </div>
    <div class="item-wrapper__info">
      <a href="#" class="item-wrapper__info-link">
        <svg class="item-wrapper__info-svg">
          <use xlink:href="img/sprite.svg#link-g"></use>
        </svg>
      </a>
      <p class="item-wrapper__info-text">
        При покупке от <span class="item-wrapper__info-price">${price}</span>бесплатная доставка по Кокчетаву и области
      </p>
      <button class="item-wrapper__link-price btn-reset" data-graph-path="modal-price">Прайс-лист
        <svg class="item-wrapper__link-svg">
          <use xlink:href="img/sprite.svg#download"></use>
        </svg>
      </button>
    </div>
    <ul class="item-wrapper__descr-list item-descr list-reset">
      <li class="item-descr__item">
        <p class="item-descr__name">${producer}</p>
        <p class="item-descr__value">${producerName}</p>
      </li>
      <li class="item-descr__item">
        <p class="item-descr__name">${brand}</p>
        <p class="item-descr__value">${brandName}</p>
      </li>
      <li class="item-descr__item">
        <p class="item-descr__name">Артикул:</p>
        <p class="item-descr__value">460404</p>
      </li>
      <li class="item-descr__item">
        <p class="item-descr__name">Кол-во в коробке:</p>
        <p class="item-descr__value">2</p>
      </li>
      <li class="item-descr__item">
        <p class="item-descr__name">${code}</p>
        <p class="item-descr__value">${codeNumber}</p>
      </li>
      <li class="item-descr__item">
        <p class="item-descr__name">Размеры коробки(Д*Ш*В):</p>
        <p class="item-descr__value">10х10х10</p>
      </li>
      <li class="item-descr__item">
        <p class="item-descr__name">Вес коробки:</p>
        <p class="item-descr__value">1020 г</p>
      </li>
    </ul>
    <ul class="item-wrapper__accordion-list list-reset">
      <li class="item-wrapper__accordion-item">
        <button class="item-wrapper__accordion-btn btn-reset">
          <p class="item-wrapper__accordion-descr">Описание</p>
          <svg class="item-wrapper__accordion-svg">
            <use xlink:href="img/sprite.svg#arrow"></use>
          </svg>
        </button>
        <div class="item-wrapper__accordion-content">
          <p class="item-wrapper__accordion-text">
            Эффективно удаляет пятна от растительных масел и жира, фруктовых соков, следов от дезодоранта, а также белковые пятна (в том числе пятна крови, яиц, молока) благодаря специальной формуле, обогащенной биоэнзимами
          </p>
        </div>
      </li>
      <li class="item-wrapper__accordion-item">
        <button class="item-wrapper__accordion-btn btn-reset">
          <p class="item-wrapper__accordion-descr">Характеристики</p>
          <svg class="item-wrapper__accordion-svg">
            <use xlink:href="img/sprite.svg#arrow"></use>
          </svg>
        </button>
        <div class="item-wrapper__accordion-content">
          <div class="item-wrapper__accordion-wrapper">
            <ul class="item-wrapper__descr-list item-descr list-reset">
              <li class="item-descr__item">
                <p class="item-descr__name">Назначение:</p>
                <p class="item-descr__value">BioMio</p>
              </li>
              <li class="item-descr__item">
                <p class="item-descr__name">Тип:</p>
                <p class="item-descr__value">BioMio</p>
              </li>
              <li class="item-descr__item">
                <p class="item-descr__name">Производитель:</p>
                <p class="item-descr__value">460404</p>
              </li>
              <li class="item-descr__item">
                <p class="item-descr__name">Бренд:</p>
                <p class="item-descr__value">4604049097548</p>
              </li>
              <li class="item-descr__item">
                <p class="item-descr__name">Артикул:</p>
                <p class="item-descr__value">4604049097548</p>
              </li>
              <li class="item-descr__item">
                <p class="item-descr__name">Штрихкод:</p>
                <p class="item-descr__value">4604049097548</p>
              </li>
              <li class="item-descr__item">
                <p class="item-descr__name">Вес:</p>
                <p class="item-descr__value">90 г</p>
              </li>
              <li class="item-descr__item">
                <p class="item-descr__name">Объем:</p>
                <p class="item-descr__value">90 г</p>
              </li>
              <li class="item-descr__item">
                <p class="item-descr__name">Кол-во в коробке:</p>
                <p class="item-descr__value">90 г</p>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>
        `


  aboutItem.insertAdjacentHTML('beforeend', productItem);


}

getProductsCart();
if (basketList) {
  basketList.addEventListener('click', delProductBasket);
}

if (orderList) {
  orderList.addEventListener('click', delProductBasket);
}

function delProductBasket(event) {
  const targetButton = event.target.closest('.catalog-item__btn--delete');

  if (!targetButton) {
    return;
  }

  const card = targetButton.closest('.catalog-item');
  const id = card.dataset.productId;
  const basket = getBasketLocalStorage();
  const newBasket = basket.filter(item => item !== id);
  setBasketLocalStorage(newBasket);

  getProductsCart();

}


async function getProductsCart() {

  try {

    if (!productsData.length) {
      const res = await fetch('./card.json');
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      productsData = await res.json();
    }

    loadProductBasket(productsData);
    loadProductBasketOrder(productsData); //

  } catch (err) {
    console.log(err);
  }
}

function loadProductBasket(data) {

  if (basketList) {
    basketList.textContent = '';
  }

  if (!data || !data.length) {
    console.log('Error');
    return;
  }

  checkingRelevanceValueBasket(data);
  const basket = getBasketLocalStorage();

  if (!basket || !basket.length) {
    console.log('Error');
    return;
  }

  const findProducts = data.filter(item => basket.includes(String(item.id)));
  if (!findProducts.length) {
    console.log('Error');
    return;
  }

  renderProductsBasket(findProducts);
}

function loadProductBasketOrder(data) { //

  if (orderList) {
    orderList.textContent = '';
  }

  if (!data || !data.length) {
    console.log('Error');
    return;
  }

  checkingRelevanceValueBasket(data);
  const basket = getBasketLocalStorage();

  if (!basket || !basket.length) {
    console.log('Error');
    return;
  }

  const findProducts = data.filter(item => basket.includes(String(item.id)));
  if (!findProducts.length) {
    console.log('Error');
    return;
  }

  renderProductsBasketOrder(findProducts);
}

function renderProductsBasketOrder(arr) {
  arr.forEach(card => {
    const {
      id,
      img,
      size,
      title,
      titleText,
      price,
      dataAttr,
      description,
    } = card;

    const cardItem =
      `
    <article class="catalog-item" data-product-id="${id}">
    <a href="product-card.html?id=${id}" class="catalog-item__link link">
      <picture>
        <source srcset="img/catalog/desktop/${img}.webp" type="image/webp">
        <source srcset="./img/catalog/mobile/${img}.png" media="(max-width: 576px)">
        <img loading="lazy" src="img/catalog/desktop/${img}.png" class="image catalog-item__img"
          alt="${title} ${titleText}">
      </picture>
    </a>
    <div class="catalog-item__basket-box">
    <p class="catalog-item__size item-size">${size}</p>
    <a href="product-card.html?id=${id}" class="item-link catalog-item__text-link">
    <p class="item-link__text"><span class="item-link__word">${title} </span>${titleText}</p>
    </a>
    <div class="catalog-item__price-box">
      <span class="catalog-item__price-value">${price}</span>
      <button class="catalog-item__btn catalog-item__btn--delete btn btn-reset">Удалить</button>
    </div>
    </div>
  </article>
          `
    if (orderList) {
      orderList.insertAdjacentHTML('beforeend', cardItem);
    }

  });
}


function renderProductsBasket(arr) {
  arr.forEach(card => {
    const {
      id,
      img,
      size,
      title,
      titleText,
      price,
      dataAttr,
      description,
    } = card;

    const cardItem =
      `
    <article class="catalog-item" data-attr="${dataAttr}" data-product-id="${id}">
    <a href="product-card.html?id=${id}" class="catalog-item__link">
      <picture>
        <source srcset="img/catalog/desktop/${img}.webp" type="image/webp">
        <source srcset="./img/catalog/mobile/${img}.png" media="(max-width: 576px)">
        <img loading="lazy" src="img/catalog/desktop/${img}.png" class="image catalog-item__img"
          alt="${title} ${titleText}">
      </picture>
    </a>
    <div class="catalog-item__basket-box">
    <p class="catalog-item__size item-size">${size}</p>
    <a href="product-card.html?id=${id}" class="item-link catalog-item__text-link link">
    <p class="item-link__text"><span class="item-link__word">${title} </span>${titleText}</p>
    </a>
    <p class="catalog-item__description">${description}</p>
    </div>
    <div class="catalog-item__price-box">
      <span class="catalog-item__price-value">${price}</span>
      <button class="catalog-item__btn catalog-item__btn--delete btn btn-reset">Удалить</button>
    </div>
  </article>
          `

        if (basketList) {
          basketList.insertAdjacentHTML('beforeend', cardItem);
        }

  });
}

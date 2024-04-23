// let productsData = [];

// getProducts();

// function renderStartPage(data) {
//   if (!data || data.length) {
//     console.log('Error');
//     return
//   };

//   const arrCards = data.slice(0, 4);
//   createCards(arrCards);
// }

// async function getProducts () {

//   try {

//     if (!productsData.length) {
//       const result = await fetch('../card.json');
//       if (!result.ok) {
//         throw new Error (result.statusText);
//       }
//       productsData = await result.json();
//     }

//     renderStartPage(productsData);

//   } catch(err) {
//     console.log(err);
//   }
// }


// function createCards(data) {
//   data.forEach(card => {
//       const { id, img, title, price, discount } = card;
//       const priceDiscount = price - ((price * discount) / 100);
//   const cardItem =
//     `
//               <div class="card" data-product-id="${id}">
//                   <div class="card__top">
//                       <a href="/card.html?id=${id}" class="card__image">
//                           <img
//                               src="./images/${img}"
//                               alt="${title}"
//                           />
//                       </a>
//                       <div class="card__label">-${discount}%</div>
//                   </div>
//                   <div class="card__bottom">
//                       <div class="card__prices">
//                           <div class="card__price card__price--discount">${priceDiscount}</div>
//                           <div class="card__price card__price--common">${price}</div>
//                       </div>
//                       <a href="/card.html?id=${id}" class="card__title">${title}</a>
//                       <button class="card__add">В корзину</button>
//                   </div>
//               </div>
//           `
//       cards.insertAdjacentHTML('beforeend', cardItem);
// });
// }

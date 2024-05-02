const buttons = document.querySelectorAll('.catalog-content__btn-more');
const fieldset = document.querySelectorAll('.catalog-content__fieldset')


fieldset.forEach(field => {
  field.addEventListener('click', handleCardClick);
})

buttons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
  })
})

function handleCardClick(event) {
  const targetButton = event.target.closest('.catalog-content__btn-more');

  if (!targetButton) {
    return;
  }

  const fieldset = targetButton.closest('.catalog-content__fieldset');
  let wrapper;
  for (field of fieldset.children) {
    if (field.className === 'catalog-content__checkbox-wrapper') {
      wrapper = field;
    }
  }

  const array = Array.from(wrapper.children);
  const visItems = array.slice();

  visItems.forEach(el => el.classList.add('is-shown'));

  if (visItems.length === array.length) {
    targetButton.style.cursor = 'not-allowed';
    targetButton.disabled = true;
  }

}

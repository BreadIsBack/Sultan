const pageWidth = document.documentElement.scrollWidth;
const pageMap = document.getElementById('map');
let center = [53.27583976994932,69.39361160841351];
let mark = [53.268372261027714,69.40749902513113];

if (pageMap) {

  function init() {
    let map = new ymaps.Map('map', {
      center: center,
      zoom: 17
    });

    map.panTo([53.26930096947917,69.40743898781825], {
      delay: 1500
  });

    let placemark = new ymaps.Placemark(mark, {}, {
      iconLayout: 'default#image',
      iconImageHref: '../img/placemark.png',
      icomImageSize: [20, 20],
      iconImageOffset: [0, 0],
    });

    map.controls.remove('geolocationControl'); // удаляем геолокацию
    map.controls.remove('searchControl'); // удаляем поиск
    map.controls.remove('trafficControl'); // удаляем контроль трафика
    map.controls.remove('typeSelector'); // удаляем тип
    map.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
    map.controls.remove('zoomControl'); // удаляем контрол зуммирования
    map.controls.remove('rulerControl'); // удаляем контрол правил
    map.behaviors.disable(['scrollZoom']); // отключаем скролл карты (опционально)

    map.geoObjects.add(placemark);
  }

  ymaps.ready(init);


}

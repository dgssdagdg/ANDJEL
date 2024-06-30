let sortType = 'По цене (убыванию)';
let ProdyctType = 'Phone';
document.addEventListener('click', function(e) {
    // Работа с бургер меню-------------------------------------------------------------------------
    let menuBtn = document.querySelector('.menu-btn');
    let menu = document.querySelector('.menu');
    const html = document.documentElement;
    if(e.target.closest('.menu-btn')) {
        menuBtn.classList.toggle('active');
        menu.classList.toggle('active');
        html.classList.toggle('_overflow');
    } else if(e.target.closest('.menu') && !e.target.closest('.menu-row')) {
        menuBtn.classList.remove('active');
        menu.classList.remove('active');
        html.classList.remove('_overflow');
    };

    //Работа с Открытием фильтра---------------------------------------------------
    if(e.target.closest('._hidden-open')) {
      let hiddenItem = e.target.closest('._hidden-open').parentNode.querySelector('._hidden');
      let hiddenItemParent = e.target.closest('._hidden-open');
      hiddenItemParent.classList.toggle('_hidden-active-arrow')
      hiddenItem.classList.toggle('_hidden-active')
    };

    //Работа с select для открытие и выбора-----------------------------------------------
    let selects = document.querySelector('.catalog-rigth-selects');
    if(e.target.closest('.catalog-rigth-select') || selects.classList.contains('_select-open') && !e.target.closest('.catalog-rigth-selects')) {
      selects.classList.toggle('_select-open')
    };
    let selectItem = document.querySelector('.catalog-rigth-select')
    if(e.target.closest('.catalog-rigth-select-type')) {
      selectItem.querySelector('span').textContent = e.target.textContent;
      sortType = e.target.textContent
      selects.classList.remove('_select-open')
      fetchData(sortType, ProdyctType)
    };

    //Работа для выбора какой тип товара показывает-----------------------------------------------
    let viewTowar = document.querySelector('.catalog-top-view');
    if(e.target.closest('.catalog-top-type')) {
      let typeTowar = document.querySelector('._type-active');
      typeTowar.classList.remove('_type-active')
      viewTowar.textContent = e.target.textContent
      e.target.classList.add('_type-active');
      ProdyctType = e.target.dataset.producttype
      fetchData(sortType, ProdyctType)
    };

    //Открытие фильтра на мобилках-------------------------------------------------
    if(e.target.closest('._filter-open') || e.target.closest('._filter-close')) {
      let filter = document.querySelector('.catalog-filter');
      filter.classList.toggle('_filter-active')
      html.classList.toggle('_overflow');
    };

    //Открытые меню характеристик-------------------------------------------------
    let charectersMenu = document.querySelector('.characteristic');
    if(e.target.closest('.towar-btn') || !e.target.closest('.characteristic-row') && charectersMenu.classList.contains('active') || e.target.closest('.characteristic-close')) {
      charectersMenu.classList.toggle('active');
      html.classList.toggle('_overflow');
      addCharecters(e.target.parentNode.getAttribute('id'))
      if(html.classList.contains('_overflow')) {
        document.body.style.paddingRight = `${widthScroll()}px`;
      } else {document.body.style.paddingRight = `${0}px`;}
    }

    //
    let form = document.querySelector('.request-call');
    let formInputs = document.querySelectorAll('.request-input');
    if(e.target.closest('.header-right-btn') || e.target.closest('.request-call-close') ||
    e.target.closest('.request-call') && !e.target.closest('.request-call-row')) {
      [...formInputs].forEach(item => item.value = '')
      form.classList.toggle('active');
      html.classList.toggle('_overflow');
      if(html.classList.contains('_overflow')) {
        document.body.style.paddingRight = `${widthScroll()}px`;
      } else {document.body.style.paddingRight = `${0}px`;}
    }
});
const swiper = new Swiper('.intro-sliders', {
    loop: true,
    speed: 800,
    pagination: {
      el: '.intro-pagination',
      clickable: true,
    },
  
    navigation: {
      nextEl: '.intro-button-next',
      prevEl: '.intro-button-prev',
    },
});

//Получение Json ДАННЫХ--------------------------------------------------------------------------------------------------
let globalData = [];
async function fetchData(type, typeProduct) {
  try {
      // Загружаем JSON-файл
      // const response = await fetch('../json/towarData.json');
      const response = await fetch('https://raw.githubusercontent.com/dgssdagdg/ANDJEL/main/json/towarData.json');
      // Проверяем, успешен ли запрос
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }

      // Преобразуем содержимое в JSON-форма
      const data = await response.json();
      console.log(data);
      const dataTowars = data.towars;
      const dataFilters = data.filters;
      //Получение масива профильтрованных по Типу товара
      const dataFiltersArry = dataFilters.filter(function(item) {
        return item.type == typeProduct
      });
      //Получение масива профильтрованных по Типу товара
      const dataFilterTowar = dataTowars.filter(function(item) {
        return item.productType == typeProduct
      });
      //Получение масива сартированых по цене
      if(type == 'По цене (убыванию)') {
        dataFilterTowar.sort((a, b) => b.price - a.price);
      } else if (type == 'По цене (возрастание)') {dataFilterTowar.sort((a, b) => a.price - b.price);}

      // Выводим данные в консоль или используем их по назначению
      globalData = dataFilterTowar
      loadFilter(dataFiltersArry[0].filterArray);
      loadTowars(dataFilterTowar);
  } catch (error) {
      // Обрабатываем ошибки
      console.error('There has been a problem with your fetch operation:', error);
  }
}
fetchData(sortType, ProdyctType);

//Подгрузка товаров---------------------------------------------------------------
function loadTowars(data) {
  const towarContainer = document.querySelector('.catalog-rigth-towars');
  towarContainer.innerHTML = ''
  data.forEach(item => {
    let towarStartBlock = `<div id="${item.id}" class="catalog-rigth-towar towar">`;
    let TowarEndBlock = `</div>`
    let towarContentBlock = `
      <div class="towar-content">
        <h4 class="towar-content-title">${item.title}</h4>
        <div class="towar-content-info _df-flex">
            <div class="towar-content-price">${new Intl.NumberFormat('ru-RU').format(item.price)} ₽</div>
            ${item.status == "true" ? '<div class="towar-content-status">В наличии</div>' : '<div class="towar-content-status status-not">Нет в наличии</div>'}
        </div>
      </div>
    `;
    let towarSlidersStart = `
      <div class="towar-sliders">
        <div class="towar-sliders-wrapper">
    `;
    let towarSlidersSlids = '';
    item.towarImages.forEach(img => {
      if(item.towarImages[0].src == img.src) {
        towarSlidersSlids += `<span class="towar-slide _active">
            <span class="towar-slide-navigation"></span>
            <img src="${img.src}" alt="${item.title}" class="towar-slide-img">
          </span>
        `
      } else {
        towarSlidersSlids += `<span class="towar-slide">
            <span class="towar-slide-navigation"></span>
            <img src="${img.src}" alt="${item.title}" class="towar-slide-img">
          </span>
        `
      }
    });
    let towarSlidersEnd = `
        </div>
      </div>
    `
    let towarButtonBlock = `<button type="button" class="towar-btn">Подробнее</button>`
    let productTemplateBody = '';
    productTemplateBody += towarStartBlock;
    productTemplateBody += towarSlidersStart;
    productTemplateBody += towarSlidersSlids;
    productTemplateBody += towarSlidersEnd;
    productTemplateBody += towarContentBlock;
    productTemplateBody += towarButtonBlock;
    productTemplateBody += TowarEndBlock;
    towarContainer.insertAdjacentHTML('beforeend', productTemplateBody);
  })
  let colvoTowar = document.querySelector('.catalog-top-colvo');
  colvoTowar.textContent = `${data.length} товаров`

  //Функция для слайдера в товарах---------------------------------------------------------------
  let allNavigations = document.querySelectorAll('.towar-slide-navigation');

  [...allNavigations].forEach(function(item) {
    item.addEventListener('mouseenter', function(e) {
      let activeItem = e.target.closest('.towar-slide');
      let active = activeItem.closest('.towar-sliders-wrapper').querySelector('._active');
      if(active) {active.classList.remove('_active')}
      activeItem.classList.add('_active')

    })
  });
  [...allNavigations].forEach(function(item) {
    item.addEventListener('mouseleave', function(e) {
      let activeItem = e.target.closest('.towar-slide');
      let active = activeItem.closest('.towar-sliders-wrapper').querySelector('._active');
      let ferst = activeItem.closest('.towar-sliders-wrapper').querySelector('.towar-slide')
      if(active) {active.classList.remove('_active')}
      ferst.classList.add('_active')
    })
  });
}
//Подгрузка Фильтра---------------------------------------------------------
function loadFilter(filterData) {
  const filterContainer = document.querySelector('.catalog-filter-body');
  filterContainer.innerHTML = ''
  let filterHtml = '';
  filterData.forEach(item => {
    filterHtml += `
      <div class="catalog-filter-block catalog-filter-border">
        <div class="catalog-filter-open _df-flex _hidden-open _hidden-active-arrow">
            ${item.nameType}
            <span>
                <svg width="12.000000" height="7.200012" viewBox="0 0 12 7.20001" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <desc>
                            Created with Pixso.
                    </desc>
                    <defs/>
                    <path id="Vector" d="M1.4 0L6 4.45L10.59 0L12 1.37L6 7.2L0 1.37L1.4 0Z" fill="#000000" fill-opacity="1.000000" fill-rule="nonzero"/>
                </svg>
            </span>
        </div>
        <div class="catalog-filter-items _hidden _hidden-active">
    `;
    item.allTypes.forEach(element => {
      filterHtml += `
        <div class="catalog-filter-item">
            <input type="checkbox" id="${element.value}" />
            <label for="${element.value}">${element.value}</label>
        </div>
      `
    })
    filterHtml += `
                </div>
      </div>
    `
  })
  filterContainer.insertAdjacentHTML('beforeend', filterHtml);
}
//Подгруска характеристик товара----------------------------------------------------------
let charectersContainer = document.querySelector('.characteristic-items');
function addCharecters(id) {
  let charectersData = globalData.find(item => item.id === id);
  charectersContainer.innerHTML = ''
  if(id == null || charectersData.features === undefined){return}
  let charectersHtml = '';
  charectersData.features.forEach(item => {
    charectersHtml += `
      <div class="characteristic-item">
        ${item.feature} <span></span> <p>${item.value}</p>
      </div>
    `
  })
  charectersContainer.insertAdjacentHTML('beforeend', charectersHtml);
}
//Узнаем ширину скролбара-------------------------------
function widthScroll(){
  var div = document.createElement('div');
  div.style.overflowY = 'scroll';
  div.style.width = '50px';
  div.style.height = '50px';
  div.style.visibility = 'hidden';
  document.body.appendChild(div);
  var scrollWidth = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);
  return scrollWidth;
}
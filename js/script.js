//Все важные переменые---------------------------------------------
let sortType = 'По цене (убыванию)';
let ProdyctType = 'Phone';
let items = [...document.querySelectorAll('.catalog-rigth-towar')];
let totalTowar = 4;
//Храниться масив с товарами на каторых используеться фильр----------------
let globalFilterData = [];
//Функция для закрытия менюшки------------------------------------
function closeMenuAndButton() {
  let menuBtn = document.querySelector('.menu-btn');
  let menu = document.querySelector('.menu');
  const html = document.documentElement;
  menuBtn.classList.remove('active');
  menu.classList.remove('active');
  html.classList.remove('_overflow');
}
//Функция для открытия и закрытия формы
function closeOpenForm() {
  let form = document.querySelector('.request-call');
  let formInputs = document.querySelectorAll('.request-input');
  const html = document.documentElement;
  [...formInputs].forEach(item => item.value = '')
  form.classList.toggle('active');
  html.classList.toggle('_overflow');
  if(html.classList.contains('_overflow')) {
    document.body.style.paddingRight = `${widthScroll()}px`;
  } else {document.body.style.paddingRight = `${0}px`;}
}
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
      closeMenuAndButton()
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
      selectFilters();
      // fetchData(sortType, ProdyctType)
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
      //Обнуленеи количества выводимых товаров------------------------------
      let moreButton = document.querySelector('.catalog-rigth-more-btn')
      totalTowar = 4
      moreButton.textContent = "Показать ещё"
      //Очищает масив фильра--------------------------
      globalFilterData = [];
    };

    //Открытие фильтра на мобилках-------------------------------------------------
    if(e.target.closest('._filter-open') || e.target.closest('._filter-close')) {
      let filter = document.querySelector('.catalog-filter');
      filter.classList.toggle('_filter-active')
      html.classList.toggle('_overflow');
    };

    //Открытые меню характеристик-------------------------------------------------
    let charectersMenu = document.querySelector('.characteristic');
    if(e.target.closest('._open-characters') || !e.target.closest('.characteristic-row') && charectersMenu.classList.contains('active') || e.target.closest('.characteristic-close')) {
      charectersMenu.classList.toggle('active');
      html.classList.toggle('_overflow');
      addCharecters(e.target.getAttribute('data-id'))
      if(html.classList.contains('_overflow')) {
        document.body.style.paddingRight = `${widthScroll()}px`;
      } else {document.body.style.paddingRight = `${0}px`;}
    }

    //Открытие формы и закрытие ее------------------------------------------------------
    let form = document.querySelector('.request-call');
    let formInputs = document.querySelectorAll('.request-input');
    if(e.target.closest('.header-right-btn')) {
      if(menu.classList.contains('active')) { closeMenuAndButton() }
      closeOpenForm()
    }
    if(e.target.closest('.request-call-close') || e.target.closest('.request-call') && !e.target.closest('.request-call-row')) {
      closeOpenForm()
    }

    //Активация функция после клика по чекбоксу 
    if(e.target.closest('.catalog-filter-item [type=checkbox]')) {
      workFilter();
    }

    //
    if(e.target.closest('._btn-open-pop-up')){
      let popUp = document.querySelector(`#${e.target.getAttribute('data-popup')}`)
      popUp.classList.add('_active-pop-up')
    }
    if(e.target.closest('._active-pop-up') && !e.target.closest('._pop-up-row') || e.target.closest('.oreder-pop-up-close')) {
      e.target.closest('._active-pop-up').classList.remove('_active-pop-up')
    }
    
});
//Якорные сылка для прокрутки до блоков-------------------------------------------------
document.querySelectorAll('a[href^="#"').forEach(link => {
  link.addEventListener('click', function(e) {
      e.preventDefault();

      let href = this.getAttribute('href').substring(1);

      const scrollTarget = document.getElementById(href);

      const topOffset = document.querySelector('.header-nav').offsetHeight;
      // const topOffset = 0; // если не нужен отступ сверху 
      const elementPosition = scrollTarget.getBoundingClientRect().top;
      const offsetPosition = elementPosition - topOffset;

      let menu = document.querySelector('.menu');
      if(menu.classList.contains('active')) {
        closeMenuAndButton()
      }
      window.scrollBy({
          top: offsetPosition,
          behavior: 'smooth'
      });
  });
});

//Получение Json ДАННЫХ--------------------------------------------------------------------------------------------------
let globalData = [];
async function fetchData(type, typeProduct) {
  try {
      // Загружаем JSON-файл
      const response = await fetch('../json/towarData.json');
      // const response = await fetch('https://raw.githubusercontent.com/dgssdagdg/ANDJEL/main/json/towarData.json');
      // Проверяем, успешен ли запрос
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }

      // Преобразуем содержимое в JSON-форма
      const data = await response.json();
      const dataTowars = data.towars;
      const dataFilters = data.filters;
      //Получение масива фильтра
      const dataFiltersArry = dataFilters.filter(function(item) {
        return item.type == typeProduct
      });

      //Получение масива профильтрованных по Типу товара
      const dataFilterTowar = dataTowars.filter(function(item) {
        return item.productType == typeProduct
      });
      //Добовление типов каталога---------------------------------
      const catalogTypesBlock = document.querySelector('.catalog-top-types');
      if(catalogTypesBlock.children.length <= 0) {
        addTypes(data.catalogTypes)
      }
      //Получение масива сартированых по цене
      if(type == 'По цене (убыванию)') {
        dataFilterTowar.sort((a, b) => a.price - b.price);
      } else if (type == 'По цене (возрастание)') {dataFilterTowar.sort((a, b) => b.price - a.price);}
      // Выводим данные в консоль или используем их по назначению
      globalData = dataFilterTowar
      loadFilter(dataFiltersArry[0].filterArray);
      loadTowars(dataFilterTowar.reverse());

      //Активация функции добовленеи сайлдов если условие выполнено-----------------------------
      let slidersBlock = document.querySelector('.swiper-wrapper');
      if(slidersBlock.children.length <= 0) {
        addSlids(data.slids)
      }
  } catch (error) {
      // Обрабатываем ошибки
      console.error('There has been a problem with your fetch operation:', error);
  }
}
fetchData(sortType, ProdyctType);
//функция для добовление новых товаров---------------------
function clicks() {
  let moreButton = document.querySelector('.catalog-rigth-more-btn')
  if(totalTowar >= globalData.length) { // изменить текст у кнопки если бодльше нет слайдов для добавки
    moreButton.textContent = "Больще нет"
    return
  } else if(globalFilterData.length <= 0) {//Добавление еще товаров если в масиве товаров фильтра ноль товаров
    totalTowar = totalTowar + 4
    moreButton.textContent = "Показать ещё"
    loadTowars(globalData);
  } else if(totalTowar >= globalFilterData.length) {// изменить текст у кнопки если бодльше нет слайдов для добавки
    moreButton.textContent = "Больще нет"
  } else { //Добавление еще товаров если в масиве товаров фильтра есть товары
    totalTowar = totalTowar + 4
    moreButton.textContent = "Показать ещё"
    loadTowars(globalFilterData);
    workFilter()
  }
}

//Подгрузка товаров---------------------------------------------------------------
function loadTowars(data) {
  const towarContainer = document.querySelector('.catalog-rigth-towars');
  towarContainer.innerHTML = ''
  data.slice(0, totalTowar).forEach(item => {
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
    let towarButtonBlock = `
      <div class="towar-btns">
          <button data-id="${item.id}" type="button" class="towar-btn _open-characters">Подробнее</button>
          <button data-popup="order" type="button" class="towar-order-btn _btn-open-pop-up">Заказать</button>
      </div>
    `
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
        <div data-itemtype="${item.nameType}" class="catalog-filter-item">
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

//Работа с фильтра---------------------------------
function workFilter() {
  let filterItem = document.querySelectorAll('.catalog-filter-item');
  //Получаем масив с отмечиными чек-боксами-----------------------
  let chekedItems = [...filterItem].filter(item => {
    if (item.querySelector('input').checked) {
      return item
    }
  })
  //Создаем масив с параметрами чекбокса для дальнейшей фильрации
  let dataFilterCharecters = [];
  chekedItems.forEach(item => {
    let dataPush = {
      type: item.dataset.itemtype,
      value: item.querySelector('label').textContent,
    }
    dataFilterCharecters.push(dataPush);
  })
  //Фильтруем масив сравниевая параметры товара с параметрами чекбокса
  let dataFilterTowars = globalData.filter(item => {
    let counter = 0;
    dataFilterCharecters.forEach(element => {
      let itemFeatures = item.features.find(i => i.feature === element.type)
      if(itemFeatures.value.toUpperCase() == element.value.toUpperCase()){counter++}
    })
    return counter > 0
  })
  globalFilterData = dataFilterTowars;
  //Изменение текста у кнопки еще если можно показывать больще
  let moreButton = document.querySelector('.catalog-rigth-more-btn')
  if(totalTowar < dataFilterTowars.length) {
    moreButton.textContent = "Показать ещё"
  } else if(totalTowar < globalData.length) {
    moreButton.textContent = "Больще нет"
  }

  //Передача нового масива при выполнении условия и передача простого масива не выполнения усливии-----------
  if(chekedItems.length > 0){
    loadTowars(dataFilterTowars);
  } else {loadTowars(globalData);}
}

//Добовленеи типов товаров---------------------------------
function addTypes(types) {
  const catalogTypesBlock = document.querySelector('.catalog-top-types');
  let catalogTypesHtml = '';
  let first = 0
  types.forEach(item => {
    if(first == 0){
      first++
      catalogTypesHtml += `<div data-producttype="${item.type}" class="catalog-top-type _type-active">${item.value}</div>`
    } else catalogTypesHtml += `<div data-producttype="${item.type}" class="catalog-top-type">${item.value}</div>`
    
  })
  catalogTypesBlock.insertAdjacentHTML('beforeend', catalogTypesHtml);
}

//Добовление слайдов в слайдер------------------------------
function addSlids(slids) {
  let slidersBlock = document.querySelector('.swiper-wrapper');
  slidersBlock.innerHTML = ''
  let slidersHtml = '';
  slids.forEach(item => {
    slidersHtml += `
      <div class="swiper-slide intro-slide">
        <img src="${item.bgImg}" alt="${item.title}" class="intro-swiper-img">
        <div class="container">
            <div class="intro-swiper-row">
                <div class="intro-swiper-content">
                    <div class="intro-swiper-sub-title">${item.subTitle}</div>
                    <h3 class="intro-swiper-title">${item.title}</h3>
                    <button data-id="${item.id}" type="button" class="intro-swiper-btn _open-characters">Подробнее</button>
                </div>
                <img src="${item.productImg}" alt="${item.subTitle}" class="intro-swiper-image">
            </div>
        </div>
      </div>
    `
    
  })
  slidersBlock.insertAdjacentHTML('beforeend', slidersHtml);
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
}


//Работа селект выбора-------------------------------
function selectFilters() {
  //Передает сотрированый по цене простой масив если масив с фильроваными товарами пуст-------------
  if(globalFilterData.length <= 0) {
    if(sortType == 'По цене (убыванию)') {
      globalData.sort((a, b) => b.price - a.price);
    } else if (sortType == 'По цене (возрастание)') {globalData.sort((a, b) => a.price - b.price);}
    loadTowars(globalData);
  } else {//А тут уже передает профильтрованый масив-------------------------------------------
    if(sortType == 'По цене (убыванию)') {
      globalFilterData.sort((a, b) => a.price - b.price);
    } else if (sortType == 'По цене (возрастание)') {globalFilterData.sort((a, b) => b.price - a.price);}
    console.log(globalFilterData);
    loadTowars(globalFilterData);
  }
}
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
      selectItem.querySelector('span').textContent = e.target.textContent
      selects.classList.remove('_select-open')
    };

    //Работа для выбора какой тип товара показывает
    let viewTowar = document.querySelector('.catalog-top-view');
    if(e.target.closest('.catalog-top-type')) {
      let typeTowar = document.querySelector('._type-active');
      typeTowar.classList.remove('_type-active')
      viewTowar.textContent = e.target.textContent
      e.target.classList.add('_type-active');
    };

    if(e.target.closest('._filter-open') || e.target.closest('._filter-close')) {
      let filter = document.querySelector('.catalog-filter');
      filter.classList.toggle('_filter-active')
      html.classList.toggle('_overflow');
    };
});

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

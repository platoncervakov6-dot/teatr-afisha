index_js = """// === Fallback для превью вне Telegram ===
(function ensureTelegramStub(){
  if (window.Telegram && window.Telegram.WebApp) return;
  window.Telegram = {
    WebApp: {
      colorScheme: 'dark',
      themeParams: {},
      initDataUnsafe: {},
      ready: function(){},
      expand: function(){},
      setHeaderColor: function(){},
      openLink: function(url){ window.open(url, '_blank'); }
    }
  };
})();

const tg = Telegram.WebApp;
tg.ready();
try { tg.expand(); tg.setHeaderColor('secondary_bg_color'); } catch (e) {}

// === Фейковые мероприятия для теста ===
const EVENTS = [
  {
    id: 'e1',
    title: 'Лебединое озеро',
    theatre: 'Большой театр',
    date: '05 окт 2025, 19:00',
    genres: ['Балет', 'Чайковский'],
    description: 'Классический балет в постановке Большого театра. Деликатная световая партитура и кристальная хореография.',
    posterLabel: 'BALLET',
    buyUrl: 'https://example.com/buy/swan-lake',
    siteUrl: 'https://example.com/theatre/bolshoi'
  },
  {
    id: 'e2',
    title: 'Евгений Онегин',
    theatre: 'Новая Опера (Москва)',
    date: '12 окт 2025, 18:00',
    genres: ['Опера', 'Чайковский'],
    description: 'Лирические сцены в трех действиях. Современная сценография и камерная подача классики.',
    posterLabel: 'OPERA',
    buyUrl: 'https://example.com/buy/onegin',
    siteUrl: 'https://example.com/theatre/novaya-opera'
  }
];

const CATEGORIES = ['Все', 'Балет', 'Опера', 'Драма', 'Театр'];

const $grid = document.getElementById('grid');
const $search = document.getElementById('search');
const $chipbar = document.getElementById('chipbar');

let state = {
  q: '',
  category: 'Все',
};

// === Рендер фильтров (чипов) ===
function renderChips(){
  $chipbar.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const chip = document.createElement('button');
    chip.className = 'chip' + (state.category === cat ? ' active' : '');
    chip.textContent = cat;
    chip.onclick = () => { state.category = cat; render(); };
    $chipbar.appendChild(chip);
  });
}

// === Утилита открытия ссылок ===
function openExternal(url){
  try { tg.openLink(url); } catch (e) { window.open(url, '_blank'); }
}

// === Рендер карточек ===
function renderCards(list){
  if (!list.length){
    $grid.innerHTML = '<div class="empty">Ничего не найдено. Попробуйте изменить запрос или фильтр.</div>';
    return;
  }
  $grid.innerHTML = '';
  list.forEach(ev => {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('data-id', ev.id);

    const poster = document.createElement('div');
    poster.className = 'poster';
    poster.innerHTML = `<div class="poster-inner">${ev.posterLabel || ''}</div>`;

    const content = document.createElement('div');
    content.className = 'content';

    const title = document.createElement('div');
    title.className = 'h3';
    title.textContent = ev.title;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${ev.theatre} • ${ev.date}`;

    const tags = document.createElement('div');
    tags.className = 'tags';
    (ev.genres||[]).forEach(t => {
      const el = document.createElement('span');
      el.className = 'tag'; el.textContent = t; tags.appendChild(el);
    });

    const descr = document.createElement('div');
    descr.className = 'descr';
    descr.textContent = ev.description || '';

    const actions = document.createElement('div');
    actions.className = 'actions';

    const btnBuy = document.createElement('button');
    btnBuy.className = 'btn primary';
    btnBuy.innerHTML = iconTicket() + 'Купить билеты';
    btnBuy.onclick = () => openExternal(ev.buyUrl);

    const btnSite = document.createElement('button');
    btnSite.className = 'btn ghost';
    btnSite.innerHTML = iconLink() + 'Сайт театра';
    btnSite.onclick = () => openExternal(ev.siteUrl);

    actions.append(btnBuy, btnSite);
    content.append(title, meta, tags, descr, actions);
    card.append(poster, content);
    $grid.appendChild(card);
  });
}

// === Фильтрация ===
function applyFilters(){
  const q = state.q.trim().toLowerCase();
  const inCat = (ev) => state.category === 'Все' || (ev.genres||[]).some(g => g.toLowerCase() === state.category.toLowerCase()) ||
                                  ev.title.toLowerCase().includes(state.category.toLowerCase());
  return EVENTS.filter(ev => {
    const okQ = !q || [ev.title, ev.theatre, ev.description, ...(ev.genres||[])].some(v => String(v).toLowerCase().includes(q));
    return okQ && inCat(ev);
  });
}

function render(){
  renderChips();
  renderCards(applyFilters());
}

// === События ===
$search.addEventListener('input', (e) => { state.q = e.target.value; render(); });

document.getElementById('about').addEventListener('click', (e) => {
  e.preventDefault();
  alert('Москва Афиша — прототип Telegram Mini App. Сейчас показаны 2 фейк‑мероприятия для проверки интерфейса.');
});

// === SVG-иконки ===
function iconTicket(){
  return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px"><path d="M3 9a3 3 0 0 0 3-3h12a3 3 0 0 0 3 3v6a3 3 0 0 0-3 3H6a3 3 0 0 0-3-3Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path></svg> ';
}
function iconLink(){
  return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 1 0 7.07 7.07l1.72-1.71"></path></svg> ';
}

// === Пуск ===
render();
"""

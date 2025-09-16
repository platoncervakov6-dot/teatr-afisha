// api/events.js
import { fetch } from 'undici'; // Vercel поддерживает undici в Node.js

export default async function handler(req, res) {
  const theatres = [
    {
      name: "Театр им. Вахтангова",
      url: "https://www.vakhtangov.ru/spectacles",
      parser: parseVakhtangov,
    },
    {
      name: "МХТ им. Чехова",
      url: "https://www.mht.ru/spectacles",
      parser: parseMHT,
    },
    {
      name: "Театр «Современник»",
      url: "https://www.sovremennik.ru/spectacles",
      parser: parseSovremennik,
    },
    {
      name: "Театр наций",
      url: "https://www.nationtheatre.ru/spectacles",
      parser: parseNations,
    },
    {
      name: "Театр «Карнавал»",
      url: "https://karnaval.ru/spectacles",
      parser: parseKarnaval,
    },
    // Можно добавить ещё — это шаблон!
  ];

  try {
    const events = [];

    for (const theatre of theatres) {
      const html = await fetch(theatre.url).then(r => r.text());
      const parsed = await theatre.parser(html);
      events.push(...parsed);
    }

    // Фильтруем только события начиная со следующего дня
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const futureEvents = events
      .filter(event => new Date(event.date) >= tomorrow)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json(futureEvents);
  } catch (error) {
    console.error('Ошибка при парсинге:', error);
    res.status(500).json({ error: 'Не удалось получить данные' });
  }
}

// === ПРИМЕРЫ ПАРСЕРОВ ===

async function parseVakhtangov(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const items = Array.from(doc.querySelectorAll('.spectacle-item'));

  return items.map(item => {
    const title = item.querySelector('.spectacle-title')?.textContent.trim() || 'Без названия';
    const dateText = item.querySelector('.date')?.textContent.trim() || '';
    const dateMatch = dateText.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
    const timeMatch = dateText.match(/(\d{1,2}):(\d{2})/);
    const monthMap = {
      'января': 0, 'февраля': 1, 'марта': 2, 'апреля': 3, 'мая': 4, 'июня': 5,
      'июля': 6, 'августа': 7, 'сентября': 8, 'октября': 9, 'ноября': 10, 'декабря': 11
    };

    let date;
    if (dateMatch && timeMatch) {
      const day = parseInt(dateMatch[1]);
      const month = monthMap[dateMatch[2]];
      const year = parseInt(dateMatch[3]);
      const hour = parseInt(timeMatch[1]);
      const minute = parseInt(timeMatch[2]);
      date = new Date(year, month, day, hour, minute).toISOString();
    } else {
      date = new Date().toISOString(); // запасной вариант
    }

    const link = item.querySelector('a')?.href || '';
    const genre = item.querySelector('.genre')?.textContent.trim() || 'драма';

    return {
      title,
      date,
      venue: "Театр им. Вахтангова",
      genre,
      ticketsUrl: `https://ticketland.ru/search?q=${encodeURIComponent(title)}`,
      siteUrl: link,
    };
  }).filter(event => event.title !== 'Без названия');
}

// Аналогично можно сделать parseMHT, parseSovremennik и т.д.
// Но пока — хватит одного примера. Если нужно — я сделаю остальные!

async function parseMHT(html) {
  // ... аналогично, но под МХТ
  // Здесь ты можешь вставить свой HTML-парсер
  // Или скажи — я сделаю за тебя!
  return [];
}

async function parseSovremennik(html) {
  return [];
}

async function parseNations(html) {
  return [];
}

async function parseKarnaval(html) {
  return [];
}

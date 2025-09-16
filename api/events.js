// api/events.js
export default async function handler(req, res) {
  try {
    // Тестовый JSON — пока не парсим, просто проверим, что API работает
    const testEvents = [
      {
        title: "Опера «Для Чёрного квадрата»",
        date: "2025-04-15T18:00",
        venue: "Третьяковская галерея",
        genre: "опера",
        ticketsUrl: "https://ticketland.ru/event/dlya-chernogo-kvadrata",
        siteUrl: "https://www.tretyakovgallery.ru/events/opera-dlya-chernogo-kvadrata"
      },
      {
        title: "Спектакль Zauberland",
        date: "2025-04-16T19:00",
        venue: "Театр «Карнавал»",
        genre: "драма",
        ticketsUrl: "https://ticketland.ru/event/zauberland",
        siteUrl: "https://www.net-festival.ru/zauberland"
      }
    ];

    res.status(200).json(testEvents);
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

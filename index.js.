const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/events', async (req, res) => {
  try {
    const response = await axios.get('https://kudago.com/public-api/v1.4/events/', {
      params: {
        location: 'msk',
        categories: 'theater',
        fields: 'title,place,dates,site_url,ticket_url',
        order_by: 'date'
      }
    });

    const events = response.data.results
      .filter(event => {
        const t = event.title.toLowerCase();
        return t.includes('опера') || t.includes('балет') || t.includes('драма') || t.includes('спектакль');
      })
      .map(event => ({
        title: event.title,
        date: new Date(event.dates[0].start_date).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: event.title.toLowerCase().includes('опера') ? 'Опера' :
              event.title.toLowerCase().includes('балет') ? 'Балет' :
              event.title.toLowerCase().includes('драма') || event.title.toLowerCase().includes('пьеса') ? 'Драма' : 'Театр',
        venue: event.place.name,
        ticket_link: event.ticket_url || 'https://ticket.ru',
        official_site_link: event.site_url || 'https://kudago.com'
      }));

    res.json(events);
  } catch (error) {
    console.error('Ошибка:', error.message);
    res.status(500).json({ error: 'Не удалось загрузить данные' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

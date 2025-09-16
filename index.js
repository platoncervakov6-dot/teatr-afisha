document.addEventListener('DOMContentLoaded', async () => {
  const eventsContainer = document.getElementById('events');

  try {
    const response = await fetch('/api/events');
    const events = await response.json();

    if (!response.ok || !Array.isArray(events)) {
      throw new Error('Ошибка загрузки данных');
    }

    if (events.length === 0) {
      eventsContainer.innerHTML = `
        <div class="no-events">На следующие дни спектаклей нет 😢<br>Попробуйте зайти позже!</div>
      `;
      return;
    }

    events.forEach(event => {
      const date = new Date(event.date);
      const formattedDate = date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });

      const eventDiv = document.createElement('div');
      eventDiv.className = 'event';
      eventDiv.innerHTML = `
        <h2 class="title">${event.title}</h2>
        <div class="info">📅 ${formattedDate}</div>
        <div class="info">🎭 ${event.genre}</div>
        <div class="info">📍 ${event.venue}</div>
        <a href="${event.ticketsUrl}" target="_blank" class="btn btn-tickets">🎟️ Билеты</a>
        <a href="${event.siteUrl}" target="_blank" class="btn btn-site">🌐 Сайт</a>
      `;
      eventsContainer.appendChild(eventDiv);
    });

  } catch (error) {
    console.error(error);
    eventsContainer.innerHTML = `
      <div class="loading">❌ Ошибка загрузки данных.<br>Попробуйте позже.</div>
    `;
  }
});

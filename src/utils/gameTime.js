const gameTimeFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

// formats date into format like "10/1 @ 3:00 PM" (Eastern time)
function formatGameTime(date) {
  return gameTimeFormat.format(date).replace(',', ' @');
}

module.exports = { formatGameTime };

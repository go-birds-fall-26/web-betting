// does teams filtering on markets page
// each game card has data-teams="AWAY HOME"
// each week section has data-week
const select = document.getElementById('team-filter');
const weekSections = document.querySelectorAll('[data-week]');
const weekLinks = document.querySelectorAll('.sidebar nav a');
const emptyMessage = document.getElementById('no-games');

select.addEventListener('change', () => {
  const team = select.value;
  let gamesShown = 0;

  weekSections.forEach(section => {
    let shownInWeek = 0;

    section.querySelectorAll('[data-teams]').forEach(card => {
      const matches = team === '' || card.dataset.teams.split(' ').includes(team);
      card.hidden = !matches;

      if (matches) {
        shownInWeek++;
      }
    });

    section.hidden = shownInWeek === 0;
    gamesShown += shownInWeek;
  });

  // hide sidebar links for weeks with nothing to show
  weekLinks.forEach(link => {
    link.hidden = document.querySelector(link.getAttribute('href')).hidden;
  });

  emptyMessage.hidden = gamesShown > 0;
});

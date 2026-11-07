async function getGameResult(gameId) {
  const url =
    `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${encodeURIComponent(gameId)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`ESPN request failed: ${response.status}`);
  }
  
  const data = await response.json();
  const competition = data.header?.competitions?.[0]; // competition object represents the teams and game status

  // status provides info on the date of the game and if it has been completed
  const status = competition?.status?.type;

  // status.completed is a boolean representing if the game has been finished
  if (typeof status?.completed !== "boolean") {
    throw new Error("ESPN response is missing the game's completion status");
  }

  // return object when game isn't finished
  if (!status.completed) {
    return {
        gameId: String(gameId),
        status: "not_final",
        winnerTeamId: null
    };
  }

  // object containing the winning team's information and boolean "winner" field
  const winners = competition.competitors.filter(competitor => competitor.winner === true);
  console.log("Winning competitors:", winners);

  console.log("Game status:", competition?.status?.type);

}

getGameResult("401873037")
  .then(result => console.log("Game result:", result))
  .catch(console.error); // jags vs ravens (ended 33 - 10 jags)

getGameResult(401873039); // bears vs falcons (didnt start)
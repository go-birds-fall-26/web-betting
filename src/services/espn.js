// returns an json object containing gameId (string), status (string - final, not_final, tie), and winnerTeamId (string)
// gameId is an exclusive string for every game. this is found in the url of any game on the espn website (ex: https://www.espn.com/nfl/game/_/gameId/401872988/giants-commanders)
// winnerTeamId represents the teamId of the winning team. every NFL team has an exclusive ID

async function getGameResult(gameId) {
  
  // validate input, this function accepts a string of digits or an integer
  const validString = typeof gameId === "string" && /^\d+$/.test(gameId);
  const validInteger = Number.isSafeInteger(gameId) && gameId > 0;

  if (!validString && !validInteger) {
    throw new Error("gameId must be a digit string or a positive integer");
  }

  gameId = String(gameId);

  const url =
    `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${encodeURIComponent(gameId)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`ESPN request failed: ${response.status}`);
  }
  
  const data = await response.json();
  
  // verify that ESPN's game ID matches the input gameId
  if (data?.header?.id !== gameId) {
    throw new Error("ESPN response does not match the requested game");
  }
  const competition = data.header?.competitions?.[0]; // competition object represents the teams and game status

  // stores game's status and completion information
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
  const competitors = competition.competitors;

  if (!Array.isArray(competitors) || competitors.length !== 2) {
    throw new Error("Expected two competitors in the ESPN response");
  }

  // object containing the winning team's information and boolean "winner" field
  const winners = competitors.filter(competitor => competitor.winner === true);

  // check for tie game
  const tied = competitors[0].score === competitors[1].score;

  if (status.name === "STATUS_FINAL" && tied) {
    return {
      gameId: String(gameId),
      status: "tie",
      winnerTeamId: null
    };
  }

  if (winners.length !== 1) {
    throw new Error("Didn't receive one winner");
  }
  
  // when a game is finished, we will return an object containing the game's id, its status, and the winning team's ID
  return {
    gameId: String(gameId),
    status: "final",
    winnerTeamId: winners[0].team.id
  };

}

module.exports = { getGameResult };

// tests
// getGameResult("401873037")
//   .then(result => console.log("Game result:", result))
//   .catch(console.error); // jags vs ravens (ended 33 - 10 jags)

// getGameResult("401873039")
//   .then(result => console.log("Game result:", result))
//   .catch(console.error); // bears vs falcons (didn't start)

// getGameResult("401872988")
//   .then(result => console.log("Game result:", result))
//   .catch(console.error); // tie game, giants vs commanders
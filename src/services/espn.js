async function getGameResult(gameId) {
  const url =
    `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${encodeURIComponent(gameId)}`;

  const response = await fetch(url);

  console.log("HTTP status:", response.status);
  
}
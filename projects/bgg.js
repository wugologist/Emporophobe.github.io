// JSON wrapper for BGG API, also doesn't have CORS restrictions
const apiRoot = "https://cors.io?https://bgg-json.azurewebsites.net/"
// cache the api response after the first call
var cachedResponse = null;

window.onload = function() {
	document.getElementById("submit").onclick = bggSearch;
}

// clear the cache when the search is changed
document.addEventListener("input", () => cachedResponse = null, false);

function bggSearch() {
	const url = apiRoot + "collection/" + document.getElementById("bgg-username").value + "?grouped=false";
	document.getElementById("result").innerHTML = "🤔"
	if (cachedResponse) {
		updatePage(selectGame(cachedResponse));
	} else {
		fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(responseJson) {
			cachedResponse = responseJson;
			updatePage(selectGame(responseJson));
		})
	}
}

function selectGame(gameJson) {
	const numPlayers = document.getElementById("num-players").value;
	const minDuration = document.getElementById("min-duration").value;
	const maxDuration = document.getElementById("max-duration").value;
	const validGames = gameJson.filter(game => 
		game.owned
		&& !game.isExpansion
		&& game.minPlayers <= numPlayers
		&& game.maxPlayers >= numPlayers
		&& (!minDuration || game.playingTime >= minDuration)
		&& (!maxDuration || game.playingTime <= maxDuration)
	);
	return validGames[Math.floor(Math.random()*validGames.length)];	
}

function updatePage(game) {
	document.getElementById("result").innerHTML = game ? "How about a nice game of " + game.name + "?" : "No games fit your criteria.";
}
// JSON wrapper for BGG API, also doesn't have CORS restrictions
const apiRoot = "https://cors.io?https://bgg-json.azurewebsites.net/"

window.onload = function() {
	document.getElementById("submit").onclick = bggSearch;
}

var bggSearch = function() {
	const url = apiRoot + "collection/" + document.getElementById("bgg-username").value + "?grouped=false";
	document.getElementById("result").innerHTML = "🤔"
	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(responseJson) {
			const game = selectGame(responseJson);
			document.getElementById("result").innerHTML = game.name;
		})
}

var selectGame = function(gameJson) {
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
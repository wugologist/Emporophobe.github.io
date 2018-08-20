// JSON wrapper for BGG API, also doesn't have CORS restrictions
const apiRoot = "https://cors.io?https://bgg-json.azurewebsites.net/"
// cache the api response after the first call
var cachedResponse = null;

window.onload = function() {
	document.getElementById("submit").onclick = bggSearch;
	document.getElementById("more").onclick = toggleHidables;
	console.log("Made by Michael Wong https://michaelwong.io. Source on GitHub: https://github.com/Emporophobe/Emporophobe.github.io");
}

// clear the cache when the search is changed
document.addEventListener("input", () => cachedResponse = null, false);

function bggSearch() {
	const url = apiRoot + "collection/" + document.getElementById("bgg-username").value + "?grouped=false";
	document.getElementById("result").innerHTML = "🤔"
	if (cachedResponse) {
		updatePage(selectGame(cachedResponse));
	} else {
		document.getElementById("result").classList.add("loading");
		fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(responseJson) {
			document.getElementById("result").classList.remove("loading");
			cachedResponse = responseJson;
			updatePage(selectGame(responseJson));
		});
	}
}

function selectGame(gameJson) {
	if (gameJson.length === 0) {
		return "No games found for given username.";
	}
	
	const numPlayers = document.getElementById("num-players").value;
	const minDuration = document.getElementById("min-duration").value;
	const maxDuration = document.getElementById("max-duration").value;
	const weighting = document.querySelector('input[name="weight"]:checked').value;
	const validGames = gameJson.filter(game => 
		game.owned
		&& !game.isExpansion
		&& game.minPlayers <= numPlayers
		&& game.maxPlayers >= numPlayers
		&& (!minDuration || game.playingTime >= minDuration)
		&& (!maxDuration || game.playingTime <= maxDuration)
	);
	
	if (weighting === "none") {
		const selected = validGames[Math.floor(Math.random()*validGames.length)];
		return formatGameChoice(selected, validGames);		
	} else if (weighting === "bgg") {
		return 	formatGameChoice(weightedChoice(validGames, validGames.map(game => game.averageRating)),
			validGames.filter(game => game.averageRating >= 0));
	} else if (weighting === "user") {
		return 	formatGameChoice(weightedChoice(validGames, validGames.map(game => game.rating)),
			validGames.filter(game => game.rating >= 0));		
	}
}

function formatGameChoice(game, validGames) {
	console.log(validGames)
	switch (validGames.length) {
		case 0:
			return "No games fit your criteria."
		case 1:
			return "<b>" + game.name + "</b> is your only choice."
		default:
			return "How about a nice game of <b>" + game.name + "</b>?"
	}
}

function weightedChoice(options, weights) {
	// unrated games have a weight of -1
	const weightedOptions = options.filter((option, i) => weights[i] >= 0); 
	const filteredWeights = weights.filter(weight => weight >= 0)
	const totalWeight = filteredWeights.reduce((sum, weight) => sum + weight);
	const selectedWeight = Math.random() * totalWeight;
	return selectByWeight(weightedOptions, filteredWeights, selectedWeight, 0);
}

// A gratuitously tail-recursive function.
function selectByWeight(options, weights, targetWeight, totalWeight) {
	if (options.length === 0) {
		return null;
	}else if (options.length === 1) {
		return options[0];
	} else if (totalWeight + weights[0] >= targetWeight) {
		return options[0];
	} else {
		return selectByWeight(options.slice(1), weights.slice(1), targetWeight, totalWeight + weights[0]);
	}	
}

function updatePage(message) {
	document.getElementById("result").innerHTML = message;
}

function toggleHidables() {
	document.querySelectorAll(".hidable").forEach(element => element.classList.toggle("hidden"));
	document.getElementById("more").innerText = (document.getElementById("more").innerText.toLowerCase() === "more" ? "Less" : "More");
}
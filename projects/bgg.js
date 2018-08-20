// use cors.io as a proxy to avoid cross origin request blocking (since there's no backend to make the request)
const bgg_api_root = "https://cors.io?https://www.boardgamegeek.com/xmlapi2/";

window.onload = function() {
	document.getElementById("submit").onclick = bggSearch;
}

var bggSearch = function() { 
	var xhr = new XMLHttpRequest();
	xhr.open("GET", bgg_api_root + "collection/" + document.getElementById("bgg-username").innerText + "owned=1");
	xhr.responseType = "document";
	xhr.send();
	// When the xhr request changes state
	xhr.onreadystatechange = function () {
		// When it's now complete
		if (xhr.readyState === 4) {
			// Inject the response into the #header element
			console.log(document.getElementById("bgg-username").innerText);
			console.log(xhr.responseXML);
			document.querySelector("#result").innerHTML = xhr.body;
		}
	}
}
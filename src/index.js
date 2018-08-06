// Load the top header on page load
window.onload = function() {
	var ajax = new XMLHttpRequest();
	ajax.open("GET", "./components/header.html");
	ajax.send();
	// When the ajax request changes state
	ajax.onreadystatechange = function () {
		// When it's now complete
		if (ajax.readyState === 4) {
			// Inject the response into the #header element
			document.querySelector("#header").innerHTML = ajax.response;
		}
	}
}

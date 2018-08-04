window.onload = function() {
	var ajax = new XMLHttpRequest();
	ajax.open("GET", "banner.html");
	ajax.send();
	// When the ajax request changes state
	ajax.onreadystatechange = function () {
		// When it's now complete
		if (ajax.readyState === 4) {
			// Inject the response into the #banner element
			document.querySelector("#banner").innerHTML = ajax.response;
		}
	}
}

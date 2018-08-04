window.onload = function() {
	var ajax = new XMLHttpRequest();
	ajax.open("GET", "banner.html");
	ajax.responseType = "document";
	ajax.send();
	document.querySelector("#banner").innerHTML += ajax.responseXML;
}
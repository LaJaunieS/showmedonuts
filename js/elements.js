//DOM elements

var searchElements = {
	searchBtn: document.getElementById('searchBtn'),
	searchInput: document.getElementById('visible-option').children[0]
};

var mapElements = {
	mapEl: document.getElementById('map'),
	mapContainer: document.getElementById('mapContainer'),
	controlDiv: document.createElement('div'),
	centerBtn: document.createElement('button')
};

var resultsElements = {
	resultsList: document.getElementById('resultsList'),
	resultsUl: document.createElement('ul'),
	resultsLiArr : []
};

var placesElements = {
	placeInfo: "",
	placesUl : document.createElement("ul"),
	openHoursLi : document.createElement("li")
};

resultsElements.resultsUl.id = "list";

//pull results data and assign to a list element that is then appended to resultsUl




      
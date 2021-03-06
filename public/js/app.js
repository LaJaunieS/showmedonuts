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




      'use strict'

function getUserLocation() {
	var loc;
	var permissionGranted;
	var confirmGLPermissions = window.sessionStorage.getItem('locationPermission') || null;

	if (confirmGLPermissions === null) {
		confirmGLPermissions = confirm("Do you want this site to access your location? It is only for the purpose of starting a search near your location, and won't be stored after you close this browser.");
	} else {
		permissionGranted = window.sessionStorage.getItem('locationPermission');
	};


	var returnObj = {
		setLocation: function(position) {
			if (confirmGLPermissions) {
				//check for user permission
				permissionGranted = true;
				
				//check for geolocation property in browser
				if (position) {
					loc = position;
					_gmaps.setUserLoc(loc);
				} else {
					console.log("Unable to get location information. This feature may not be suppored in your browser");
					loc = undefined;
				};

			} else {
				permissionGranted = false;
				console.log("Got it. The initial location will be Seattle, WA");
				loc = undefined;
			};
			window.sessionStorage.setItem('locationPermission', permissionGranted);
		},

		getloc: function() {
			return loc;
		},

		getGLPermissions: function() {
			return confirmGLPermissions;
		}

	};

	return returnObj;
}

var mapStyles = [   {
              "featureType": "administrative",
              "elementType": "labels.text",
              "stylers": [
                {
                  "color": "#314420"
                }
              ]
            },
            {
              "featureType": "administrative",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "administrative.locality",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#0a0d06"
                }
              ]
            },
            {
              "featureType": "administrative.locality",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#0a0d06"
                }
              ]
            },
            {
              "featureType": "administrative.locality",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#0a0d06"
                }
              ]
            },
            {
              "featureType": "landscape",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#314420"
                }
              ]
            },
            {
              "featureType": "landscape",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "landscape.natural",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#a9c98b"
                }
              ]
            },
            {
              "featureType": "landscape.natural",
              "elementType": "labels.text",
              "stylers": [
                {
                  "color": "#314420"
                }
              ]
            },
            {
              "featureType": "landscape.natural",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#314420"
                }
              ]
            },
            {
              "featureType": "landscape.natural",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#808040"
                },
                {
                  "weight": 1
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#9fdedf"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text",
              "stylers": [
                {
                  "color": "#400040"
                },
                {
                  "visibility": "simplified"
                },
                {
                  "weight": 8
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "visibility": "on"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "visibility": "on"
                }
              ]
            }
          ];'use strict'

function initializeMap() {

	//"global"(to this function) vars for returning later
	var mapObj = {},
		markersArr = [],
		resultsArr = [],
		placesObj = {},
		directionsObj = {};

	var seattle = { lat: 47.6062, lng: -122.3321 };
	
	var currentCtr, 
		searchParam,
		userLoc,
		directionsDisplay;


	var returnObj = {

		//create map and make ready to add to DOM
		//custom map control functions
		//assign map button listeners
		createMap: function(ctr) {
			var map,
				containerIs500,
				mapEl = mapElements.mapEl,
				mapContainer = mapElements.mapContainer,
				controlDiv = mapElements.controlDiv,
				centerBtn = mapElements.centerBtn;

			var mapOptions = {
				center: ctr,
	            zoom: 15,
	            mapTypeId: 'roadmap',
	            tilt: 45,
	            heading: 0,
	            gestureHandling: 'cooperative',
	            zoomControl: true,
	            mapTypeControl: true,
	            streetViewControl: true,
	            rotateControl: true,
	            fullscreenControl: true,
	            streetViewControlOptions: { position: google.maps.ControlPosition.LEFT_BOTTOM  },
	            styles: mapStyles
			};
			var mapOptionsSmall = {
				//options for smaller viewport= removes ui controls except for zoom
	            center: ctr,
	            zoom: 12,
	            mapTypeId: 'roadmap',
	            heading: 0,
	            gestureHandling: 'greedy',
	            zoomControl: false,
	            mapTypeControl: false,
	            streetViewControl: false,
	            rotateControl: false,
	            fullscreenControl: false,
	            styles: mapStyles
			};
			
			controlDiv.id = "controlDiv";
			centerBtn.id = "center";
      		centerBtn.innerHTML = "Centered";
      		controlDiv.appendChild(centerBtn);
      		mapContainer.style.display = "block";
			containerIs500 = mapContainer.clientWidth > 500;	

			if (containerIs500) {
		    	map = new google.maps.Map(mapEl, mapOptions);
			   	map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(controlDiv);
		    	controlDiv.style.marginBottom = "25px";
	    	} else {
	        	map = new google.maps.Map(mapEl, mapOptionsSmall);
		    	map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(controlDiv);
		    };
		 
			mapObj = map;
			currentCtr = returnObj.getMapCtr();
			returnObj.assignMapListeners();
			
		},
	  	
	  	//#####event handlers######
		assignMapListeners: function() {
			var centerBtn = mapElements.centerBtn;

			google.maps.event.addDomListener(centerBtn, 'click', returnObj.setMapCenter);

            mapObj.addListener('center_changed', function() {
                centerBtn.style.fontWeight = 500;
                centerBtn.style.color = "rgb(0,0,0)";
                centerBtn.innerHTML = "Re-Center";
            })
		},

		highlightMarkerResult: function() {
			var target = document.getElementById(this.id);
			_dom.highlightTarget(target);
		},
		

		setMapCenter: function() {
			//uses map,setCenter but also other changes to zoom and centerBtn
			var map = mapObj;
			var centerBtn = mapElements.centerBtn;
			var ctr = currentCtr;
			
			map.setCenter(ctr);
            map.setZoom(15);
            !function() {
                centerBtn.style.fontWeight = 400;
                centerBtn.style.color = "rgb(86,86,86)";
                centerBtn.innerHTML = "Centered";
                }();
        },
		
		//#####categories search functions#####
		startSearch: function(fn) {
			var map = mapObj;
			var ctr;
			_dom.repositionSearchBar();
			if (Object.getOwnPropertyNames(map).length === 0) {
              	console.log('new map object- creating new map');
                returnObj.createMap(userLoc || seattle);
            } else {
              	console.log('existing map object');
              	//recenter map on new map bounds center
              	//clear initial loc value based on user loc
              	currentCtr = returnObj.getMapCtr();
              	returnObj.setMapCenter();
            };
            returnObj.callService();
		},

		callService: function() {
			var map = mapObj;
			var service = new google.maps.places.PlacesService(map);
			var searchEl = searchElements.searchInput;
						
			searchParam = JSON.parse(searchEl.dataset.searchparams);
            
            var request = {
                    location: returnObj.getMapCtr(),
                    rankBy: google.maps.places.RankBy.DISTANCE,
                    type: searchParam.type,
                    name: searchParam.name  
                };           

            service.nearbySearch(request, returnObj.searchCallback);
        },

        searchCallback: function(results,status) {
        	var i = 1;
        	var map = mapObj;
        	var icons = {
                donuts : {
                    url: "img/donut.png",
                    scaledSize: new google.maps.Size(40,40)
                },
                beers : {
                    url: "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
                    scaledSize: new google.maps.Size(30,30)
                },
                burgers: {
                    url: "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
                    scaledSize: new google.maps.Size(30,30)
                },
                coffee: {
                    url: "https://maps.gstatic.com/mapfiles/place_api/icons/cafe-71.png",
                    scaledSize: new google.maps.Size(30,30)
                },
                books : {
                    url: "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
                    scaledSize: new google.maps.Size(30,30)
                }
            };

            if (status == google.maps.places.PlacesServiceStatus.OK) {
            	resultsArr = results;
            	markersArr.forEach(function(marker){
                     marker.setMap(null);
                })
                markersArr = [];
                
                returnObj.removeExistingDirectionDisplay();

            	results.forEach(function(item) {
            		
					//create markers and add listeners from each item in results array
                    var marker = new google.maps.Marker({
                            id: item.place_id,
                            position: item.geometry.location,
                            icon: icons[searchParam.name],
                            map: map,
                            title: item.name + "\n" + item.vicinity,
                            label: '' + i + '',
                            vicinity: item.vicinity
                    });
                    marker.addListener('click',returnObj.highlightMarkerResult);
                    markersArr.push(marker);
                    i++;
            	})
            } else {
            	resultsArr = google.maps.places.PlacesServiceStatus;
            };

    		mapResults = resultsArr;
    		//prefer to call on dom.js (where function is declared) for clarity but need to call here because async maps callback 
            _dom.createResultsList()
                       
        },

        //#####places search functions#####

		searchPlaces: function(id) {
			var map = mapObj;
			var request = {
				placeId: id
			};
			var service = new google.maps.places.PlacesService(map);
			returnObj.removeExistingDirectionDisplay();
			service.getDetails(request, returnObj.placesCallback);
		},

		placesCallback: function(place,status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				placeResults = place;
				placesObj = place;
				_dom.expandPlacesDiv(placeResults.place_id)
			} else {
				placesObj = status;
			}
		},

		removeExistingDirectionDisplay: function() {
			if (directionsDisplay) {
				directionsDisplay.setMap(null);
			};
		},

		//#####directions search functions#####

		startDirections: function(location) {
			var map = mapObj;
			var directionsService;
			var request = {
				origin: userLoc || seattle,
				destination: location,
				travelMode: 'DRIVING'
			};
			returnObj.removeExistingDirectionDisplay();
			directionsDisplay = new google.maps.DirectionsRenderer();
			directionsService = new google.maps.DirectionsService();
			directionsDisplay.setMap(map);
			directionsService.route(request, returnObj.directionsCallback)
		},

		directionsCallback: function(result, status) {
			if (status == "OK") {
				directionsDisplay.setDirections(result);
				directionsObj = result;
				markersArr.forEach(function(marker){
					marker.setMap(null);
			});


			} else {
				console.log(status);
			};
		},

		//#####getters#####

		getMapCtr: function() {
			//if new map ctrs on seattle otherwise current center
			var map = mapObj;
			var ctr = Object.getOwnPropertyNames(map).length === 0? userLoc: map.getCenter().toJSON();
			return ctr;
		},

		getMapObj: function() {
			return mapObj;
		},

		getResultsArr: function() {
			return resultsArr;
		},

		getMarkersArr: function() {
			return markersArr;
		},

		getPlacesObj: function() {
			return placesObj;
		},

		getDirectionsObj: function() {
			return directionsObj;
		},

		getDirectionsDisplay: function() {
			return directionsDisplay;
		},

		//doesn't really 'set' it, just takes location and passes it to a variable
		setUserLoc: function(position) {
			userLoc = { 
			 	lat: _getUserLocation.getloc().coords.latitude,
			 	lng: _getUserLocation.getloc().coords.longitude
				 };
			return userLoc;
		}


	};
	return returnObj;
}

//console.log("search js");

!function searchControls() {

	var visibleOption = document.getElementById('visible-option');
	var nonVisibleOptions = document.getElementById('nonvisible-options');
	var nonVisibleLiItems = nonVisibleOptions.children;	
	var visible = false;

	function showOptions() {
		visibleOption.children[0].style.animation = "";
		if (!visible) {
			visibleOption.children[0].innerHTML = "Show me..."
			nonVisibleOptions.style.visibility = "visible";
			visible = true;
		} else {
			nonVisibleOptions.style.visibility = "hidden";
			visible = false;
		}
	}

	function selectOption() {
		
		visibleOption.children[0].innerHTML = this.innerHTML;
		visibleOption.children[0].dataset.searchparams = this.dataset.searchparams;
		visibleOption.children[0].style.animation += "selection .15s linear 2";
		nonVisibleOptions.style.visibility = "hidden";
		visible = false;
		if (visibleOption.children[0].innerHTML !== "Show me...") {
			_gmaps.startSearch()
		};
	}

	visibleOption.addEventListener('click', showOptions);

	for (var i = 0; i < nonVisibleLiItems.length; i++) {
		var element = nonVisibleLiItems[i];
		element.onclick = selectOption;	
	};

}()



function dom() {
	var	windowIs760 = container.clientWidth >= 760,
		
		returnObj = {

		repositionSearchBar: function() {
			var searchBar = document.getElementById('searchBar');
			if (windowIs760) {
				searchBar.style.margin = "10px 0 0";
			} else {
				searchBar.style.margin = "10px auto 0";
			};
		},

		createResultsList: function() {
			var i = 1;

			resultsElements.resultsUl.innerHTML = "";
			resultsElements.resultsLiArr = [];
			resultsElements.resultsList.style.visibility = "visible";
			resultsList.scrollTop = 0;
			mapResults = _gmaps.getResultsArr();
			mapResults.forEach(function(item){
				var li = document.createElement('li');
				var expandLink;

				li.innerHTML = "<h2>" + i + ". " + item.name + "</h2><p>" + item.vicinity + "</p><div class='expand'><p>More</p></div><div class='placeInfo'></div>";
  				li.id = item.place_id;
  				li.location = item.geometry.location;
  				resultsElements.resultsLiArr.push(li);
  				li.onclick = _dom.centerOnResult;
  				resultsElements.resultsUl.appendChild(li);
  				resultsElements.resultsList.appendChild(resultsElements.resultsUl);
  				expandLink = li.querySelector('.expand p');
				
				expandLink.addEventListener('click', function() {
					_dom.placesTarget(li.id);
  				});
  				
	  			if (windowIs760) {
	  				resultsList.style.height = "90vh";
	  			} else {
	            	resultsList.style.height = "400px";
	  			};
	  			i++;
			});
		},

		centerOnResult: function() {
			var map = _gmaps.getMapObj();
			
			_gmaps.getMapObj().setCenter(this.location);
			_gmaps.getMapObj().setZoom(15);
			//if directions lookup would have cleared markers- re-add to map
			_gmaps.getMarkersArr().forEach(function(marker){
				if (marker.map === null) {
					marker.setMap(map);
				};
			});
			
		},

		highlightTarget: function(target) {
			var targetOffSet = target.offsetTop-300;
			target.style.animation = "";
			resultsElements.resultsList.scrollTop = targetOffSet;
			target.style.animation = "flash .5s";
		},

		placesTarget: function(id) {
			var target = document.getElementById(id);
			_gmaps.searchPlaces(id);
		},

		setOpenClosed: function(openOrClosed) {
			if (openOrClosed.open_now) {
				//el.className = "open";
				return 'Open Now'
			} else {
				//el.className = "closed";
				return 'Closed';
			};
		},

		expandPlacesDiv: function(targetEl) {
			var target = document.getElementById(targetEl);
			var addr = placeResults.formatted_address || "none";
			var openOrClosed = placeResults.opening_hours || "none";
			var testIfOpen = returnObj.setOpenClosed(openOrClosed) || "none";
			var openClosedEl;
			var directionsBtn;
			
			placesElements.placesUl.innerHTML = "";
			placesElements.placesUl.innerHTML = '<li>' + placeResults.formatted_address + '</li> <li id="buttons"> <button class="btn-contact btn-directions">Directions</button><a href="tel:'+ placeResults.formatted_phone_number + '"><button class="btn-contact btn-phone">Phone</button></a><a target="_blank" href="' + placeResults.website + '"><button class="btn-contact btn-website">Website</button></a> </li> <li id="open-or-closed">' + testIfOpen + '</li>'; 
			
			placesElements.openHoursLi.class = "open-hours";
			placesElements.openHoursLi.innerHTML = '<div> <ul>';
			
			//some results didnt have opening hours - note and handle this error condition
			if(openOrClosed.open_now !== undefined) {
				placeResults.opening_hours.weekday_text.forEach(function(item){
					placesElements.openHoursLi.innerHTML += '<li>' + item + '</li>';
				})
			};

			placesElements.openHoursLi.innerHTML += "</ul></div></li>";
			
			placesElements.placesUl.appendChild(placesElements.openHoursLi);
			placesElements.placeInfo = target.querySelectorAll('.placeInfo')[0];
			//placesElements.placeInfo.innerHTML = "";
			
			placesElements.placeInfo.appendChild(placesElements.placesUl);
			
			openClosedEl = document.getElementById('open-or-closed');
			if (openOrClosed.open_now) {
				openClosedEl.className = "open";
			} else {
				openClosedEl.className = "closed";
			};

			directionsBtn = document.querySelector('.btn-directions');
			directionsBtn.addEventListener('click', function() {
				_gmaps.startDirections(placeResults.geometry.location);
		});
			
		}
	};

	return returnObj;

}



//to do-add callout marker showing location; add marker showing item centered upon

//script sequence:
//elements.js
//location.js
//mapStyles.js
//map.js
//search.js
//dom.js
//main.js

'use strict'
var _gmaps = initializeMap(),
	_dom = dom(),
	_getUserLocation = getUserLocation(),
	mapResults = [],
	placeResults = {};

navigator.geolocation.getCurrentPosition(function(position){
	_getUserLocation.setLocation(position);
	});  //add error handler; 

			
searchElements.searchBtn.addEventListener('click', function() {
	if (document.getElementById('visible-option').children[0].innerHTML !== "Show me...") {
		_gmaps.startSearch();	
	};
})









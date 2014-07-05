var map;
var latitud;
var longitud;
var xmlDoc = loadXml("points.xml");
var marker;
var markersArray = [];


function loadXml(xmlUrl) {
	var xmlhttp;

	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	} else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("GET", xmlUrl, false);
	xmlhttp.send();
	xmlDoc = xmlhttp.responseXML;
	return xmlDoc;
}

function createMarkers(xmlDoc) {



		var items = xmlDoc.getElementsByTagName('point');

		for (var i = 0; i < items.length; i++) {

			var lat = items[i].getElementsByTagName('latitud')[0].childNodes[0];
			var long = items[i].getElementsByTagName('longitud')[0].childNodes[0];
			var latlng = new google.maps.LatLng(lat.nodeValue, long.nodeValue);

			var name = items[i].getElementsByTagName('name')[0].childNodes[0].nodeValue;
			var address = items[i].getElementsByTagName('address')[0].childNodes[0].nodeValue;
			var phone = items[i].getElementsByTagName('phone')[0].childNodes[0].nodeValue;

			addMarker(map, name, address, phone, latlng);

		}


} // end createMarkers


function addMarker(map, name, address, phone, latlng) {

	var contentString = '';
	contentString += '<div>';
	contentString += '<b>Name:</b>' + name + '<br/>';
	contentString += '<b>Address:</b>' + address + '<br/>';
	contentString += '<b>Phone:</b>' + phone + '<br/>';
	contentString += '</div>';

	var infowindow = new google.maps.InfoWindow({
		content: contentString
	});

	var markerPoint = new google.maps.Marker({
		position: latlng,
		map: map,
		icon: 'images/punto.png',
		title: name
	});

	google.maps.event.addListener(markerPoint, 'click', function() {
		infowindow.open(map, markerPoint);
	});

	markersArray.push(markerPoint);

}

function locateMe() {
	if (navigator.geolocation) { /* Si el navegador tiene geolocalizacion */
		navigator.geolocation.getCurrentPosition(coordinates, errors, {
			maximumAge: 3000,
			timeout: 15000,
			enableHighAccuracy: true
		});

	} else {
		alert("Oops! Your browser does not support geolocation. Chrome download, it's free!");
	}

} // end loacalizame

function coordinates(position) {
	latitud = position.coords.latitude; /* Guardamos nuestra latitud */
	longitud = position.coords.longitude; /* Guardamos nuestra longitud */
	loadMap();
} // end coordinates

function errors(err) {
	/* Controlamos los posibles errors */
	if (err.code == 0) {
		alert("Oops! Something has gone wrong");
	}
	if (err.code == 1) {
		alert("Oops! you have not agreed to share your position");
	}
	if (err.code == 2) {
		alert("Oops! Can not get the current position");
	}
	if (err.code == 3) {
		alert("Oops! We have exceeded the timeout");
	}
} // end errors

function loadMap() {
	var latlon = new google.maps.LatLng(latitud, longitud);
	/*
	 * Creamos un punto
	 * con nuestras
	 * coordinates
	 */
	var myOptions = {

		zoom: 15,
		center: latlon,
		/* Definimos la posicion del mapa con el punto */
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};


	var actualHeight = getActualContentHeight();
	$("#map_canvas").css("height", actualHeight);

	map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);

	var mapDiv = document.getElementById('map_canvas');

	google.maps.event.addDomListener(mapDiv, 'resize', function() {

		google.maps.event.trigger(map, 'resize');
	});

	var coorMarker = new google.maps.LatLng(latitud, longitud);

	marker = new google.maps.Marker({ /* Creamos un marker */

		position: coorMarker,
		/* Lo situamos en nuestro punto */
		map: map,
		/* Lo vinculamos a nuestro mapa */
		icon: 'images/green-dot.png',
		title: "Where am I?"
	});



} // end loadMap

function showMyPoints() {
	createMarkers(xmlDoc);
}


function removePoints() {
	if (markersArray) {
		for (i in markersArray) {
			markersArray[i].setMap(null);
		}
		markersArray.length = 0;
	}

}

function getActualContentHeight() {

	var header = $.mobile.activePage.find("div[data-role='header']:visible");
	var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
	var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");
	var viewport_height = $(window).height();
	var content_height = viewport_height - header.outerHeight() - footer.outerHeight();

	if ((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
		content_height -= (content.outerHeight() - content.height());
	}
	return content_height;

}
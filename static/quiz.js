//the globals
var contentString = ""
var infowindow
var geocoder;
var chartBase = 'https://chart.googleapis.com/chart?chst='; //defines what icon appears when you click
var marker; //variable to hold the icon when you click
var centers ={'Africa':[0, 20, 3], 'Europe': [50, 25, 3], 'Asia': [20,90, 3], 'Americas': [0,-75, 2], 'Oceania':[-25, 180, 3]};
var picked;

function pickCountry(){
  var length = countries.length;
  var random = Math.floor( (Math.random()*249));
  var data = countries[random];
  return data;
}



function playGame() {
  var target = pickCountry();

  console.log("target ="+ target.name);
  initialize(target);
}    




function getCurrentCountryQuiz() {
  return document.getElementById('country').value;
}

var map;

function eqfeed_callback(results) {
    map.data.addGeoJson(results);
}

//gotten from http://gmaps-samples-v3.googlecode.com/svn/trunk/country_explorer/country_explorer.html
function getCountryQuiz(results) {
    var geocoderAddressComponent,addressComponentTypes,address;
    for (var i in results) {
        geocoderAddressComponent = results[i].address_components;
        for (var j in geocoderAddressComponent) {
            address = geocoderAddressComponent[j];
            addressComponentTypes = geocoderAddressComponent[j].types;
            for (var k in addressComponentTypes) {
                if (addressComponentTypes[k] == 'country') {
                    return address;
                }
            }
        }
    }
    return 'Unknown';
}




function getTargetCountry(country) {
    console.log(country);
  geocoder.geocode( { 'address': country }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var targetMarker = new google.maps.Marker({
	map: map,
	position: results[0].geometry.location
       });
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function getIso3ByName(name) {
    for(var i = 0; i < countries.length; i++) {
        if(name == countries[i].name) {
            return countries[i].alpha_3
        }
    }
    console.log("that's not a country")
}

function getIso2ByName(name) {
    for(var i = 0; i < countries.length; i++) {
        if(name == countries[i].name) {
            return countries[i].alpha_2
        }
    }
    console.log("that's not a country")
}

function getCountryIcon(country){
    return chartBase + 'd_simple_text_icon_left&chld=' + escape(country.long_name) + '|14|999|flag_' + country.short_name.toLowerCase() + '|24|000|FFF';
}

function getMsgIcon(msg){
    return  chartBase + 'd_bubble_text_small&chld=edge_bl|' + msg + '|C6EF8C|000000';
}

function initialize(target) {
    // created using http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
    var styleOff = [{ visibility: 'off' }];
    var stylez = [
        { featureType: 'administrative', elementType: 'labels', stylers: styleOff },
        { featureType: 'administrative.province', stylers: styleOff },
        { featureType: 'administrative.locality', stylers: styleOff },
        { featureType: 'administrative.neighborhood', stylers: styleOff },
        { featureType: 'administrative.land_parcel', stylers: styleOff },
        { featureType: 'poi', stylers: styleOff },
        { featureType: 'landscape', stylers: styleOff },
        { featureType: 'road', stylers: styleOff }
    ];
    geocoder = new google.maps.Geocoder();
    var mapDiv = document.getElementById('map_canvas');
   
    var mapCenter = centers[target.region];
    console.log("center = "+mapCenter);
    var map = new google.maps.Map(mapDiv, {
	    center: new google.maps.LatLng({lat:mapCenter[0], lng:mapCenter[1]}),
        zoom: mapCenter[2],
        mapTypeId: 'Border View',
        draggableCursor: 'pointer',
        draggingCursor: 'wait',
        mapTypeControlOptions: {
            mapTypeIds: ['Border View']
        }
    });
    
    marker = new google.maps.Marker({
	    map: map
	});
    var containerP = document.getElementById('container');
    containerP.innerHTML = "Where in "+target.region+" is "+target.name+" located?<br>"+
	"(You may need to zoom in or out)";


    var customMapType = new google.maps.StyledMapType(stylez, {name: 'Border View'});
    map.mapTypes.set('Border View', customMapType);
    
    google.maps.event.addListener(map, 'click', function(mouseEvent) {
        contentString = ""

        geocoder.geocode(
            {'latLng': mouseEvent.latLng},
            function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var country = getCountryQuiz(results);
                    var iso3 = getIso3ByName(country.long_name);
                    console.log('COUNTRY NAME IS: ' + country.long_name);
                    console.log('ISO3 IS: ' + iso3);
                    console.log('COUNTRY SHORT NAME IS: ' + country.short_name);
                    console.log(country);
                    
                    // Info Window
                    marker.setPosition(mouseEvent.latLng);
                    marker.setIcon(getCountryIcon(country));
		    picked = country.short_name;
            if (picked === target.alpha_2){
                while (containerP.firstChild) {
                    containerP.removeChild(containerP.firstChild);
                }
                var btn = document.createElement("BUTTON");        // Create a <button> element                            // Append the text to <button>   
                btn.setAttribute('type', 'submit');
                btn.setAttribute('onclick', 'window.location.reload()');
                containerP.innerHTML = "You're right, that's "+country.long_name+"!";
                var t = document.createTextNode("Congratulations. Click to play again");       // Create a text node
                btn.appendChild(t);    
                containerP.appendChild(btn); 
		    } else {
                while (containerP.firstChild) {
                    containerP.removeChild(containerP.firstChild);
                }
                var btn = document.createElement("BUTTON");        // Create a <button> element                            // Append the text to <button>   
                btn.setAttribute('type', 'submit');
                btn.setAttribute('onclick', 'window.location.reload()');
                containerP.innerHTML = "";
                containerP.innerHTML = "No, I'm sorry, that's "+country.long_name+".";
                var t = document.createTextNode("Click to play again");       // Create a text node
                btn.appendChild(t);    
                containerP.appendChild(btn);
		    }
                }
                if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
                    marker.setPosition(mouseEvent.latLng);
                    marker.setIcon(getMsgIcon('Oops, I have no idea, are you on water?'));
		    return null;
                }
                if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                    marker.setPosition(mouseEvent.latLng);
                    marker.setIcon(
                    getMsgIcon('Whoa! Hold your horses :) You are quick! ' + 'too quick!'));
                    return null;
                }
            }
	 );
    });



}
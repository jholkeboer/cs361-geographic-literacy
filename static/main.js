//the globals
var contentString = ""
var infowindow
var geocoder;
var chartBase = 'https://chart.googleapis.com/chart?chst='; //defines what icon appears when you click
var marker; //variable to hold the icon when you click
var gdp;
var pop;

function getCurrentCountry() {
  return document.getElementById('country').value;
}

function getNews() {
  var newsApi = 'https://ajax.googleapis.com/ajax/services/search/news?v=1.0&q=';
  $.ajax({
    url: newsApi + getCurrentCountry(),
    dataType: 'jsonp',
    success: processNews
  });
}

function getNewsOnClick(countryName) {
    var newsApi = 'https://ajax.googleapis.com/ajax/services/search/news?v=1.0&q=';
    $.ajax({
        url: newsApi + countryName,
        dataType: 'jsonp',
        success: processNews
    });
}

function getOverview(iso3) {
    $('#country-basics').html("<ul><li id='population'></li><li id='gdp'></li></ul>")
    getGDPOnClick(iso3)
    getPOPOnClick(iso3)
}

function getGDPOnClick(iso3) {
    console.log("getGDPOnClick");
    var gdpApi = 'http://gpi.tschuy.com:5000/countries/';
    $.ajax({
        url: gdpApi + iso3 + "/indicators/NY.GDP.MKTP.CD/?date=2014:2014&format=json",
        dataType: 'text',
        success: processGDP
    });
}

function getPOPOnClick(iso3) {
    console.log("getPOPOnClick");
    var gdpApi = 'http://gpi.tschuy.com:5000/countries/';
    $.ajax({
        url: gdpApi + iso3 + "/indicators/SP.POP.TOTL/?date=2014:2014&format=json",
        dataType: 'text',
        success: processPOP
    });
}

function getWeather(iso3) {

  console.log('weather for ' + iso3);
  var weatherApi = 'http://climatedataapi.worldbank.org/climateweb/rest/v1/country/mavg/tas/1980/1999/'
  var weatherApiEnd = '.json?callback=processweather'
  $.ajax({
    url: weatherApi + iso3 + weatherApiEnd,
    dataType: 'jsonp'
  });
}

// needs to be lowercase because the World Bank APi drops case
function processweather(data) {
  // monthly temperatures, which can be graphed to see the "climate"
    $('#weather-table tbody').html('<tr><th><th><td>Degrees(C)</td></tr>')
    console.log(data[0].monthVals);
    var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
    ]
    for (var i = 0; i < data[0].monthVals.length; i++) {
        $('#weather-table tbody').append(
            $('<tr>').append(
                $('<th>').text(months[i]),
                $('<td>').text(data[0].monthVals[i])
            )
        )
    }
}

function processGDP(data) {
    console.log("processGDP");
    console.log(data);
    
    gdp = JSON.parse(data);
    console.log(gdp);
    console.log(gdp[1][0].value);
    
    gdp = gdp[1][0].value;
    $('#country-basics').append($('<ul>').append($('#gdp')).append('<b>GDP</b>: ' + gdp))
}

function processPOP(data) {
    console.log("processPOP");
    console.log(data);
    
    pop = JSON.parse(data);
    console.log(pop);
    console.log(pop[1][0].value);
    
    pop = pop[1][0].value;
    $('#country-basics').append($('<ul>').append($('#population')).append('<b>Pop</b>: ' + pop))
}

function processNews(data) {
    console.log(data.responseData.results)
    $('#news-list').html('');
    // this is where the news items actually live in the JSON response
    for(var i = 0; i < data.responseData.results.length; i++) {
        // var newsNum = i + 1
        // contentString = contentString + newsNum + ". " + data.responseData.results[i]['content'] + '<br>' + "<a href='http://" + data.responseData.results[i]['url'] + "'>" + data.responseData.results[i]['unescapedUrl'] + "</a>" + '<br><hr>'
        $('#news-list').append($('<li>').append($('<a>',{
            text: data.responseData.results[i].titleNoFormatting,
            title: "News Link " + (i+1).toString(),
            href: data.responseData.results[i].unescapedUrl
        })))
    }
    
    infowindow = new google.maps.InfoWindow({content: contentString});

    marker.addListener('click', function() {
        infowindow.open(map, marker);
  });

}


var map;

function eqfeed_callback(results) {
    map.data.addGeoJson(results);
}

//gotten from http://gmaps-samples-v3.googlecode.com/svn/trunk/country_explorer/country_explorer.html
function getCountry(results) {
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

function getIso3ByName(name) {
    for(var i = 0; i < countryData.length; i++) {
        if(name == countryData[i].name) {
            return countryData[i].alpha_3
        }
    }
    console.log("that's not a country")
}

function getIso2ByName(name) {
    for(var i = 0; i < countryData.length; i++) {
        if(name == countryData[i].name) {
            return countryData[i].alpha_2
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

function initialize() {
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
    var map = new google.maps.Map(mapDiv, {
        center: new google.maps.LatLng(53.012924,18.59848),
        zoom: 4,
        mapTypeId: 'Border View',
        draggableCursor: 'pointer',
        draggingCursor: 'wait',
        mapTypeControlOptions: {
            mapTypeIds: ['Border View']
        }
    });
    
    var customMapType = new google.maps.StyledMapType(stylez, {name: 'Border View'});
    map.mapTypes.set('Border View', customMapType);
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(53.012924,18.59848),
        map: map
    });
    
    google.maps.event.addListener(map, 'click', function(mouseEvent) {
        contentString = ""
        var redMarkerIcon = chartBase + 'd_map_xpin_letter&chld=pin|+|C40000|000000|FF0000'; 
        marker.setIcon(redMarkerIcon);

        //map.setCenter(mouseEvent.latLng);
        geocoder.geocode(
            {'latLng': mouseEvent.latLng},
            function(results, status) {
                var headingP = document.getElementById('country');
                if (status == google.maps.GeocoderStatus.OK) {
                    var country = getCountry(results);
                    var iso3 = getIso3ByName(country.long_name);
                    console.log('COUNTRY NAME IS: ' + country.long_name);
                    console.log('ISO3 IS: ' + iso3);
                    console.log(country);
                    
                    // Info Window
                    marker.setPosition(mouseEvent.latLng);
                    marker.setIcon(getCountryIcon(country));

                    getNewsOnClick(country.long_name);
                    getWeather(iso3);
                    getOverview(iso3)
                   // getGDPOnClick(iso3);
                  //  getPOPOnClick(iso3);
                    headingP.innerHTML = country.long_name;
                    
                    $('#country-name').text(country.long_name);

                    $('#country-info-panel').css({'display': "inline"});
                }
                if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
                    marker.setPosition(mouseEvent.latLng);
                    marker.setIcon(getMsgIcon('Oups, I have no idea, are you on water?'));
                    headingP.innerHTML = 'Oups, ' + 'I have no idea, are you on water?';
                    
                    $('#country-info-panel').css({'display': "none"});
                }
                if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                    marker.setPosition(mouseEvent.latLng);
                    marker.setIcon(
                    getMsgIcon('Whoa! Hold your horses :) You are quick! ' + 'too quick!'));
                    headingP.innerHTML = 'Whoa! You are just too quick!';
                    
                    $('#country-info-panel').css({'display': "none"});
                }
            }
        );
    });
}
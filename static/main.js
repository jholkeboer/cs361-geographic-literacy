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

function getWeather() {
  if (getCurrentCountry() !== 'USA') {
      // we need to wait until this is a jVectorMap call, since then we'll be
      // able to get the 3-letter ISO code of the country.
      return alert('enter USA please');
  }
  console.log('weather for ' + getCurrentCountry());
  var weatherApi = 'http://climatedataapi.worldbank.org/climateweb/rest/v1/country/mavg/tas/1980/1999/'
  var weatherApiEnd = '.json?callback=processweather'
  $.ajax({
    url: weatherApi + getCurrentCountry() + weatherApiEnd,
    dataType: 'jsonp'
  });
}

// needs to be lowercase because the World Bank APi drops case
function processweather(data) {
  // monthly temperatures, which can be graphed to see the "climate"
  console.log(data[0].monthVals);
}

function processNews(data) {
  // this is where the news items actually live in the JSON response
  console.log(data.responseData.results);
}

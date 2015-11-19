function getCurrentCountry() {
  return document.getElementById('country').value;
}

function getWeather() {
  console.log('weather for ' + getCurrentCountry());
}

function getNews() {
  console.log('news for ' + getCurrentCountry());
}

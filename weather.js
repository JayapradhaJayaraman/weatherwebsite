const apikey = "1dcabccb51cca92a6af63ca906714554";
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let lon = position.coords.longitude;
      let lat = position.coords.latitude;
      const url =
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` +
        `lon=${lon}&appid=${apikey}`;
      const base = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;

      fetch(base)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          airPollution(data);
          console.log("air pollution data", data);
        });

      fetch(url)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log("weather data", data);
          weatherReport(data);
        });
    });
  }
});

function searchByCity() {
  var place = document.getElementById("input").value;
  var urlsearch =
    `http://api.openweathermap.org/data/2.5/weather?q=${place}&` +
    `appid=${apikey}`;

  fetch(urlsearch)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      weatherReport(data);
    });
  document.getElementById("input").value = "";
  let locationKey = "c08ef6403f64880487e776a3791a31616fa6ecc";
  const locationdetails = `https://api.geocod.io/v1.6/geocode?q=${encodeURIComponent(
    place
  )}&api_key=${locationKey}`;
  let lat = "";
  let lon = "";
  fetch(locationdetails)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      lat = data.results[0].location.lat;
      lon = data.results[0].location.lng;
      console.log("longitute and latitude", data);

      const basesearch = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;

      fetch(basesearch)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          airPollution(data);
          console.log("particular location air pollution data", data);
        });
    });
}

function weatherReport(data) {
  var urlcast =
    `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&` +
    `appid=${apikey}`;

  let feelsLike = data.main.feels_like - 273;
  document.getElementById("feelsLike").innerText =
    feelsLike.toFixed(2) + " " + "°C";

  let humidity = data.main.humidity;
  document.getElementById("humidity").innerText = humidity.toFixed(2);

  let pressure = data.main.pressure;
  document.getElementById("pressure").innerText = pressure;

  let wind = data.wind.speed;
  document.getElementById("wind").innerText = wind + " " + "KM/H";

  let sunrise = data.sys.sunrise;
  var dateUTCsunrise = new Date(sunrise * 1000);
  document.getElementById("sunrise").innerText =
    dateUTCsunrise.toLocaleTimeString("en-US");
  let sunset = data.sys.sunset;
  var dateUTCsunset = new Date(sunset * 1000);
  document.getElementById("sunset").innerText =
    dateUTCsunset.toLocaleTimeString("en-US");

  fetch(urlcast)
    .then((res) => {
      return res.json();
    })
    .then((forecast) => {
      hourForecast(forecast);
      dayForecast(forecast);
      document.getElementById("city").innerText =
        data.name + ", " + data.sys.country;

      document.getElementById("temperature").innerText =
        Math.floor(data.main.temp - 273) + " °C";
      document.getElementById("clouds").innerText = data.weather[0].description;
    });
}

function hourForecast(forecast) {
  document.querySelector(".templist").innerHTML = "";

  for (let i = 0; i < 5; i++) {
    var date = new Date(forecast.list[i].dt * 1000);

    let hourR = document.createElement("div");
    hourR.setAttribute("class", "next");

    let div = document.createElement("div");
    let time = document.createElement("p");
    time.setAttribute("class", "time");

    time.innerText = date
      .toLocaleTimeString(undefined, "Asia/Kolkata")
      .replace(":00", "");

    let temp = document.createElement("p");

    temp.innerText =
      Math.floor(forecast.list[i].main.temp_max - 273) +
      " °C" +
      " / " +
      Math.floor(forecast.list[i].main.temp_min - 273) +
      " °C";

    div.appendChild(time);
    div.appendChild(temp);

    let desc = document.createElement("p");
    desc.setAttribute("class", "desc");
    desc.innerText = forecast.list[i].weather[0].description;

    hourR.appendChild(div);
    hourR.appendChild(desc);
    document.querySelector(".templist").appendChild(hourR);
  }
}

function dayForecast(forecast) {
  document.querySelector(".weekF").innerHTML = "";
  for (let i = 8; i < forecast.list.length; i += 8) {
    let div = document.createElement("div");
    div.setAttribute("class", "dayF weather");
    let content = document.createElement("div");
    content.setAttribute("class", "content");
    div.appendChild(content);
    let day = document.createElement("p");
    day.setAttribute("class", "date");
    day.innerText = new Date(forecast.list[i].dt * 1000).toDateString(
      undefined,
      "Asia/Kolkata"
    );

    content.appendChild(day);

    let temp = document.createElement("p");
    temp.innerText =
      Math.floor(forecast.list[i].main.temp_max - 273) +
      " °C" +
      " / " +
      Math.floor(forecast.list[i].main.temp_min - 273) +
      " °C";
    content.appendChild(temp);

    let description = document.createElement("p");
    description.setAttribute("class", "desc");
    description.innerText = forecast.list[i].weather[0].description;
    content.appendChild(description);

    document.querySelector(".weekF").appendChild(div);
  }
}

function airPollution(data) {
  const response = data.list[0].components;
  let airQuality = document.getElementById("airQuality");

  airQualityValue = data.list[0].main.aqi;
  console.log("airQualityValue", airQualityValue);

  if (airQualityValue === 1) {
    airQuality.innerText = "Good";
  } else if (airQualityValue === 2) {
    airQuality.innerText = "Fair";
  } else if (airQualityValue === 3) {
    airQuality.innerText = "Moderate";
  } else if (airQualityValue === 4) {
    airQuality.innerText = "Poor";
  } else if (airQualityValue === 5) {
    airQuality.innerText = "Very Poor";
  }

  let co = document.getElementById("co");
  co.innerText = response.co;

  let nh3 = document.getElementById("nh3");
  nh3.innerText = response.nh3;

  let no = document.getElementById("no");
  no.innerText = response.no;

  let no2 = document.getElementById("no2");
  no2.innerText = response.no2;

  let o3 = document.getElementById("o3");
  o3.innerText = response.o3;

  let so2 = document.getElementById("so2");
  so2.innerText = response.so2;
}

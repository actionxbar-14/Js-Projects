const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');
const weatherInfoSection = document.querySelector('.weather-info');
const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt'); 
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value');
const windValueTxt = document.querySelector('.wind-value');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDateTxt = document.querySelector('.current-date-txt');

const forecastItemContainer = document.querySelector('.forcast-item-container');

const apiKey = 'dab8db4a8b2bc65ce30e751393a69bd1';


function getCurrentDate() {
    const CurrentDate = new Date();
    const options = { 
        day: '2-digit', 
        month: 'short',
        year: 'numeric'
    };

    let formattedDate = CurrentDate.toLocaleDateString('en-GB', options);
    let parts = formattedDate.split(' ');
    return `${parts[1]} ${parts[0]}, ${parts[2]}`;
}

// function getCurrentDate(){
//     const CurrentDate = new Date();
//     const options = { 
//         weekday: 'short', 
//         year: '2-digit', 
//         month: 'short'
//     }
//     return CurrentDate.toLocaleDateString('en-GB',options);

// }

function getWeatherIcon(id){
    // console.log(id);
    if(id <= 232) return 'thunderstorm.svg';
    if(id <= 321) return 'drizzle.svg';
    if(id <= 531) return 'rain.svg';
    if(id <= 622) return 'snow.svg';
    if(id <= 781) return 'atmosphere.svg';
    if(id <= 800) return 'clear.svg';
    else return 'clouds.svg';
}



searchBtn.addEventListener('click',()=>{
    if(cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value);
        cityInput.value='';
        cityInput.blur();
    }
    
});

cityInput.addEventListener('keydown',(event)=>{
    if(event.key=='Enter' && cityInput.value.trim()!=''){
        updateWeatherInfo(cityInput.value);
        cityInput.value='';
        cityInput.blur();
    }
});

 async function getFetchData(endPoint,city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=dab8db4a8b2bc65ce30e751393a69bd1&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}



async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather',city);
    if(weatherData.cod != 200){
        showDisplaySection(notFoundSection);
        // return
    }

    const {
        name: country,
        main : {temp,humidity},
        weather : [{id,main}],
        wind : {speed}
    } = weatherData;

    countryTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + '°C';
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = humidity + '%';
    windValueTxt.textContent = Math.round(speed) + ' km/h';


   currentDateTxt.textContent = getCurrentDate();
   weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;

   
   

    
    console.log(weatherData);
    await updateForecastInfo(city);
    showDisplaySection(weatherInfoSection);
    // console.log(weatherData);
}

async function updateForecastInfo(city){
    const forecastData = await getFetchData('forecast',city);
    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forecastItemContainer.innerHTML = '';

    forecastData.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
           updateForecastItems(forecastWeather);
        } 
    })
    // console.log(todayDate)
    // console.log(forecastData);
}

function updateForecastItems(weatherData){
      console.log(weatherData);
      const {
        dt_txt : date,
        weather : [{id}],
        main : { temp }
      } = weatherData

      const dateTaken = new Date(date);
      const dateOption = {
        day : '2-digit',
        month : 'short'
      }

      const dateResult = dateTaken.toLocaleDateString('en-US',dateOption);

      const forecastItem = `
      
        <div class="forcast-item">
             <h5 class="forcast-item-date regular-txt">${dateResult}</h5>
             <img src="assets/weather/${getWeatherIcon(id)}" alt="">
             <h5 class="forcast-item-temp">${Math.round(temp)}°C</h5>
        </div>
      
      `

      forecastItemContainer.insertAdjacentHTML('beforeend',forecastItem);
     
}



function showDisplaySection(section){
    [weatherInfoSection,searchCitySection,notFoundSection]
    .forEach(section=> section.style.display='none');

    section.style.display = 'block';
}

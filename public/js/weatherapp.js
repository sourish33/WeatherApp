
const button = document.getElementById("submitBtn")
const formInput = document.getElementById("formInput")
const alerttext = document.getElementById("alerttext")
const alertbtn = document.getElementById("alertCloseButton")
const alertbody = document.getElementById("alertbody")
const hourlyButton = document.getElementById("hourly-forecast-button")
const dailyButton = document.getElementById("daily-forecast-button")
const dailyForecastBody = document.getElementById("daily-forecast-container")
const hourlyForecastBody = document.getElementById("hourly-forecast-container")



const fillCurrentData = (data) => {
    const { lat, long, current, hourly, daily, alerts, name, aqi } = data
    const [cmHg, atm] = convertPressure(current.pressure)
    const aqilevel = aqiDangerLevel(aqi)
    const wind = current["wind_speed"] === 0 ? 'None' : `${current["wind_speed"].toFixed(0)} mph, ${dirFromDeg(current["wind_deg"])}`
    console.log(current["wind_deg"])
    document.getElementById("current-location").innerHTML = name
    document.getElementById("lat").innerHTML = lat.toFixed(2)
    document.getElementById("long").innerHTML = long.toFixed(2)
    document.getElementById("image").src = `/img/icons/${current.weather[0].icon}.png`
    document.getElementById("desc").innerHTML = current.weather[0].description
    document.getElementById("temp").innerHTML = `${current.temp.toFixed(0)} ${String.fromCharCode(176)}F`
    document.getElementById("wind").innerHTML = wind
    document.getElementById("pressure").innerHTML =`${cmHg} cmHg (${atm} atm)`
    document.getElementById("aqi").innerHTML = `<p class="${aqiColors[aqilevel]} aqi-para">${aqi}, ${aqilevel}</p>`
    document.getElementById("humidity").innerHTML =`${current["humidity"].toFixed(0)}%`

    if (alerts) {
        document.getElementById("alertrow").style.display = "block"
        document.getElementById("event").innerHTML = alerts[0].event
        document.getElementById("startTime").innerHTML = getTime(
            alerts[0].start
        )
        document.getElementById("endTime").innerHTML = getTime(alerts[0].end)
        document.getElementById("alerttext").innerHTML = alerts[0].description
    }
}

const fillSingleHour = (oneHour) => {
    const { dt, temp, wind_speed, wind_deg, weather, pop } = oneHour
    const precipProb = parseFloat(pop) * 100
    const precip = `<p>Precipitation chance: ${precipProb.toFixed(0)}%</p>`
        // precipProb > 1 ? `<p>Precip. chance: ${precipProb.toFixed(0)}%</p>` : ``
    const hourly = document.getElementById("hourlyTable")
    const newData = `
        <div class= "mt-4  col-lg-4 col-md-6 col-sm-12">
        <div class="card hourly">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" class="bold">
                            Time
                        </th>
                        <th scope="col" class="bold">
                            Temp
                        </th>
                        <th scope="col" class="bold">
                            Weather
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">
                            <span class="bold">${getTimeShort(dt)}</span>
                        </th>
                        <td>
                            ${temp.toFixed(0)} ${String.fromCharCode(176)}F
                        </td>
                        <td>
                            <p>${weather[0].main}</p>
                            <div class="imgbgd">
                                <img
                                    src="/img/icons/${weather[0].icon}.png"
                                    alt="weather icon"
                                />
                            </div>
                            ${precip}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        </div>
    `
    return newData
}

const fillHourlyData = (data) => {
    const hourly = document.getElementById("hourlyTable")
    hourly.innerHTML = ``
    const nextEightHours =
        data.hourly.length > 10 ? data.hourly.slice(1, 10) : data.hourly
    let newData = ""
    for (let el of nextEightHours) {
        let hourData = fillSingleHour(el)
        newData += hourData
    }
    hourly.innerHTML += newData
}

const fillSingleDay = (oneDay) => {
    // const daily = document.getElementById("dailyTable")
    const { dt, sunrise, sunset, temp, wind_speed, wind_deg, weather, pop, pressure, humidity } = oneDay
    const precipProb = parseFloat(pop) * 100
    const precip = `<p>Precipitation chance: ${precipProb.toFixed(0)}%</p>`
    const [cmHg, atm] = convertPressure(pressure)
    const wind = wind_speed === 0 ? 'None' : `${wind_speed.toFixed(0)} mph, ${dirFromDeg(wind_deg)}`
    const newData = `
    <div class= "mt-4  col-lg-4 col-md-6 col-sm-12">
    <div class="card shadow daily">
    <div class="card-header bold">
        ${getDateLong(dt)}
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">   
        <p>${weather[0].main}</p>                                         
        <div class="imgbgd">                                  
            <img src="/img/icons/${weather[0].icon}.png" alt="weather icon">
        </div>
        ${precip}
    </li>
      <li class="list-group-item"><span class="bold">Sunrise</span>: ${getTime(sunrise)}</li>
      <li class="list-group-item"><span class="bold">Sunset</span>: ${getTime(sunset)}</li>
      <li class="list-group-item"><span class="bold">High</span>: ${temp.max.toFixed(0)} ${String.fromCharCode(176)}F</li>
      <li class="list-group-item"><span class="bold">Low</span>: ${temp.min.toFixed(0)} ${String.fromCharCode(176)}F</li>
      <li class="list-group-item"><span class="bold">Pressure</span>: ${cmHg} cmHg (${atm} atm)</li>
      <li class="list-group-item"><span class="bold">Humidity</span>: ${humidity.toFixed(0)}%</li>
      <li class="list-group-item"><span class="bold">Wind</span>: ${wind}</li>

    </ul>
  </div>
  </div>
    `
    return newData
}

const fillDailyData = (data) => {
    const daily = document.getElementById("dailyTable")
    daily.innerHTML = ``
    const daysData = data.daily
    let newData = ""
    for (let day of daysData) {
        let singleDay = fillSingleDay(day)
        newData += singleDay
    }
    daily.innerHTML += newData
}

const processData = (searchquerry) =>{
    fetch(searchquerry)
    .then((response) => response.json())
    .then((response) => {
        document.getElementById("spinner").style.display = "none"
        const { error, data } = response
        if (error) {
            alert(`Error: ${error}`)
            return
        }
        document.getElementById("currentWeatherRow").style.visibility = "visible"
        alertbtn.innerHTML="Dismiss"
        alertbody.style.display="block"
        fillCurrentData(data)
        fillHourlyData(data)
        fillDailyData(data)
    })

}



const clearData = () => {
    formInput.value = ""
    document.getElementById("alertrow").style.display = "none"
    document.getElementById("currentWeatherRow").style.visibility = "hidden"
    alertbtn.innerHTML="Dismiss"
    document.getElementById("spinner").style.display = "none"

}
//AUTO LOCATE FUNCTIONS////////////////////////////////////////////////////
const autolocateOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  
  function autolocateSuccess(pos) {
    const crd = pos.coords
    const LAT = crd.latitude
    const LNG = crd.longitude
    const searchquerry = `/coords?lat=${LAT}&long=${LNG}`
    processData(searchquerry)
  }
  
  function autolocateError(err) {
    alert(`Automatic geolocation failed. Enter your location manually.`)
    document.getElementById("spinner").style.display = "none"
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  const autoLocate = () =>{
    navigator.geolocation.getCurrentPosition(autolocateSuccess, autolocateError, autolocateOptions);
    document.getElementById("alertrow").style.display = "none"
    document.getElementById("spinner").style.display = "block"
  }

  /////CLICK HANDLERS?????????????????????????????????????????
  
  const handleAlertClose = () =>{
      if (alertbtn.innerHTML==="Dismiss"){
            alertbody.style.display="none"
            alertbtn.innerHTML="Show Alert"
      } else {
            alertbody.style.display="block"
            alertbtn.innerHTML="Dismiss"
      }
  }

  const toggleHourly = () =>{
      if (hourlyButton.innerHTML==="Expand"){
            hourlyButton.innerHTML="Collapse"
            hourlyForecastBody.style.display = "block"
      } else{
        hourlyButton.innerHTML="Expand"
        hourlyForecastBody.style.display = "none"
      }
  }

  const toggleDaily = () => {
    if (dailyButton.innerHTML==="Expand"){
          dailyButton.innerHTML="Collapse"
          dailyForecastBody.style.display = "block"
    } else{
      dailyButton.innerHTML="Expand"
      dailyForecastBody.style.display = "none"
    }
  }

  const handleClickSubmit = () => {
    const loc = formInput.value.trim()
    if (loc.length === 0) {
        alert("Please enter a location")
        return
    }

    document.getElementById("alertrow").style.display = "none"
    document.getElementById("spinner").style.display = "block"
    const searchquerry = `/weather?address=${encodeURIComponent(loc)}`
    processData(searchquerry)
}

  
document.getElementById("submitBtn").addEventListener("click", handleClickSubmit)
document.getElementById("clearBtn").addEventListener("click", clearData)
document.getElementById("useMyLoc").addEventListener('click', autoLocate)
alertbtn.addEventListener("click", handleAlertClose)
hourlyButton.addEventListener("click", toggleHourly)
dailyButton.addEventListener("click", toggleDaily)
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      if (formInput.value !== ""){
          handleClickSubmit()
      }
    }
})
clearData()
// autoLocate()


const button = document.getElementById("submitBtn")
const formInput = document.getElementById("formInput")
const alerttext = document.getElementById("alerttext")

const getTime = (dt) =>
    new Date(parseInt(dt) * 1000).toLocaleTimeString("en-US")
const getTimeShort = (dt) =>
    new Date(parseInt(dt) * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    })
const getDate = (dt) =>
    new Date(parseInt(dt) * 1000).toLocaleDateString("en-US")
const getDateLong = (dt) =>
    new Date(parseInt(dt) * 1000).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })

const fillCurrentData = (data) => {
    const { lat, long, current, hourly, daily, alerts, name } = data
    document.getElementById("current-location").innerHTML = name
    document.getElementById("lat").innerHTML = lat.toFixed(2)
    document.getElementById("long").innerHTML = long.toFixed(2)
    document.getElementById("image").src = `/img/icons/${current.weather[0].icon}.png`
    document.getElementById("desc").innerHTML = current.weather[0].description
    document.getElementById("temp").innerHTML = `${current.temp.toFixed(0)} ${String.fromCharCode(176)}F`
    document.getElementById("wind").innerHTML =`${current["wind_speed"].toFixed(0)} mph, ${current["wind_deg"].toFixed(0)}` + String.fromCharCode(176)

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
    const { dt, sunrise, sunset, temp, wind_speed, wind_deg, weather, pop } =
        oneDay
    const precipProb = parseFloat(pop) * 100
    const precip = `<p>Precipitation chance: ${precipProb.toFixed(0)}%</p>`
        // precipProb > 1 ? `<p>Precip. chance: ${precipProb.toFixed(0)}%</p>` : ``
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
      <li class="list-group-item"><span class="bold">Wind</span>: ${wind_speed.toFixed(0)} mph, ${wind_deg.toFixed(0)} ${String.fromCharCode(176)}</li>
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
        fillCurrentData(data)
        fillHourlyData(data)
        fillDailyData(data)
    })

}

const handleClick = () => {
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

const clearData = () => {
    formInput.value = ""
    document.getElementById("alertrow").style.display = "none"
    document.getElementById("currentWeatherRow").style.visibility = "hidden"
}

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  
  function success(pos) {
    const crd = pos.coords
    const LAT = crd.latitude
    const LNG = crd.longitude
    const searchquerry = `/coords?lat=${LAT}&long=${LNG}`
    processData(searchquerry)
  }
  
  function error(err) {
    alert(`Automatic geolocation failed. Enter your location manually.`)
    document.getElementById("spinner").style.display = "none"
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  const autoLocate = () =>{
    navigator.geolocation.getCurrentPosition(success, error, options);
    document.getElementById("spinner").style.display = "block"
  }
  
  const handleAlertClose = () =>{
      const alertbtn = document.getElementById("alertCloseButton")
      const alertbody = document.getElementById("alertbody")
      if (alertbtn.innerHTML==="Dismiss"){
            alertbody.style.display="none"
            alertbtn.innerHTML="Show Alert"
      } else {
            alertbody.style.display="block"
            alertbtn.innerHTML="Dismiss"
      }
  }

  
document.getElementById("submitBtn").addEventListener("click", handleClick)
document.getElementById("clearBtn").addEventListener("click", clearData)
document.getElementById("useMyLoc").addEventListener('click', autoLocate)
document.getElementById("alertCloseButton").addEventListener("click", handleAlertClose)
clearData()
autoLocate()


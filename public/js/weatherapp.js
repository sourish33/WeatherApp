console.log("weatherapp.js speaking")

const button = document.getElementById("submitBtn")
const formInput = document.getElementById("formInput")
const alerttext = document.getElementById("alerttext")

const getTime = (dt) => new Date(parseInt(dt)*1000).toLocaleTimeString("en-US")
const getTimeShort = (dt) => new Date(parseInt(dt)*1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
const getDate = (dt) => new Date(parseInt(dt)*1000).toLocaleDateString("en-US")

const fillCurrentData =(response)=>{
    const { lat, long, current, hourly, daily, alerts, name }= response.data
    document.getElementById("current-location").innerHTML=name
    document.getElementById("lat").innerHTML=lat.toFixed(2)
    document.getElementById("long").innerHTML=long.toFixed(2)
    document.getElementById("image").src=`http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`
    document.getElementById("desc").innerHTML=current.weather[0].description
    document.getElementById("temp").innerHTML=`${current.temp.toFixed(0)} ${String.fromCharCode(176)}F`
    document.getElementById("wind").innerHTML=`${current["wind_speed"].toFixed(0)} mph, ${current["wind_deg"].toFixed(0)}`+String.fromCharCode(176)
    document.getElementById("sunrise").innerHTML=getTime(current["sunrise"])
    document.getElementById("sunset").innerHTML=getTime(current["sunset"])

    if (alerts) {
        document.getElementById("alertrow").style.display="block"
        document.getElementById("event").innerHTML=alerts[0].event
        document.getElementById("startTime").innerHTML=getTime(alerts[0].start)
        document.getElementById("endTime").innerHTML=getTime(alerts[0].end)
        document.getElementById("alerttext").innerHTML=alerts[0].description
    }
    
}

const fillSingleHour = (oneHour) => {
    const {dt, temp, wind_speed, wind_deg, weather, pop} = oneHour
    const precipProb = parseFloat(pop)*100
    const precip = precipProb>1 ? `<p>Rain/snow:${precipProb.toFixed(0)}%</p>`: ``
    const hourly = document.getElementById("hourlyTable")
    const newData = `
    <thead>
    <tr>
        <th scope="col">Time</th>
        <th scope="col">Temp</th>
        <th scope="col">Weather</th>
        <th scope="col">Wind</th>
    </tr>
</thead>
<tbody>
    <tr>
        <th scope="row">${getTimeShort(dt)}</th>
        <td>49 F</td>
        <td>                                            
            <img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="weather icon">
            <p>${weather[0].main}</p>
            ${precip}
        </td>
        <td>${wind_speed.toFixed(0)} mph, ${wind_deg.toFixed(0)}${String.fromCharCode(176)}</td>
    </tr>
</tbody>
    `
    return newData

}

const fillHourlyData = (response) =>{
    // const newData = fillSingleHour(response.data.hourly[3])
    const hourly= document.getElementById("hourlyTable")
    const nextEightHours = response.data.hourly.length>8? response.data.hourly.slice(0, 8) : response.data.hourly
    let newData=''
    for (let el of nextEightHours) {
        let hourData = fillSingleHour(el)
        newData+=hourData
    }
    hourly.innerHTML = newData
}

const handleClick= () =>{
    console.log(`You entered ${formInput.value}`)
    const loc = formInput.value
    const searchquerry = `http://localhost:3000/weather?address=${encodeURIComponent(loc)}`
    fetch(searchquerry).then((response)=>response.json()).then((response)=>{
        document.getElementById("weatherRow").style.visibility="visible"
        fillCurrentData(response)
        fillHourlyData(response)
        })
}


button.addEventListener("click", handleClick)
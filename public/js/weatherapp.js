console.log("weatherapp.js speaking")

const button = document.getElementById("submitBtn")
const formInput = document.getElementById("formInput")
const alerttext = document.getElementById("alerttext")

const getTime = (dt) => new Date(parseInt(dt)*1000).toLocaleTimeString("en-US")

const fillCurrentData =(response)=>{
    const { lat, long, current, hourly, daily, alerts, name }= response.data
    document.getElementById("current-location").innerHTML=name
    document.getElementById("lat").innerHTML=lat
    document.getElementById("long").innerHTML=long
    document.getElementById("image").src=`http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`
    document.getElementById("desc").innerHTML=current.weather[0].description
    document.getElementById("temp").innerHTML=`${current.temp} F`
    document.getElementById("wind").innerHTML=`${current["wind_speed"]} mph`
    document.getElementById("sunrise").innerHTML=getTime(current["sunrise"])
    document.getElementById("sunset").innerHTML=getTime(current["sunset"])
}

const handleClick= () =>{
    console.log(`You entered ${formInput.value}`)
    const loc = formInput.value
    const searchquerry = `http://localhost:3000/weather?address=${encodeURIComponent(loc)}`
    fetch(searchquerry).then((response)=>response.json()).then((response)=>{
        fillCurrentData(response)
        })
}


button.addEventListener("click", handleClick)
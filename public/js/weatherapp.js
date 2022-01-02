console.log("weatherapp.js speaking")

const button = document.getElementById("submitBtn")
const formInput = document.getElementById("formInput")
const alerttext = document.getElementById("alerttext")

const handleClick= () =>{
    console.log(`You entered ${formInput.value}`)
    const loc = formInput.value
    const searchquerry = `http://localhost:3000/weather?address=${encodeURIComponent(loc)}`
    fetch(searchquerry).then((response)=>response.json()).then((response)=>{
        const { lat, long, current, hourly, daily, alerts }= response.data
        const lerts = alerts? alerts[0].description : ""   
        alerttext.innerHTML=`the temperature is ${current.temp} F and the weather is ${current.weather[0].description}`+lerts
        })
}


button.addEventListener("click", handleClick)
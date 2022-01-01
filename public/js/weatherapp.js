console.log("weatherapp.js speaking")

const button = document.getElementById("submitBtn")
const formInput = document.getElementById("formInput")
const alerttext = document.getElementById("alerttext")

const handleClick= () =>{
    console.log(`You entered ${formInput.value}`)
    const loc = formInput.value
    const searchquerry = `http://localhost:3000/weather?address=${encodeURIComponent(loc)}`
    fetch(searchquerry).then((response)=>response.json()).then((response)=>{
            
            alerttext.innerHTML=response.forecast
        })
}


button.addEventListener("click", handleClick)
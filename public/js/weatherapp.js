console.log("weatherapp.js speaking")

const button = document.getElementById("submitBtn")
const formInput = document.getElementById("formInput")

const handleClick= () =>{
    console.log(`You entered ${formInput.value}`)
}


button.addEventListener("click", handleClick)
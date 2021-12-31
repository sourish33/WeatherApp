
// fetch('http://localhost:3000/weather?address=Chinsurah').then((response)=>response.json()).then((response)=>{
//     if (response.error){
//         return console.log(response.error)
//     }
//     console.log(response)
// })

let form = document.getElementById("locForm")
let inputBox = document.getElementById('locInput')
let p0 = document.getElementById("p0")
let p1 = document.getElementById("p1")
let p2 = document.getElementById("p2")

const handleSubmit = (e) =>{
    e.preventDefault()
    p0.style.display="block"
    p1.innerHTML=""
    p2.innerHTML=""
    const loc = inputBox.value
    const searchquerry = `http://localhost:3000/weather?address=${encodeURIComponent(loc)}`
    fetch(searchquerry).then((response)=>response.json()).then((response)=>{
        p0.style.display="none"
            if (response.error){
                p1.innerHTML=response.error
                p2.innerHTML=""
                return
            }
            
            p1.innerHTML = `You searched for ${response.location}`
            p2.innerHTML = response.forecast
        })
}


form.addEventListener("submit", handleSubmit)
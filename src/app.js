const path = require("path")
const express = require("express")
const hbs = require("hbs")
const request = require("postman-request")


// const { geocode } = require("./utils/geocode")
// const { forecast } = require("./utils/forecast")
const { resolve } = require("path")
// const {getloc} = require('./utils/getloc')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public")
const viewsPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")

// Setup handlebars engine and views location
app.set("view engine", "hbs")
app.set("views", viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get("", (req, res) => {
    res.render("index", {
        data: null
    })
})

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About Me",
        name: "Sourish Dutta",
        footerText: "Created by Sourish Dutta",
    })
})

app.get("/help", (req, res) => {
    res.render("help", {
        helpText: "This is some helpful text.",
        title: "Help",
        footerText: "Created by Sourish Dutta",
    })
})

const geocode = (address) => {
    const addr = encodeURIComponent(address)
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${addr}.json?access_token=pk.eyJ1Ijoic291cmlzaDMzIiwiYSI6ImNreG5oN2M4NjZhem8zMW11emwxeTNxNTUifQ.aGPirHsIa1WdNXe4TwoE-g&limit=1`
    
    return new Promise((resolve, reject) =>{
        request({ url: url, json: true }, (err, { body }) => {
            if (err) {
                reject("Connection failed")
            } else if (body.features.length === 0) {
                reject("Nothing returned. Try a different location")
            } else {
                const data = {}
                data.name = body.features[0].place_name
                data.lat = body.features[0].center[1]
                data.long = body.features[0].center[0]
                resolve(data)
            }
        })
        
    })
}

const forecast = (lat, long) => {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&appid=0edf04cd12cd717d3c62ff12f3b844ea&units=imperial`
    return new Promise((resolve, reject) =>{
        request({ url: url, json: true }, (err, { body }) => {
            if (err) {
                reject("Check your internet connection")
            } else if (body.error) {
                reject(body.error.info)
            } else {
                const data = {}
                data.lat = body.lat
                data.long = body.lon
                data.current = body.current
                data.hourly = body.hourly
                data.daily = body.daily
                data.alerts = body.alerts? body.alerts : null
                resolve(data)
            }
        })
    })

}

app.get("/weather",  async (req, res) => {
    if (!req.query.address) {
        res.send({
            error: "Address must be provided",
            data: null
        })
        return
    }
    try {
        const {name, lat, long} = await geocode(req.query.address)
        const forecastRes = await forecast(lat, long)
        forecastRes.name = name
        res.send({
                error: null,
                data: forecastRes,
        })
    } catch(err) {
        res.send({
            error: err,
            data: null
    })
    }
    // geocode(req.query.address, (error, { lat, long, name }={}) => {
    //     if (error) {
    //         return res.send({ error: error, data: null })
    //     } 
    //     forecast(lat, long, (error, forecastRes) => {
    //         if (error) {
    //             return res.send({ error: error, data: null })
    //         } else {
    //             const location = req.query.address
    //             const { lat, long, current, hourly, daily, alerts } = forecastRes
    //             forecastRes.name = name
    //             res.send({
    //                 error: null,
    //                 data: forecastRes
    //                 // address: req.query.address,
    //             })
    //         }
    //     })

    // })
})

app.get("/coords", (req, res) =>{
    if (!req.query.lat || !req.query.long) {
        return res.send({error: "Invalid Lat/Long", data: null})
    }
    const LAT = req.query.lat
    const LNG = req.query.long
    getloc(LAT, LNG, (err, LAT, LNG, {name})=>{
        if (err){
            return console.log("Geolocation failed")
        }
        forecast(LAT, LNG, (error, forecastRes) => {
            if (error) {
                return res.send({ error: error, data: null })
            } else {
                const { lat, long, current, hourly, daily, alerts } = forecastRes
                forecastRes.name = name
                res.send({
                    error: null,
                    data: forecastRes,
                })
            }
        })
    })
})



app.get("*", (req, res) => {
    res.render("404", {
        title: "404",
        name: "Sourish Dutta",
        errorMessage: "Page not found.",
    })
})

app.listen(port, () => {
    console.log("Server is up on port "+port)
})

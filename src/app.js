const path = require("path")
const express = require("express")
const hbs = require("hbs")

const { geocode } = require("./utils/geocode")
const { forecast } = require("./utils/forecast")
const {getloc} = require('./getloc')

const app = express()

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

app.get("/weather", (req, res) => {
    if (!req.query.address) {
        res.send({
            error: "Address must be provided",
            data: null
        })
        return
    }
    geocode(req.query.address, (error, { lat, long, name }={}) => {
        if (error) {
            return res.send({ error: error, data: null })
        } else {
            forecast(lat, long, (error, forecastRes) => {
                if (error) {
                    return res.send({ error: error, data: null })
                } else {
                    const location = req.query.address
                    // console.log(forecastRes)
                    const { lat, long, current, hourly, daily, alerts } = forecastRes
                    forecastRes.name = name
                    res.send({
                        error: null,
                        data: forecastRes
                        // address: req.query.address,
                    })
                }
            })
        }
    })
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
                // const location = req.query.address
                console.log(name)
                const { lat, long, current, hourly, daily, alerts } = forecastRes
                forecastRes.name = name
                res.send({
                    error: null,
                    data: forecastRes
                    // address: req.query.address,
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

app.listen(3000, () => {
    console.log("Server is up on port 3000.")
})

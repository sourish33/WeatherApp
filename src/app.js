const path = require("path")
const express = require("express")
const hbs = require("hbs")
const request = require("postman-request")


const { geocode } = require("./utils/geocode")
const { forecast } = require("./utils/forecast")
// const { resolve } = require("path")
const {getloc} = require('./utils/getloc')
const {getaqi} = require('./utils/getaqi')

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
        const [forecastRes, aqi] = await Promise.all([forecast(lat, long), getaqi(lat, long)])
        forecastRes.name = name
        forecastRes.aqi = aqi
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
})

app.get("/coords", async (req, res) =>{
    if (!req.query.lat || !req.query.long) {
        return res.send({error: "Invalid Lat/Long", data: null})
    }
    const lat = req.query.lat
    const long = req.query.long
    try {
        const name = await getloc(lat, long)
        const forecastRes = await forecast(lat, long)
        forecastRes.name = name
        res.send({
            error: null,
            data: forecastRes,
        })
    } catch(err){
        res.send({
            error: err,
            data: null
        })

    }

})



app.get("*", (req, res) => {
    res.render("404", {
        errorMessage: "Page not found.",
    })
})

app.listen(port, () => {
    console.log("Server is up on port "+port)
})

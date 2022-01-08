const request = require("postman-request")

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

module.exports.forecast = forecast

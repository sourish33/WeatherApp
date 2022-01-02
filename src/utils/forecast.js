const request = require("postman-request")

const forecast = (lat, long, callback) => {
    // const url = `http://api.weatherstack.com/current?access_key=1ff4b1d71ce085f829ca105c2ae91ffb&query=${lat},${long}&units=f`
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&appid=0edf04cd12cd717d3c62ff12f3b844ea&units=imperial`
    request({ url: url, json: true }, (err, { body }) => {
        if (err) {
            callback("Check your internet connection", undefined)
        } else if (body.error) {
            callback(body.error.info, undefined)
        } else {
            const data = {}
            data.lat = body.lat
            data.long = body.lon
            data.current = body.current
            data.hourly = body.hourly
            data.daily = body.daily
            data.alerts = body.alerts? body.alerts : null
            callback(undefined, data)
        }
    })
}

module.exports.forecast = forecast

const request = require("postman-request")

const forecast = (lat, long, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=1ff4b1d71ce085f829ca105c2ae91ffb&query=${lat},${long}&units=f`
    request({ url: url, json: true }, (err, { body }) => {
        if (err) {
            callback("Check your internet connection", undefined)
        } else if (body.error) {
            callback(body.error.info, undefined)
        } else {
            const data = {}
            data.city = body.location.name
            data.country = body.location.country
            data.time = body.location.localtime
            data.temp = body.current.temperature
            data.feelslike = body.current.feelslike
            data.desc = body.current.weather_descriptions
            callback(undefined, data)
        }
    })
}

module.exports.forecast = forecast

const request = require("postman-request")

const forecast = (
    lat,
    long,
    callback = (error, res) => {

        if (error) {
            console.log(error)
        } else{
            const {city, country, time, desc, temp, feelslike} = res
            console.log(`The local time in ${city},${country} is ${time}.\nThe weather is ${desc}.\nThe temperature is ${temp} deg F and it feels like ${feelslike} deg F`)
        }

    }
) => {
    const url = `http://api.weatherstack.com/current?access_key=1ff4b1d71ce085f829ca105c2ae91ffb&query=${lat},${long}&units=f`
    request({ url: url, json: true }, (err, {body}) => {
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

module.exports.forecast =forecast
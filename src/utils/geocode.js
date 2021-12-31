const request = require("postman-request")
const {forecast} = require('./forecast')
const geocode = (
    address,
    callback = (error, result) => {
        if (error){
            console.log(error)
        } else{
            forecast(result.lat, result.long, result.name)
        }

    }
) => {
    const addr = encodeURIComponent(address)
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${addr}.json?access_token=pk.eyJ1Ijoic291cmlzaDMzIiwiYSI6ImNreG5oN2M4NjZhem8zMW11emwxeTNxNTUifQ.aGPirHsIa1WdNXe4TwoE-g&limit=1`
    request({ url: url, json: true }, (err, {body}) => {
        if (err) {
            callback("Check your internet connection", undefined)
        } else if (body.features.length === 0) {
            callback("Nothing returned. Try a different location", undefined)
        } else {
            const data = {}
            data.name = body.features[0].place_name
            data.lat = body.features[0].center[1]
            data.long = body.features[0].center[0]
            callback(undefined, data)
        }
    })
}


module.exports.geocode = geocode

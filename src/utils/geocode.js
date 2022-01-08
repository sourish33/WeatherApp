const request = require("postman-request")

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

module.exports.geocode = geocode

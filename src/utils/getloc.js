const request = require("postman-request")

const getloc = function(LAT, LNG, callback){

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${LAT}+${LNG}&key=5f8b51c4764c44828869f238f28c0aa3`
    request({ url: url, json: true }, (err, {body}) => {
        if (err) {
            callback("Check your internet connection")
        } else if (body.length === 0) {
            callback("geolocation failed")
        } else {
            // console.log(body)
            const data = {}
            data.name = body.results[0].formatted
            callback(undefined, LAT, LNG, data)
        }
    })
    
}

module.exports.getloc=getloc
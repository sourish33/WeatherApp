const request = require("postman-request")

const getloc = (LAT, LNG) => {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${LAT}+${LNG}&key=5f8b51c4764c44828869f238f28c0aa3`
    return new Promise((resolve, reject)=>{
        request({ url: url, json: true }, (err, {body}) => {
            if (err) {
                reject("Check your internet connection")
            } else if (body.length === 0) {
                reject("Geolocation failed")
            } else {
                resolve(body.results[0].formatted)
            }
        })

    })
}

module.exports.getloc=getloc
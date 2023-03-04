const request = require("postman-request")
const API_KEY = "ead98a008243499d92efeaf0cbd58dc0"

const getloc = (LAT, LNG) => {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${LAT}+${LNG}&key=${API_KEY}`
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
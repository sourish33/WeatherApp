const request = require("postman-request")

const getaqi = (LAT, LNG) =>{
    const url = `https://api.waqi.info/feed/geo:${LAT};${LNG}/?token=d988e63d8501a0de367665f90f778932ce3594e8`
    return new Promise((resolve, reject) =>{
        request({ url: url, json: true }, (err, {body}) => {
            if (err) {
                reject("Check your internet connection")
            } else if (body.length === 0) {
                reject("Aqi request failed")
            } else {
                resolve(body.data.aqi)
            }
        }) 
    })
}

module.exports.getaqi = getaqi
const getTime = (dt) =>
    new Date(parseInt(dt) * 1000).toLocaleTimeString("en-US")
const getTimeShort = (dt) =>
    new Date(parseInt(dt) * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    })
const getDate = (dt) =>
    new Date(parseInt(dt) * 1000).toLocaleDateString("en-US")
const getDateLong = (dt) =>
    new Date(parseInt(dt) * 1000).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
const convertPressure = (hpa) =>{
    const p = parseFloat(hpa)
    const cmHg = p*.075
    const atm = p*0.0009869233
    return [cmHg.toFixed(2), atm.toFixed(2)]
}

const aqiDangerLevel = (aqival) =>{
    const aqi = parseInt(aqival)
    if (aqi<=50) { return "Good"}
    if (aqi>50 && aqi <=100) {return "Moderate"}
    if (aqi>100 && aqi <=150) {return "Unhealthy for Sensitive Grps"}
    if (aqi>150 && aqi <=200) {return "Unhealthy"}
    if (aqi>200 && aqi <=300) {return "Very Unhealthy"}
    if (aqi>300) {return "Hazardoud"}


}
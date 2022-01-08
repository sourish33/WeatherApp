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

const aqiColors = {
    "Good" : 'aqiGood',
    "Moderate": 'aqiMod',
    "Unhealthy for Sensitive Grps": 'aqiUnh1',
    "Unhealthy": 'aqiUnh2',
    "Very Unhealthy": 'aqiUnh3',
    "Hazardous":'aquiHaz'
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

const roundToNearest10 = (num) =>{
    return Math.round(parseInt(num)/10)*10;
}

const dirFromDeg = (deg) =>{
    let x = roundToNearest10(deg)
    if ([350,360, 10].includes(x)) {return "N"}
    if ([20,30].includes(x)) {return "N/NE"}
    if ([40,50].includes(x)) {return "NE"}
    if ([60,70].includes(x)) {return "E/NE"}
    if ([80,90,100].includes(x)) {return "E"}
    if ([110,120].includes(x)) {return "E/SE"}
    if ([130,140].includes(x)) {return "SE"}
    if ([150,160].includes(x)) {return "S/SE"}
    if ([170,180,190].includes(x)) {return "S"}
    if ([200,210].includes(x)) {return "S/SW"}
    if ([220,230].includes(x)) {return "SW"}
    if ([240,250].includes(x)) {return "W/SW"}
    if ([260,270, 280].includes(x)) {return "W"}
    if ([290,300].includes(x)) {return "W/NW"}
    if ([310,320].includes(x)) {return "NW"}
    if ([330,340].includes(x)) {return "N/NW"}
}
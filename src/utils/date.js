const makeHumanDate = (dt) =>{
    const milliseconds = parseInt(dt) * 1000 // 1575909015000
    const dateObject = new Date(milliseconds)
    const humanDateFormat = dateObject.toLocaleString('en-US')
    return humanDateFormat
  }

  module.exports.makeHumanDate=makeHumanDate
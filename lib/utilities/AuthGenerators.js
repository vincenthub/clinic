const moment = require('moment-timezone')

const generateRandomPassword = (length = 8) => {
    var textValues = "ababcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    var password = "";
    for (var x = 0; x < length; x++){
        var i = Math.floor(Math.random() * textValues.length)
        password += textValues.charAt(i)
    }
    return password
}

const generateExpiryDate = (addedHours = 1) => {
    var todayDate = moment();
    return moment(todayDate).tz(process.env.TIMEZONE).add(addedHours, 'hours')
}

const generateCurrentDate = () => {
    return moment().tz(process.env.TIMEZONE); 
}

module.exports = {
    generateRandomPassword,
    generateExpiryDate,
    generateCurrentDate
}
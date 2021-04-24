const moment = require('moment-timezone')

const generateRandomPassword = (length = 8) => {
    const textValues = "ababcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let password = "";
    for (let x = 0; x < length; x++){
        const i = Math.floor(Math.random() * textValues.length);
        password += textValues.charAt(i)
    }
    return password
}

const generateExpiryDate = (addedHours = 1) => {
    const todayDate = moment();
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

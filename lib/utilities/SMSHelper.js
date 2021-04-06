const twilioClient = require('twilio');

const sendSMS = async ( contactNumber, message ) => {

    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    let result = true;

    try {

        await twilioClient(twilioAccountSid, twilioAuthToken).messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: process.env.SMS_TO_PHONE_NUMBER || contactNumber,
        });

    } catch (error) {

        result = error;

    }

    return result;

};

module.exports = { sendSMS };

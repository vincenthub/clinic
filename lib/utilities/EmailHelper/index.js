const nodemailer = require("nodemailer");
const { headerHtmlContent,
        headerTextContent,
        footerHtmlContent,
        footerTextContent } = require('./templates/emailWrapper');

const sendEmail = async (to, emailTemplate, contentKeyPairs = {}) => {

    let result = true;
    try {

        // TODO: create a common header and footer template
        const emailContent = require(`./templates/${emailTemplate}`)

        // github: https://github.com/nodemailer/nodemailer/blob/master/examples/full.js
        // let testAccount = await nodemailer.createTestAccount();
        const config = {
            service: process.env.EMAIL_SERVICE,
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        };
        let transporter = nodemailer.createTransport(config);
        let message = {
            to: to,
            subject: emailContent.subject(contentKeyPairs),
            html: emailContent.htmlContent(contentKeyPairs),
            text: emailContent.textContent(contentKeyPairs),
            attachments: [],
            list: {
                // TODO: create a global variable for support email
                help: 'support@eyahclinic.com',
                unsubscribe: [],
                id: {},
            }
        }

        let sentMail = await transporter.sendMail(message);

        if (process.env.NODE_ENV !== 'production') {
            console.log("Message sent: %s", sentMail.messageId);
            console.log("Preview: %s", nodemailer.getTestMessageUrl(sentMail));
        }
    } catch ( error ) {

        result = error;

    }

    return result ;
}

module.exports = { sendEmail };

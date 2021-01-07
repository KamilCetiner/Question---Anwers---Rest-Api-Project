const nodemailer = require("nodemailer");

const sendEmail = async(mailOptions) => {

    let transpoerter = nodemailer.createTransport({

        host : process.env.SMTP_HOST,
        port : process.env.SMTP_PORT,
        auth : {
            user : process.env.SMTP_USER,
            pass : process.env.PASS,
        }
    }); 

    let info = await transpoerter.sendMail(mailOptions);

    console.log(`Message Sent : ${info.messageId}`)


};

module.exports = sendEmail;


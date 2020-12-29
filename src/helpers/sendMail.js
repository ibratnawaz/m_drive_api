const nodemailer = require("nodemailer");
const cryptoRandomString = require("crypto-random-string");
const User = require("../models/User");

async function sendMail(user, type) {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const { _id, first_name, last_name, email } = user;

    if (type == "activate") {
      let str = cryptoRandomString({
        length: 32,
        type: "url-safe",
      });

      user.activationString = str;
      await user.save();
      let info = await transporter.sendMail({
        from: `M-Drive <${process.env.MAIL_USERNAME}>`,
        to: `${email}`,
        subject: `Activate your account`,
        html: `<h3>Good to see you here ${first_name} ${last_name}.</h3><br/>
            <p>Please click the below link to activate your account and enjoy our services.</p>
            <p>http://localhost:5000/api/users/account/activate/${str}</p>`,
      });
    }

    if (type == "reset") {
      let info = await transporter.sendMail({
        from: `M-Drive <${process.env.MAIL_USERNAME}>`,
        to: `${email}`,
        subject: `Activate your account`,
        html: `<h3>Hi ${first_name} ${last_name}</h3><br/>
            <p>Here's your reset password link.</p>
            <p>http://localhost:5000/api/users/forgot/password/redirect/${_id}</p>`,
      });
    }
  } catch (error) {
    console.log(error);
    return new Error("Something went wrong...");
  }
}

module.exports = sendMail;

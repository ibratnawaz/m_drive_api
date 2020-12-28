const nodemailer = require("nodemailer");
const cryptoRandomString = require("crypto-random-string");
const User = require("../models/User");

async function activateAccount(user, type) {
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

    let str = cryptoRandomString({
      length: 32,
      type: "url-safe",
    });

    const { first_name, last_name, email } = user;

    user.activationString = str;
    await user.save();

    if (type == "activate") {
      let info = await transporter.sendMail({
        from: `M-Drive <${process.env.MAIL_USERNAME}>`,
        to: `${email}`,
        subject: `Activate your account`,
        html: `<h3>Good to see you here ${first_name} ${last_name}.</h3><br/>
            <p>Please click the below link to activate your account and enjoy our services.</p>
            <p>http://localhost:5000/api/users/account/activate/${str}</p>`,
      });
    }
  } catch (error) {
    console.log(error);
    return new Error("Something went wrong...");
  }
}

module.exports = activateAccount;

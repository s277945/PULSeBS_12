const nodemailer = require('nodemailer'); 

const email = "pulsebs.team12.se2020@gmail.com";
//mail configuration

exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: "scimmia2020"
    }
  });
  








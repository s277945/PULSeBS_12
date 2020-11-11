const nodemailer = require('nodemailer'); 

const email = "noreplyprojectse@gmail.com"
//mail configuration

exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: 'scimmia,2020'
    }
  });
  








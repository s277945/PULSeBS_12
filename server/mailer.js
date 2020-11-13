const nodemailer = require('nodemailer'); 

const email;
//mail configuration

exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: 
    }
  });
  








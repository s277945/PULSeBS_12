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
  
  var mailOptions = {
    from: 'noreplyprojectse@gmail.com',
    to: 'frgarau@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };








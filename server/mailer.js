const nodemailer = require('nodemailer'); 

//mail configuration

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'noreplyprojectse@gmail.com',
      pass: 'scimmia,2020'
    }
  });
  
  var mailOptions = {
    from: 'noreplyprojectse@gmail.com',
    to: 'frgarau@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };

transporter.sendMail(mailOptions, function(err, info){
    if(err){
        console.log(err);
    } else {
        console.log('Email sent: ' + info.response);
    }
});





const nodemailer = require('nodemailer'); 

const email = "pulsebs.team12.se2020@gmail.com";
/*Email created for the project, used to send the messages
* Email: pulsebs.team12.se2020@gmail.com
* Password: scimmia2020
*/
exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: "scimmia2020"
    }
  });
  








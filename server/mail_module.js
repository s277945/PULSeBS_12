const cron = require('node-cron');
const express = require('express');
const mailer = require('./mailer');
const dao = require('./dao');
const moment = require('moment');

app = express();


cron.schedule('1 * * * * *', function() {
    const date=moment().format('YYYY-MM-DD HH:mm:ss');
    dao.checkDeadline(date)
        .then((list) => {
            for(let el of list){
                var mailOptions = {
                    from: mailer.email,
                    to: el.email,
                    subject: 'Booking Information',
                    text: `Your next lecture (on ${el.dateLecture}) ${el.nameLecture} of course ${el.Course_Ref} will have ${el.nBooked} booked students`
                  };

                mailer.transporter.sendMail(mailOptions, function(err, info){
                    if(err){
                        console.log(err);
                    } else {
                        console.log(`Email sent to: ${el.email} ` + info.response);
                    }
                });

                dao.emailSentUpdate(el.Course_Ref, el.dateLecture)
                    .then((res) => {
                        console.log("operation: " + res);
                    })
                    .catch((err) => console.log(err));
            }
        })
        .catch((err) => console.log(err));
});

app.listen(3002);
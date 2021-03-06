const cron = require('node-cron');
const express = require('express');
const mailer = require('./mailer');
const teacherDao = require('./Dao/teacherDao');
const moment = require('moment');

const app = express();
app.disable("x-powered-by");
// use */10 * * * * * for test
//1 * * * * *
const job=cron.schedule('*/10 * * * * *', function() {
    const date=moment().format('YYYY-MM-DD HH:mm:ss');
    teacherDao.checkDeadline(date)
        .then((list) => {
            for(let el of list){
                var mailOptions = {
                    from: mailer.email,
                    to: el.email,
                    subject: 'Booking Information',
                    text: `Your next lecture (on ${el.dateLecture}) ${el.nameLecture} of course ${el.Course_Ref} will have ${el.nBooked} booked students`
                  };

                mailer.transporter.sendMail(mailOptions, function(err, info){
                    /* istanbul ignore if */
                    if(err){
                        console.log(err);
                    } else {
                        console.log(`Email sent to: ${el.email} ` + info.response);
                    }
                });

                teacherDao.emailSentUpdate(el.Course_Ref, el.dateLecture)
                    .then((res) => {
                        console.log("operation: " + res);
                    })
                    .catch(/* istanbul ignore next */(err) => console.log(err));
            }
        })
        .catch(/* istanbul ignore next */(err) => console.log(err));
});

app.listen(3002, () => console.log(`Server ready at port: ${3002}`));
module.exports={job};

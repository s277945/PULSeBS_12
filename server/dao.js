'use strict';

const bcrypt = require('bcryptjs');

//check user data for login
exports.checkUserPwd = function (username, password) {
    return new Promise((resolve, reject) => {
        var sql = 'SELECT userId, passwordHash FROM users WHERE userId = ?'; // sql query to select user entry from database        
        console.log(username);
        console.log(password);
        db.get(sql, [username], (err, row) => {
            if (err) reject(err); // error handling
            else if (typeof row === 'undefined') reject(new Error('User does not exist')); // no entry found
            else if (typeof row !== 'undefined') { // username found
                bcrypt.compare(password, row.passwordHash, (err,res) => { //check password hash
                    console.log(res);
                    if (err) reject(err);
                    else if (!res) reject(new Error('Password is incorrect'));
                    else resolve(row.userId) // if password is correct return user id
                })
            }
            
        });
    });
};
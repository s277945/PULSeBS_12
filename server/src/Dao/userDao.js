'use strict';
const db = require('../db');
const bcrypt = require('bcrypt');

/**
 * Check user data for login
 * */

exports.checkUserPwd = function (username, password) {
    return new Promise((resolve, reject) => {
        var sql = 'SELECT userID, Password FROM User WHERE userID = ?'; // sql query to select user entry from database

        db.get(sql, [username], (err, row) => {
            /* istanbul ignore if */
            if (err) reject(err); // error handling
            else if (typeof row === 'undefined') reject(new Error('User does not exist')); // no entry found
            else if (typeof row !== 'undefined') { // username found
                bcrypt.compare(password, row.Password, (err2,res) => { //check password hash

                    if (err2) reject(err2);
                    else if (!res) reject(new Error('Password is incorrect'));
                    else {
                        this.getRole(row.userID)
                            .then(row2 => {
                                resolve({userID: row.userID, userType: row2.UserType});
                            })
                            .catch(/* istanbul ignore next */err3 => {
                                reject(err3);
                            })

                    }
                })
            }

        });
    });
};

/*
* Input: userID
* Output: UserType of the user
* Description: Retrieve the role of a specific user
*/

exports.getRole=function(userId){
    return new Promise((resolve, reject) => {
        const sql='SELECT UserType FROM User WHERE userID=?'
        db.get(sql, [userId], (err, row)=>{
            /* istanbul ignore if */
            if(err)
                reject(err);
            else {

                resolve(row);
            }

        })
    })
}

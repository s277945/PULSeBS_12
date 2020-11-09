import React, { Component } from 'react'

function saveUserSession(useName, userType) {
    return new Promise((resolve, reject) => {
        sessionStorage.setItem("userName", userName);
        sessionStorage.setItem("userType", userType);
        resolve("ok");
    });
}

export default { saveUserSession };
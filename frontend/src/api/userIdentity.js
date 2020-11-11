
function saveUserSession(context, userName, userType) {
    return new Promise((resolve, reject) => {
        context.setUserName(userName);//set user context data
        context.setUserType(userType);
        sessionStorage.setItem("userName", userName);
        sessionStorage.setItem("userType", userType);
        resolve("ok");
    });
}

function removeUserSession(context) {
    return new Promise((resolve, reject) => {
        context.setUserName("");//set user context data
        context.setUserType("");
        sessionStorage.clear();
        resolve("ok");
    });
}

export default { saveUserSession, removeUserSession };
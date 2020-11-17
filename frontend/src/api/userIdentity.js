
function saveUserSession(context, userName, userType) {
    return new Promise((resolve, reject) => {
        if(context) {
            context.setUserName(userName);//set user context data
            context.setUserType(userType);
            sessionStorage.setItem("userName", userName);// set session storage data (user name, user type)
            sessionStorage.setItem("userType", userType);
            resolve("ok");
            }
    });
}

function removeUserSession(context) {
    return new Promise((resolve, reject) => {
        if(context) {
            context.setUserName(null);//set user context data
            context.setUserType(null);
            sessionStorage.clear();//delete session storage data
            resolve("ok");
        }
        
    });
}

function getUserSession() {
    const user = {
        user: sessionStorage.getItem("userName"),
        userType: sessionStorage.getItem("userType")
    }
    if(!user.user || !user.userType){
        console.error("ERROR getUserSession");
    }
    return user
}

export default { saveUserSession, removeUserSession, getUserSession};
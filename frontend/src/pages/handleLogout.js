import userIdentity from '../api/userIdentity.js'

const handleLogout = (context, history) => { //function to logout the user
    userIdentity.removeUserSession(context); //clear user session data
    //axios.post("http://localhost:3001/api/logout"); //close user session
    fetch ('http://localhost:3001/api/logout', {// send post request, will delete cookie jwt token
        method: 'post',
        credentials: 'include'
    }).then((r) => {
        if (r.status === 200) {// check response status
            console.log("Logout successful " + r.status);
        }
        else console.log("Logout error " + r.status);
    }).catch(err=>{console.log(err)});
    history.push("/"); //redirect to login page
}

export default { handleLogout };
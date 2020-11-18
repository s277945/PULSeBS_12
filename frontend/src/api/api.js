
import axios from 'axios'


/**
 * 
 * API - Call to API should only be in here
 * 
 */


export async function login (userName, password){
    return axios.post(`http://localhost:3001/api/login`, { userName: userName, password: password}, {withCredentials: true})
        .then(result => {
            return {
                userName : result.data.userID,
                userType: result.data.userType
            }
        })
}

export function logout(){
    return axios.post("http://localhost:3001/api/logout", {}, {withCredentials: true})
}
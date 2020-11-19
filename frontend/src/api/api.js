import axios from 'axios'
import {useAuth} from '../components/Authsystem'


/**
 * 
 * API - Call to API should only be in here
 * 
 */
export const axiosInst = axios.create(); // create axios instance to manage interceptors

axiosInst.interceptors.response.use(// create response interceptor
    (response) => {return response},
    async function (error) {

        if(error.response.status === 404){
            // redirecti to 404 page
            // history.replace("/404")
        }

        if (error.response.status === 403 || error.response.status === 401) {// in case of expired jwt token
            const authCtx = useAuth();
            authCtx.signout();// perform signout from useProvideAuth() instance method
        }
        return Promise.reject(error);
    }
);

export function getLectures(){
    return axiosInst.get(`http://localhost:3001/api/lectures`, { withCredentials: true });
}

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
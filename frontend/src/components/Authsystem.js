import React, { useContext, createContext, useState } from "react";
import {login, logout} from '../api/api';
import axios from 'axios';

import {
  Route,
  Redirect,
  useHistory
} from "react-router-dom";


/**
 * Here is all the FN neede to handle the authentification of the user.
 * His information a both saved in a context called "authContext" and in the browser memory with the sessionStorage system
 */

export const authContext = createContext();


export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    
    return (
      <authContext.Provider value={auth}>
        {children}
      </authContext.Provider>
    );
}

export function useAuth() {
  return useContext(authContext);
}

/**
 * Internal FN !
 */
function useProvideAuth() {
    const [user, setUser] = useState(getUserSession());
    let history = useHistory();

    // NTH : this shouldn't probably be handle here
    if(user){
        if(user.userType === "s") history.replace("/studentHome")
        if(user.userType === "t") history.replace("/teacherHome")
    }


    const signin = (userName, password, cb) => {
    return login(userName, password).then((userr) => {
        saveUserSession(userr)
        setUser(userr)
        return userr 
    })
  };

  const signout = () => {
    sessionStorage.clear();
    setUser(null);
    return logout()
  };


  return {
    user,
    signin,
    signout,
  };
}

/**
 * PrivateRoute : user must be logged and be the correct userType to access this
 */
export function PrivateRoute({ children, userType, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        (auth.user && auth.user.userType === userType) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

/**
 * Local session saves
 */
function getUserSession() {
    const user = {
        user: sessionStorage.getItem("userName"),
        userType: sessionStorage.getItem("userType")
    }
    if(!user.user || !user.userType) return null;

    return user
}

function saveUserSession(user) {
    sessionStorage.setItem("userName", user.user);// set session storage data (user name, user type)
    sessionStorage.setItem("userType", user.userType);

}
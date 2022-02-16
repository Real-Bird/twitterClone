import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fBase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [init, setInit] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    onAuthStateChanged(authService, async (user) => {
      // if (user) {
      //   setIsLoggedIn(true);
      //   setUserObj(user);
      // } else {
      //   setIsLoggedIn(false);
      // }
      if (user) {
        if (user.displayName == null) {
          // const ind = user.email.indexOf("@");
          // const end = user.email.substring(0, ind);
          await updateProfile(user, {
            displayName: uuidv4(),
          })
        }
        // setUserObj(user);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => updateProfile(user, { displayName: user.displayName }),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    })
  }, [])
  const refreshUser = () => {
    const user = authService.currentUser;
    // setUserObj(Object.assign({}, user));
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => updateProfile(user, { displayName: user.displayName }),
    });
  }
  // console.log(authService.currentUser);
  // setInterval(() => {
  //   console.log(authService.currentUser);
  // }, 2000);
  return (
    <div>
      {/* {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} /> : "Initializing..."} */}
      {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} refreshUser={refreshUser} /> : "Initializing..."}
      <footer className="footer"> &copy; {new Date().getFullYear()} Rwitter by Real-Bird</footer>
    </div>
  );
}

export default App;

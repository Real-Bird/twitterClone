import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fBase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  }, [])

  // console.log(authService.currentUser);
  // setInterval(() => {
  //   console.log(authService.currentUser);
  // }, 2000);
  return (
    <div>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Initializing..."}

      <footer> &copy; {new Date().getFullYear()} Rwitter</footer>
    </div>
  );
}

export default App;

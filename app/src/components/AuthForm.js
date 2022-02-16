import { authService } from "fBase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { target: { name, value } } = event;
    if (name === "E-mail") {
      setEmail(value);
    } else if (name === "Password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    let data;
    if (newAccount) {
      data = createUserWithEmailAndPassword(authService, email, password).catch((e) => {
        setError(e.message);
      });
    } else {
      data = signInWithEmailAndPassword(authService, email, password).catch((error) => {
        setError(error.message);
      });
    }
  };
  const toggleAccount = () => { setNewAccount((prev) => !prev) };
  return (
    <>
      <form onSubmit={onSubmit} className="container">
        <input name="E-mail" onChange={onChange} type="text" placeholder="E-mail" value={email} required className="authInput" />
        <input name="Password" onChange={onChange} type="password" placeholder="Password" value={password} required className="authInput" />
        <input type="submit" value={newAccount ? "Create Account" : "Sign In"} className="authInput authSubmit" />
        {error && <span className="authError">{error}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">{newAccount ? "Sign In" : "Create Account"}</span>
    </>
  )
}

export default AuthForm;
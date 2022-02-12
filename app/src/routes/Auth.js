import { authService } from "fBase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import React, { useState } from "react";


const Auth = () => {
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
    try {
      event.preventDefault();
      let data;
      if (newAccount) {
        data = createUserWithEmailAndPassword(authService, email, password);
      } else {
        data = signInWithEmailAndPassword(authService, email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleAccount = () => { setNewAccount((prev) => !prev) };
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    await signInWithPopup(authService, provider);
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name="E-mail" onChange={onChange} type="text" placeholder="E-mail" value={email} required />
        <input name="Password" onChange={onChange} type="password" placeholder="Password" value={password} required />
        <input type="submit" value={newAccount ? "Create Account" : "Sign In"} />
        {error}
      </form>
      <span onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span>
      <div>
        <button onClick={onSocialClick} name="google">Continue with Google</button>
        <button onClick={onSocialClick} name="github">Continue with Github</button>
      </div>
    </div>
  )
}
export default Auth;
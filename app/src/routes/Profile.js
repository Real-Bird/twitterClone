import { authService } from "fBase";
import { updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [newName, setNewName] = useState("");
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");

  }
  // const getMyRweets = async () => {
  //   const q = query(
  //     collection(dbService, "rweets"),
  //     where("creatorId", "==", userObj.uid),
  //     orderBy("createdAt", "desc")
  //   );
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     console.log(doc.id, " => ", doc.data());
  //   });
  // }
  // useEffect(() => {
  //   getMyRweets();
  // }, [])
  const onChange = (event) => {
    const {
      target: { value },
    } = event
    setNewDisplayName(value);
    setNewName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
      setNewName("");
    }
  }
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input onChange={onChange} className="formInput" type="text" autoFocus placeholder="Display name" value={newName} />
        <input className="formBtn" type="submit" value="Update Profile" style={{
          marginTop: 10,
        }} />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>Log Out</span>
    </div>
  )
}


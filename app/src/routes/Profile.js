import { authService, dbService } from "fBase";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
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
    <>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} type="text" placeholder="Display name" value={newName} />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
}


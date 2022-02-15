import { authService, dbService } from "fBase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

export default ({ userObj }) => {
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");

  }
  const getMyRweets = async () => {
    const q = query(
      collection(dbService, "rweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  }
  useEffect(() => {
    getMyRweets();
  }, [])
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
}


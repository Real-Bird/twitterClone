import React, { useEffect, useState } from "react";
import { dbService } from "fBase";
import { collection, addDoc, query, getDocs, onSnapshot, orderBy } from "firebase/firestore";
import Rweet from "components/Rweet";

const Home = ({ userObj }) => {
  const [rweet, setRweet] = useState("");
  const [rweets, setRweets] = useState([]);

  // const getRweets = async () => {
  //   const q = query(collection(dbService, "rweets"));
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     const rweetObj = {
  //       ...doc.data(),
  //       id: doc.id,
  //     }
  //     setRweets((prev) => [rweetObj, ...prev])
  //   });
  // }
  useEffect(() => {
    let isMount = true;
    if (isMount) {
      const q = query(collection(dbService, "rweets"), orderBy("createdAt", "desc"));
      onSnapshot(q, (snapshot) => {
        const rweetArr = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setRweets(rweetArr);
      })
      return () => isMount = false;
    }
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(dbService, "rweets"), {
        text: rweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
      });
      setRweet("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  const onChange = (event) => {
    const {
      target: { value },
    } = event
    setRweet(value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} value={rweet} />
        <input type="submit" value="Rweet" />
      </form>
      <span>
        {rweets.map((rweet) =>
          <Rweet key={rweet.id} rweetObj={rweet} isOwner={rweet.creatorId === userObj.uid} />
        )}
      </span>
    </div>
  )
}
export default Home;
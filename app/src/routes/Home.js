import React, { useEffect, useState } from "react";
import { dbService } from "fBase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import Rweet from "components/Rweet";
import RweetFactory from "components/RweetFactory";

const Home = ({ userObj }) => {

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
    const q = query(collection(dbService, "rweets"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const rweetArr = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      if (isMount) {
        setRweets(rweetArr);
      }
    })
    return () => isMount = false;
  }, []);

  return (
    <div className="container">
      <RweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {rweets.map((rweet) => (
          <Rweet key={rweet.id} rweetObj={rweet} isOwner={rweet.creatorId === userObj.uid} />)
        )}
      </div>
    </div>
  )
}
export default Home;
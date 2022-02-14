import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storage } from "fBase";
import { collection, addDoc, query, getDocs, onSnapshot, orderBy } from "firebase/firestore";
import Rweet from "components/Rweet";
import { ref, uploadString } from "firebase/storage";

const Home = ({ userObj }) => {
  const [rweet, setRweet] = useState("");
  const [rweets, setRweets] = useState([]);
  const [attachement, setAttachment] = useState();
  const fileClear = useRef();
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
    const fileRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
    const response = await uploadString(fileRef, attachement, "data_url");
    console.log(response);
    // try {
    //   const docRef = await addDoc(collection(dbService, "rweets"), {
    //     text: rweet,
    //     createdAt: Date.now(),
    //     creatorId: userObj.uid,
    //   });
    //   setRweet("");
    // } catch (e) {
    //   console.error("Error adding document: ", e);
    // }
  }
  const onChange = (event) => {
    const {
      target: { value },
    } = event
    setRweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const { currentTarget: { result } } = finishedEvent;
      setAttachment(result);
    }
    reader.readAsDataURL(theFile);
  }
  const onClearImgClick = () => {
    setAttachment(null);
    fileClear.current.value = null;
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} value={rweet} />
        <input onChange={onFileChange} type="file" accept="image/*" ref={fileClear} />
        <input type="submit" value="Rweet" />
        {attachement && <div>
          <img src={attachement} width="50px" height="50px" />
          <button onClick={onClearImgClick}>Clear</button>
        </div>}
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
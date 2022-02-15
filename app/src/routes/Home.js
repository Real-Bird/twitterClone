import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storage } from "fBase";
import { collection, addDoc, query, getDocs, onSnapshot, orderBy } from "firebase/firestore";
import Rweet from "components/Rweet";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const Home = ({ userObj }) => {
  const [rweet, setRweet] = useState("");
  const [rweets, setRweets] = useState([]);
  const [attachment, setAttachment] = useState("");
  const [imgFile, setImgFile] = useState("");
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
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(attachmentRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const docRef = {
      text: rweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, "rweets"), docRef);
    setRweet("");
    setAttachment("");
    setImgFile("");
  }
  const onChange = (event) => {
    const {
      target: { value },
    } = event
    setRweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files, value },
    } = event;
    setImgFile(value);
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const { currentTarget: { result } } = finishedEvent;
      setAttachment(result);
    }
    reader.readAsDataURL(files[0]);
  }
  const onClearImgClick = () => {
    setAttachment("");
    fileClear.current.value = null;
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} value={rweet} />
        <input onChange={onFileChange} type="file" accept="image/*" ref={fileClear} value={imgFile} />
        <input type="submit" value="Rweet" ref={fileClear} />
        {attachment && <div>
          <img src={attachment} width="50px" height="50px" />
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
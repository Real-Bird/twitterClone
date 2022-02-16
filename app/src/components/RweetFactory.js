import { dbService, storage } from "fBase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const RweetFactory = ({ userObj, }) => {
  const [rweet, setRweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const [imgFile, setImgFile] = useState("");
  const fileClear = useRef();
  const onSubmit = async (event) => {
    if (rweet === "") {
      return;
    }
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
    setImgFile("");
  }
  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input className="factoryInput__input" onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} value={rweet} />
        <input className="factoryInput__arrow" type="submit" value="&rarr;" ref={fileClear} />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input id="attach-file" onChange={onFileChange} type="file" accept="image/*" ref={fileClear} value={imgFile} style={{
        opacity: 0,
      }} />

      {attachment && (
        <div className="factoryForm__attachment">
          <img src={attachment} style={{
            backgroundImage: attachment,
          }} />
          <div className="factoryForm__clear" onClick={onClearImgClick}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>)}
    </form>
  )
}

export default RweetFactory;
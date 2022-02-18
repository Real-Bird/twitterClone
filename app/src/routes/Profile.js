import { authService, storage } from "fBase";
import { updateProfile } from "firebase/auth";
import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { deleteObject, getDownloadURL, listAll, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export default ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [newName, setNewName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [imgFile, setImgFile] = useState("");
  const fileClear = useRef();
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
    // console.log(ref(storage, `profile/${userObj.uid}/${userObj.profilePhoto}`))
    if (profilePhoto === "" && newName === "") {
      return;
    }
    event.preventDefault();
    const listRef = ref(storage, `profile/${userObj.uid}`);
    listAll(listRef).then((res) => {
      res.items.forEach((item) => {
        deleteObject(ref(storage, `profile/${userObj.uid}/${item.name}`));
      });
    });
    let profilePhotoURL = "";
    if (profilePhoto !== "") {
      const attachmentRef = ref(storage, `profile/${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(attachmentRef, profilePhoto, "data_url");
      profilePhotoURL = await getDownloadURL(response.ref);
    }
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
      setNewName("");
    } else if (userObj.profilePhoto !== profilePhoto) {
      await updateProfile(authService.currentUser, {
        photoURL: profilePhotoURL,
      });
      refreshUser();
      setProfilePhoto("");
    }
  }
  const onFileChange = (event) => {
    const {
      target: { files, value },
    } = event;
    setImgFile(value);
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const { currentTarget: { result } } = finishedEvent;
      setProfilePhoto(result);
    }
    reader.readAsDataURL(files[0]);
  }
  const onClearImgClick = () => {
    setProfilePhoto("");
    fileClear.current.value = null;
    setImgFile("");
  }
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm" style={{ paddingBottom: 10, }}>
        <input onChange={onChange} className="formInput" type="text" autoFocus placeholder="Display name" value={newName} />

        <label htmlFor="attach-file" className="factoryInput__label">
          <span>Change Profile Photos</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input id="attach-file" onChange={onFileChange} type="file" accept="image/*" ref={fileClear} value={imgFile} style={{
          opacity: 0,
        }} />

        {profilePhoto && (
          <div className="factoryForm__attachment">
            <img src={profilePhoto} style={{
              backgroundImage: profilePhoto,
            }} />
            <div className="factoryForm__clear" onClick={onClearImgClick}>
              <span>Remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>)}
        <input className="formBtn" type="submit" value="Update Profile" style={{
          marginTop: 10,

        }} />
      </form>
      <img scr={profilePhoto} />
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick} style={{ marginTop: 10, }}>Log Out</span>
    </div>
  )
}


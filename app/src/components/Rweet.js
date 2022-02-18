import React, { useEffect, useState } from "react";
import { authService, dbService, storage } from "fBase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, listAll, ref, uploadString } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import loadingGif from "../img/profile_load.gif";

const Rweet = ({ rweetObj, isOwner, userObj }) => {
  const [editing, setEditing] = useState(false);
  const [newRweet, setNewRweet] = useState(rweetObj.text);
  const [refStorage, setRefStorage] = useState("");
  const [isPhotoLoad, setIsPhotoLoad] = useState(true);
  useEffect(() => {
    let isMount = true;
    if (isMount) {
      const listRef = ref(storage, `profile`);
      listAll(listRef).then((res) => {
        res.prefixes.forEach((folderRef) => {
          if (folderRef.name === rweetObj.creatorId) {
            listAll(folderRef).then((detail) => {
              detail.items.forEach(async (item) => {
                let refProfilePath = await getDownloadURL(ref(storage, item.fullPath))
                setRefStorage(refProfilePath);
                setIsPhotoLoad(false);
              });
            });
          }
        });
      });
    } return () => isMount = false;
  }, [])
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you wnat to delete this rweet?");
    if (ok) {
      await deleteDoc(doc(dbService, "rweets", `${rweetObj.id}`));
      if (rweetObj.attachmentUrl) {
        await deleteObject(ref(storage, rweetObj.attachmentUrl));
      }
    }
  }
  const toggleEditing = () => setEditing((prev) => !prev)
  const onSubmit = async (event) => {
    event.preventDefault();
    const newRweetRef = doc(dbService, "rweets", `${rweetObj.id}`);
    await updateDoc(newRweetRef, {
      text: newRweet,
    });
    setEditing(false);
  }
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewRweet(value);
  }
  return (
    <div className="nweet">
      {
        editing ? (
          <>
            <form onSubmit={onSubmit} className="container nweetEdit">
              <input type="text" placeholder="Edit your rweet" onChange={onChange} value={newRweet} required autoFocus className="formInput" />
              <input type="submit" value="Edit" className="formBtn" />
            </form>
            <span onClick={toggleEditing} className="formBtn cancelBtn">
              Cancel
            </span>
          </>
        ) :
          <>
            <div className="article">
              <div className="block">
                {isPhotoLoad ? <img src={loadingGif} height="40px" width="40px" /> : <img className="photo" src={refStorage} height="40px" width="40px" />}
                <p className="writer">{rweetObj.nickName}</p>
              </div>
              <p style={{ fontSize: 18 }}>{rweetObj.text}</p>
            </div>
            {rweetObj.attachmentUrl && <img src={rweetObj.attachmentUrl} className="__attach" />}
            {isOwner && (
              <div className="nweet__actions">
                <span onClick={toggleEditing}><FontAwesomeIcon icon={faPencilAlt} /></span>
                <span onClick={onDeleteClick}><FontAwesomeIcon icon={faTrash} /></span>
              </div>

            )}</>

      }
    </div>
  )
}

export default Rweet;
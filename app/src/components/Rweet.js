import React, { useState } from "react";
import { dbService, storage } from "fBase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Rweet = ({ rweetObj, isOwner, userObj }) => {
  const [editing, setEditing] = useState(false);
  const [newRweet, setNewRweet] = useState(rweetObj.text);
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
            <p className="writer">{rweetObj.nickName}</p>
            <h4>{rweetObj.text}</h4>
            {rweetObj.attachmentUrl && <img src={rweetObj.attachmentUrl} />}
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
import React, { useState } from "react";
import { dbService, storage } from "fBase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Rweet = ({ rweetObj, isOwner }) => {
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
    <div>
      {
        editing ? (
          <>
            <form onSubmit={onSubmit}>
              <input type="text" placeholder="Edit your rweet" onChange={onChange} value={newRweet} required />
              <input type="submit" value="Edit" />
            </form>
            <button onClick={toggleEditing}>Cancel</button>
          </>
        ) :
          <>
            <h4>{rweetObj.text}</h4>
            {rweetObj.attachmentUrl && <img src={rweetObj.attachmentUrl} width="50px" height="50px" />}
            {isOwner && (
              <>
                <button onClick={toggleEditing}>Edit Rweet</button>
                <button onClick={onDeleteClick}>Delete Rweet</button>
              </>
            )}</>

      }
    </div>
  )
}

export default Rweet;
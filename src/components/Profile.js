import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";

export default function Profile() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [tempUidd, setTempUidd] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  // add
  const writeToDatabase = (e) => {
    e.preventDefault();
    const uidd = uid();
    set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
      name: name,
      uidd: uidd,
    });

    setName("");
  };

  // update
  const handleUpdate = (name) => {
    setIsEdit(true);
    setName(name.name);
    setTempUidd(name.uidd);
  };

  const handleEditConfirm = () => {
    update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), {
      name: name,
    });

    setIsEdit(false);
    setName("");
  };

  const handleGoToHomepage = () => {
    navigate("/homepage");
  };

  return (
    <div>
      <form onSubmit={writeToDatabase}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <button type="submit">Save Profile</button>
        <button onClick={() => handleUpdate(name)}>
          Edit
        </button>
      </form>
      <button onClick={handleGoToHomepage}>Go to Homepage</button>
    </div>
  );
}

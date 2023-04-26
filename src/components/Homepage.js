import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import "./homepage.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from '@mui/icons-material/Logout';
import CheckIcon from '@mui/icons-material/Check';

export default function Homepage() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUidd, setTempUidd] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // read
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).map((todo) => {
              if (todo.uidd === 'totalPoints') {
                setTotalPoints(todo.points);
              } else {
                setTodos((oldArray) => [...oldArray, todo]);
              }
            });
          }
        });
      } else if (!user) {
        navigate("/");
      }
    });
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  // add
  const writeToDatabase = () => {
    const uidd = uid();
    set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
      todo: todo,
      uidd: uidd,
      points: 1
    });

    setTodo("");
  };

  // update
  const handleUpdate = (todo) => {
    setIsEdit(true);
    setTodo(todo.todo);
    setTempUidd(todo.uidd);
  };

  const handleEditConfirm = () => {
    update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), {
      todo: todo,
    });

    setIsEdit(false);
    setTodo("");
  };

  // delete
  const handleDelete = (uidd) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uidd}`));
  };

  // complete
  const handleComplete = (uidd) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uidd}`));
    updateTotalPoints(totalPoints + 1);
  };

  // update total points
  const updateTotalPoints = (points) => {
    setTotalPoints(points);
    update(ref(db, `/${auth.currentUser.uid}/totalPoints`), {
      points: points,
      uidd: 'totalPoints'
    });
  }

  return (
    <div className="homepage">
      <div className="header">
        <h1>Todo App</h1>
        <button onClick={handleSignOut}>
          <LogoutIcon />
        </button>
      </div>
      <div className="input">
        <input
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          placeholder="Enter a todo"
        />
        {!isEdit ? (
          <button onClick={writeToDatabase}>
            <AddIcon />
          </button>
        ) : (
          <button onClick={handleEditConfirm}>
            <CheckIcon />
          </button>
        )}
      </div>
      <div className="todos">
        {todos.map((todo) => (
          <div key={todo.uidd} className="todo">
            <p>{todo.todo}</p>
            <div className="icons">
              <button onClick={() => handleUpdate(todo)}>
                <EditIcon />
              </button>
              <button onClick={() => handleDelete(todo.uidd)}>
                <DeleteIcon />
              </button>
              <button onClick={() => handleComplete(todo.uidd)}>
                <CheckIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
      <h2>Total Points: {totalPoints}</h2>
    </div> 
  );
}

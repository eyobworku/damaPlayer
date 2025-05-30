import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, postDataExample } from "../services/api-client";
import useId from "../services/useId";
import "../index.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [id, setUserId] = useId();
  const [name, setName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");

  const handleClick = async () => {
    if (name !== "" && avatar !== "") {
      const { success, data } = await postDataExample<User>({ name, avatar });
      console.log(data);

      if (
        success &&
        setUserId &&
        typeof setUserId === "function" &&
        data._id !== undefined
      ) {
        setUserId(data._id);
      }
    }
  };

  useEffect(() => {
    if (id !== null) {
      navigate("/chat");
    }
  }, [id]);

  return (
    <>
      <div>
        <h2>Login</h2>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Avatar:</label>
          <input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
        </div>
        <button onClick={handleClick}>Login</button>
      </div>
      {/* <div>
        <h2>User List</h2>
        <ul>
          {data.map((user) => (
            <li key={user._id}>
              <span>{user._id} </span>
              <span>{user.avatar} </span>
              <span>{user.name} </span>
            </li>
          ))}
        </ul>
      </div> */}
    </>
  );
};

export default LoginPage;

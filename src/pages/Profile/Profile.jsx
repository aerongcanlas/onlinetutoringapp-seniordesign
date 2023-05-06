import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [userid, setUserid] = useState(null);
  const [token, setToken] = useState("");
  const [account, setAccount] = useState(null);
  const [appt, setAppt] = useState([]);

  useEffect(() => {
    const data = {
      username: user.nickname,
    };
    fetch("http://127.0.0.1:3000/fetch-user", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Headers": "*",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setAccount(data);
      })
      .catch((e) => console.log(e));

    fetch("http://127.0.0.1:3000/get-appointments", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Headers": "*",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.text())
      .then((data) => {
        setAppt(data);
        console.log(data);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <div>
      {account ? (
        <>
          <img src={user.picture} alt={user.name} />
          <h2>Username: {user.nickname}</h2>
          <p>Email: {user.email}</p>
          <p>
            Name: {account.FirstName} {account.LastName}
          </p>
          <p>Total Hours: {account.TotalHours}</p>
        </>
      ) : (
        <div> loading </div>
      )}
    </div>
  );
};

export default Profile;

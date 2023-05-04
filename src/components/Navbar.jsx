import React from "react";
import "../styling/Navbar.css";
import { Link } from "react-router-dom";
import useToken from "./useToken";
import { useAuth0 } from "@auth0/auth0-react";

function Navbar() {
  const { isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();

  const { token, removeToken, setToken } = useToken();
  if (isLoading) {
    return <div>Loading ...</div>;
  }
  return (
    <div id="header">
      <Link id="title" to="/">
        Blu-E
      </Link>
      <Link id="tutors" className="links" to="/browse-tutors">
        Tutors
      </Link>
      {!isAuthenticated ? (
        <>
          <button
            id="login"
            className="links"
            onClick={() => loginWithRedirect()}
          >
            Log In
          </button>
          <Link id="signup" className="links" to="/signup">
            Signup
          </Link>
        </>
      ) : (
        <>
          <button
            id="logout"
            className="links"
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log Out
          </button>
          <Link id="profile" className="links" to="/profile">
            Profile
          </Link>
          <Link id="favorites" className="links" to="/favorites">
            Favorites
          </Link>
        </>
      )}
    </div>
  );
}

export default Navbar;

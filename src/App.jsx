import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./styling/App.css";
import { Route, Routes } from "react-router-dom";
import { PageLoader } from "./components/page-loader";
import { AuthenticationGuard } from "./components/authentication-guard";

import Landing from "./pages/Landing/Landing";
import AllTutors from "./pages/AllTutors/AllTutors";
import Profile from "./pages/Profile/Profile";
import Favorites from "./pages/Favorites/Favorites";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Footer from "./components/Footer";
import Signup from "./components/Signup";
import SetAppt from "./pages/SetAppt/SetAppt";

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="page-layout">
        <PageLoader />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/browse-tutors"
          element={<AuthenticationGuard component={AllTutors} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/profile"
          element={<AuthenticationGuard component={Profile} />}
        />
        <Route
          path="/set-appointment/:username"
          element={<AuthenticationGuard component={SetAppt} />}
        />
        <Route
          path="/favorites"
          element={<AuthenticationGuard component={Favorites} />}
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

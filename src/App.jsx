import { useState } from "react";
import "./styling/App.css";
import { Route, Routes } from "react-router-dom";
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
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/browse-tutors" element={<AllTutors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/set-appointment/:username" element={<SetAppt />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

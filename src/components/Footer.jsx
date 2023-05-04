import React from "react";
import "../styling/Footer.css";

function Footer() {
  return (
    <footer>
      <div id="copyright">Blu-E Tutoring © 2023 No Rights Reserved</div>
      <ul id="footer-menu">
        <li>
          <a>Show Disclaimer</a>
        </li>
        <li>
          <a>Privacy</a>
        </li>
        <li>
          <a>About Us</a>
        </li>
        <li>
          <a>Contact Us</a>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;

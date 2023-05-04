import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-f75xm1ze47iswatb.us.auth0.com"
      clientId="Xu60ip1Vj4gIGdIxpWgD1g9N3mbbNavG"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://dev-f75xm1ze47iswatb.us.auth0.com/api/v2/",
        scope: "read:current_user update:current_user_metadata",
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);

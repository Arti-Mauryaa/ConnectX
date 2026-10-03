import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

import "./index.css";
import App from "./App";
import ChatProvider from "./Context/ChatProvider";
import { Toaster } from "./components/ui/toaster";
import { API_URL } from "./config";

// All "/api/..." requests go to the backend defined in config.js
axios.defaults.baseURL = API_URL;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ChatProvider>
        <App />
        <Toaster />
      </ChatProvider>
    </BrowserRouter>
  </StrictMode>
);

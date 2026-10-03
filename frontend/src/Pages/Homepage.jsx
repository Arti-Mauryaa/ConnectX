import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import ThemeToggle from "../components/ui/ThemeToggle";
import { ChatIcon } from "../components/ui/Icons";

function Homepage() {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, [navigate]);

  const isLogin = mode === "login";

  return (
    <div className="auth">
      <div className="auth-theme"><ThemeToggle /></div>

      <main className={`auth-card ${isLogin ? "" : "wide"}`}>
        <div className="brand auth-brand">
          <span className="brand-mark"><ChatIcon /></span>
          ConnectX
        </div>

        <h1 className="auth-title">{isLogin ? "Log in" : "Create your account"}</h1>

        {isLogin ? <Login /> : <Signup />}

        <p className="auth-switch">
          {isLogin ? "New here?" : "Already have an account?"}
          <button
            type="button"
            className="link-btn"
            onClick={() => setMode(isLogin ? "signup" : "login")}
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </main>
    </div>
  );
}

export default Homepage;

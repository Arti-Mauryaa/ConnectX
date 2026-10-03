import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { toaster } from "../ui/toast";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = ChatState();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toaster.create({ title: "Please fill all the fields", type: "warning" });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post("/api/user/login", { email: email.trim(), password });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      navigate("/chats");
    } catch (error) {
      toaster.create({
        title: "Login failed",
        description: error.response?.data?.message || "Could not reach the server",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={submitHandler} noValidate>
      <div className="field">
        <label htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          className="input"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          autoFocus
        />
      </div>

      <div className="field">
        <label htmlFor="login-password">Password</label>
        <div className="input-wrap">
          <input
            id="login-password"
            className="input"
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="toggle"
            onClick={() => setShow(!show)}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
        {loading ? <span className="spinner" /> : "Log in"}
      </button>

      <div className="center">
        <button
          type="button"
          className="link-btn"
          onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
          }}
        >
          Use guest credentials
        </button>
      </div>
    </form>
  );
};

export default Login;

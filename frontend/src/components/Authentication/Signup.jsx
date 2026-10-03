import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { toaster } from "../ui/toast";
import { ChatState } from "../../Context/ChatProvider";
import { CLOUDINARY } from "../../config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 0-4 score based on length and character variety
const getStrength = (pw) => {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return Math.max(1, score);
};
const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();
  const { setUser } = ChatState();

  const uploadEnabled = CLOUDINARY.cloudName && CLOUDINARY.uploadPreset;

  const touch = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const errors = {
    name: !name.trim() ? "Enter your name" : "",
    email: !email ? "Enter your email" : !EMAIL_RE.test(email.trim()) ? "Enter a valid email address" : "",
    password: !password ? "Create a password" : password.length < 6 ? "Use at least 6 characters" : "",
    confirm: !confirmpassword ? "Re-enter your password" : password !== confirmpassword ? "Passwords do not match" : "",
  };
  const show_ = (f) => touched[f] && errors[f];
  const strength = getStrength(password);

  // Upload profile picture to Cloudinary (only when configured in config.js)
  const postDetails = async (file) => {
    if (!file) return;

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      toaster.create({ title: "Please select a JPEG or PNG image", type: "warning" });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY.uploadPreset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!res.ok || !(data.secure_url || data.url)) {
        throw new Error(data.error?.message || "Upload failed");
      }
      setPic(data.secure_url || data.url);
    } catch (err) {
      toaster.create({ title: "Image upload failed", description: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true });

    if (Object.values(errors).some(Boolean)) return;

    try {
      setLoading(true);

      const { data } = await axios.post("/api/user", {
        name: name.trim(),
        email: email.trim(),
        password,
        ...(pic && { pic }),
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      navigate("/chats");
    } catch (error) {
      toaster.create({
        title: "Sign up failed",
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
        <label htmlFor="su-name">Full name</label>
        <input
          id="su-name"
          className={`input ${show_("name") ? "invalid" : ""}`}
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => touch("name")}
          autoComplete="name"
          autoFocus
        />
        {show_("name") && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="field">
        <label htmlFor="su-email">Email address</label>
        <input
          id="su-email"
          className={`input ${show_("email") ? "invalid" : ""}`}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => touch("email")}
          autoComplete="email"
        />
        {show_("email") && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="field">
        <label htmlFor="su-pass">Password</label>
        <div className="input-wrap">
          <input
            id="su-pass"
            className={`input ${show_("password") ? "invalid" : ""}`}
            type={show ? "text" : "password"}
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => touch("password")}
            autoComplete="new-password"
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
        {show_("password") && <span className="field-error">{errors.password}</span>}
        {password && (
          <>
            <div className="strength" data-level={strength} aria-hidden="true">
              <i /><i /><i /><i />
            </div>
            <div className="strength-label">
              <span>Password strength</span>
              <span>{STRENGTH_LABELS[strength]}</span>
            </div>
          </>
        )}
      </div>

      <div className="field">
        <label htmlFor="su-confirm">Confirm password</label>
        <input
          id="su-confirm"
          className={`input ${show_("confirm") ? "invalid" : ""}`}
          type={show ? "text" : "password"}
          placeholder="Re-enter password"
          value={confirmpassword}
          onChange={(e) => setConfirmpassword(e.target.value)}
          onBlur={() => touch("confirm")}
          autoComplete="new-password"
        />
        {show_("confirm") && <span className="field-error">{errors.confirm}</span>}
      </div>

      <div className="upload-row">
        <span className="upload-label">Profile picture (optional)</span>

        <div className="upload-actions">
          {pic && <img className="upload-thumb" src={pic} alt="Selected profile" />}

          {uploadEnabled ? (
            <>
              <label htmlFor="su-pic" className="btn btn-sm">
                {pic ? "Change photo" : "Choose photo"}
              </label>
              <input
                id="su-pic"
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => postDetails(e.target.files[0])}
                hidden
              />
            </>
          ) : (
            <button
              type="button"
              className="btn btn-sm"
              onClick={() =>
                toaster.create({
                  title: "Photo upload is not set up yet",
                  description: "Add your Cloudinary details in src/config/index.js",
                  type: "warning",
                })
              }
            >
              Choose photo
            </button>
          )}

          {pic && (
            <button type="button" className="link-btn" onClick={() => setPic("")}>
              Remove
            </button>
          )}
        </div>
      </div>

      <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
        {loading ? <span className="spinner" /> : "Create account"}
      </button>
    </form>
  );
};

export default Signup;

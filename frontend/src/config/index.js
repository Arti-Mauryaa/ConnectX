// Backend URL. After deploying the backend on Render, paste its URL below.
const PRODUCTION_API_URL = "https://connectx-backend-z8fn.onrender.com";

export const API_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : PRODUCTION_API_URL;

// Optional: profile picture upload (Cloudinary unsigned preset).
// Leave empty to hide the upload field and use initials instead.
export const CLOUDINARY = {
  cloudName: "",
  uploadPreset: "connectx_profiles",
};

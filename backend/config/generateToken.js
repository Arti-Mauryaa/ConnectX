const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  // Creates a JWT token for authenticated users
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
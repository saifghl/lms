const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  console.log("Login API called");
  console.log("Login Attempt Payload:", req.body);

  try {
    const { email, password, role } = req.body;

    // ---------------------------------------------------------
    // SIMPLE LOGIN BYPASS (As requested)
    // ---------------------------------------------------------
    // Accepts any email/password and logs in as the requested Role.

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password required",
      });
    }

    // Mock User
    const user = {
      id: 999, // Dummy ID
      email: email,
      role: role || 'Admin', // Use requested role or default
    };

    console.log(`Bypass Login: Logging in ${email} as ${user.role}`);

    // Generate Token
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "fallback_secret_key_123",
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful (Bypass Mode)",
      token,
      user,
    });
    // ---------------------------------------------------------

  } catch (error) {
    console.error("LOGIN ERROR FULL:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message, // Send error to client for easier debugging
    });
  }
};

module.exports = { login };

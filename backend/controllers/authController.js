const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const register = async (req, res) => {
  console.log("Register function is running");
  console.log("hello");
    const { email, password,full_name} = req.body;
    
    try {
        // Check if user exists
        const [existingUser] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const [userResult] = await pool.execute(
            'INSERT INTO users (full_name,email, password, role) VALUES (?,?, ?, ?)',
            [full_name,email, hashedPassword,"user"]
        );


        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const login = async (req, res) => {
  console.log("Login fucntion is running");
  const { email, password} = req.body;
  console.log(req.body);
  try {
    // 1. Get user by email
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    //user variable store user data
    const user = users[0];

    // 3. Password check
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email,name:user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 5. Send response
   res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name:user.name
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { login,register };
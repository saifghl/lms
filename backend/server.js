const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const pool = require("./config/db");

// Import routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require("./routes/projectRoutes");
const unitRoutes = require("./routes/unitRoutes");
const leaseRoutes = require("./routes/leaseRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Test database connection
pool.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully!');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err);
    });

// Routes
app.use('/api/auth', authRoutes);
app.use("/api", projectRoutes);
app.use("/api", unitRoutes);
app.use("/api", leaseRoutes);
app.use("/api", tenantRoutes);
app.use("/api", ownerRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", activityLogRoutes);

// Test routes (for development only - remove in production)
if (process.env.NODE_ENV !== 'production') {
    const testRoutes = require('./routes/testRoutes');
    app.use('/api/test', testRoutes);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Test endpoint to verify login route is accessible
app.post('/api/auth/test', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Login endpoint is accessible',
        body: req.body 
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
});

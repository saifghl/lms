const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
main
const pool = require("./config/db");

// Import routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require("./routes/projectRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");

const leaseRoutes = require("./routes/leaseRoutes");
const managementRoutes = require("./routes/managementRoutes");

const managementRoutes = require("./routes/managementRepRoutes");


// Import routes
const authRoutes = require('./routes/authRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const projectRoutes = require('./routes/projectRoutes');
const leaseRoutes = require('./routes/leaseRoutes');
const ownerRoutes = require('./routes/ownerRoutes');




// Import database
const pool = require('./config/db');



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
app.use("/api", dashboardRoutes);
app.use("/api", activityLogRoutes);
app.use("/api/management", managementRoutes);
app.use("/api/leases", leaseRoutes);
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



app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);

        console.log('Database connected successfully!');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });



// Routes

app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/leases', leaseRoutes);
app.use('/api/owners', ownerRoutes);



const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);

});

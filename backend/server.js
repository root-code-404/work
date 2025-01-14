const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Connect to your database
const userRoutes = require('./routes/login/userRoutes'); // Import user routes
const carRoutes = require('./routes/vehicles/car/carRoutes'); // Import car routes
const bikeRoutes = require('./routes/vehicles/bike/bikeRoutes'); // Import bike routes
const menRoutes = require('./routes/clothes/men/menRoutes'); // Import men routes
const cartRoutes = require('./routes/cart/cartRoutes'); // Import cart routes
const purchaseRoutes = require('./routes/purchase/purchaseRoutes'); // Import purchase routes
const itemRoutes = require('./routes/item/itemRoutes'); // Import item routes
const itemTypeRoutes = require('./routes/item/itemTypeRoutes'); // Import item type routes
const purchaseListRoutes = require('./routes/purchase/purchaseListRoutes'); // Import purchase list routes

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
const allowedOrigins = ['http://192.168.1.5:5173', 'https://mo4work.netlify.app']; // Replace with your local IP

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.some((allowedOrigin) => origin.startsWith(allowedOrigin))) {
                callback(null, true);
            } else {
                callback(new Error(`CORS error: Origin ${origin} not allowed by CORS policy.`));
            }
        },
        credentials: true, // If using cookies or auth headers
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    })
);

// Handle preflight requests for all routes
app.options('*', cors());

app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded images as static files

// Database connection
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bikes', bikeRoutes);
app.use('/api/men', menRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/itemtype', itemTypeRoutes);
app.use('/api/purchases', purchaseListRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.message);
    if (err instanceof Error && err.message.includes('CORS')) {
        res.status(403).json({ error: 'CORS error: Access denied.' });
    } else {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

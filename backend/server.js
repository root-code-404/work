const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Connect to your database
const userRoutes = require('./routes/login/userRoutes'); // Import user routes
const carRoutes = require('./routes/vehicles/car/carRoutes'); // Import car routes
const bikeRoutes = require('./routes/vehicles/bike/bikeRoutes'); // Import bike routes
const menRoutes = require('./routes/clothes/men/menRoutes'); // Import men routes

const cartRoutes = require('./routes/cart/cartRoutes'); // Import car routes
const purchaseRoutes = require('./routes/purchase/purchaseRoutes'); // Import car routes
const itemRoutes = require('./routes/item/itemRoutes'); // Import item routes
const itemTypeRoutes = require('./routes/item/itemTypeRoutes'); // Import item routes
const purchaseListRoutes = require('./routes/purchase/purchaseListRoutes'); // Import car routes


// const recommendationRoutes = require('./routes/recommendation/recommendationRoutes'); // Import item routes



// const sitemapRoutes = require('./routes/sitemapRoutes');
// const path = require('path');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
const allowedOrigins = ['https://mo4work.netlify.app', 'http://localhost:5173'];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);

app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded images as static files

// Database connection
connectDB();

// Use user routes
app.use('/api/users', userRoutes); 
//Car Routes
app.use('/api/cars', carRoutes);
//Bike Routes
app.use('/api/bikes', bikeRoutes);
//Men Routes
app.use('/api/men', menRoutes);
// Cart routes
app.use('/api/cart', cartRoutes);

//purchase Routes
app.use('/api/purchase', purchaseRoutes);
//Item Routes
app.use('/api/items', itemRoutes);

app.use('/api/itemtype', itemTypeRoutes);
app.use('/api/purchases', purchaseListRoutes);



// app.use('/api/recommendation', recommendationRoutes);


// app.use('/', sitemapRoutes);
// app.use(express.static(path.join(__dirname, 'client/build')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// });
// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

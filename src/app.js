const express = require('express');
const cors = require('cors');
const path = require('path');
const groceryOrderRoutes = require('./routes/groceryOrder.routes');
const hotelRoutes = require('./routes/hotelRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const brandRoutes = require('./routes/brand.routes');
const productRoutes = require('./routes/product.routes');
const sizeRoutes = require('./routes/size.routes');
const colorRoutes = require('./routes/color.routes');
const unitRoutes = require('./routes/unit.routes');
const gcartRoutes = require('./routes/gcart.routes');
const groceryRoutes = require('./routes/grocery.routes');
const taxiRideRoutes = require('./routes/taxiRide.routes');
const taxiDriverRoutes = require('./routes/taxiDriver.routes');
const taxiVehicleRoutes = require('./routes/taxiVehicle.routes');
const gwishlistRoutes = require('./routes/gwishlist.routes');
const userRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');
const staffRoutes = require('./routes/staff.routes');
const productAttributeRoutes = require('./routes/productAttribute.routes');
const restaurantRoutes = require('./routes/restaurant.routes');
const dishRoutes = require('./routes/dish.routes');

const app = express();

// ✅ CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded files from the 'uploads' directory (not 'public/uploads')
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', brandRoutes);     // /admin/brands
app.use('/api/admin', productRoutes);   // /admin/products
app.use('/api/admin', sizeRoutes);      // /admin/sizes
app.use('/api/admin', colorRoutes);     // /admin/colors
app.use('/api/admin', unitRoutes);      // /admin/units
app.use('/api/hotels', hotelRoutes);
app.use('/api/products',productRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/groceries', groceryRoutes);
app.use('/api/gcart', gcartRoutes);     // ✅ Grocery cart items
app.use('/api/gwishlist', gwishlistRoutes);
app.use('/api/gorders', groceryOrderRoutes); // ✅ Grocery wishlist
app.use('/api/taxi-rides', taxiRideRoutes);
app.use('/api/taxi-drivers', taxiDriverRoutes);
app.use('/api/taxi-vehicles', taxiVehicleRoutes);
app.use('/api/users', userRoutes);      // ✅ User management
app.use('/api/roles', roleRoutes);      // ✅ Role management
app.use('/api/staff', staffRoutes);     // ✅ Staff management
app.use('/api/grocery-orders', groceryOrderRoutes);
app.use('/api/product-attributes', productAttributeRoutes);
app.use('/api/restaurants', restaurantRoutes); // ✅ Restaurant management
app.use('/api/dishes', dishRoutes);

// ✅ Default API welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Super App API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      categories: '/api/categories',
      admin: '/api/admin',
      hotels: '/api/hotels',
      rooms: '/api/rooms',
      bookings: '/api/bookings',
      groceries: '/api/groceries',
      gcart: '/api/gcart',
      gwishlist: '/api/gwishlist',
      taxiRides: '/api/taxi-rides',
      taxiDrivers: '/api/taxi-drivers',
      taxiVehicles: '/api/taxi-vehicles',
      gorders: '/api/gorders',
      users: '/api/users',
      roles: '/api/roles',
      staff: '/api/staff'
    }
  });
});

// ✅ Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;

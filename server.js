require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const artworkRoutes = require('./routes/artworkRoutes');
const authRoutes = require('./routes/authRoutes');
const { startAuctionScheduler } = require('./jobs/auctionScheduler');   // NEW

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/artworks', artworkRoutes);

startAuctionScheduler();   // NEW: begin the every-minute lifecycle check

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
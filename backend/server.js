import express from 'express';
import cors from 'cors'; // Make sure to install cors package first with: npm install cors
import dotenv from "dotenv";
import userRoutes from './routes/users.js';
import { createDefaultAdmin } from './utils/CreateDefaultAdmin.js';
import { connectDB } from './config/db.js';
import bookingRoutes from './routes/bookings.js';
import artworkRoutes from "./routes/artwork.js";
import exhibitionRoutes from "./routes/exhibition.js";
import stripeRoutes from './routes/stripe.js';
dotenv.config();
const app = express();



// Enable CORS for all routes and all methods
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'], // Allow all methods
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true
}));

const PORT = process.env.PORT || 3000;

createDefaultAdmin();

app.use('/api/users', userRoutes);
app.use(express.json());//allows us to accept JSON data in the req.body
app.use("/api/products",artworkRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/exhibitions", exhibitionRoutes);
app.use('/api/stripe', stripeRoutes);
app.listen(PORT,()=>{
    connectDB();
    console.log('server started on http:127.0.0.1:' + PORT);
});

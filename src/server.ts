import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

// Configure environment variables
dotenv.config();

// Create Express server
const server = express();

// Middleware to parse body data
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Serve static files from 'public' directory
server.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.DB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

// MongoDB connection error handling
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Import routers
import userRouter from './routers/userRouter';

// Use routers
server.use('/user', userRouter);

// Start server listening on provided port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default server;

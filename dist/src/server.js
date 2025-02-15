"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
// Configure environment variables
dotenv_1.default.config();
// Create Express server
const server = (0, express_1.default)();
// Middleware to parse body data
server.use(body_parser_1.default.urlencoded({ extended: true }));
server.use(body_parser_1.default.json());
// Serve static files from 'public' directory
server.use(express_1.default.static('public'));
// Connect to MongoDB
mongoose_1.default.connect(process.env.DB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));
// MongoDB connection error handling
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// Import routers
const userRouter_1 = __importDefault(require("./routers/userRouter"));
// Use routers
server.use('/user', userRouter_1.default);
// Start server listening on provided port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
exports.default = server;
//# sourceMappingURL=server.js.map
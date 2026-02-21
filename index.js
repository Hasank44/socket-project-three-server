import express from 'express';
import 'dotenv/config';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import setRoute from './routes/routes.js';
import connectDB from './config/connectDB.js';
import http from 'http';
import { initSocket } from './config/initSocket.js';


const app = express();
const port = process.env.PORT;

const server = http.createServer(app);

// initialize socket.io
initSocket(server)
// initialize middlewares
const middlewares = [
    cors({
        origin: [process.env.FRONT_URL],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }),
    morgan("dev"),
    helmet(),
    express.json(),
    express.urlencoded({ extended: true }),
];
// use middlewares
app.use(...middlewares);

// setRoutes
setRoute(app);

app.get('/', (req, res) => {
    res.send('Hello')
});
// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Page not found" });
});
// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

server.listen(port, () => {
    try {
        console.log(`Server is running on port ${port}`);
        connectDB()
    } catch (error) {
        console.log(error.message);
    };
});
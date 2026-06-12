import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import pool from './db/db.js';
import  routesRouter from "./modules/routes/routes.router.js" 
import stopsRouter from "./modules/stops/stops.router.js"
import stopPricesRouter from "./modules/stop-prices/stop-prices.router.js"
import busesRouter from "./modules/buses/buses.router.js"

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());
app.use('/api/routes', routesRouter);
app.use('/api/stops', stopsRouter);
app.use('/api/stop-prices' , stopPricesRouter);
app.use("/api/buses" ,busesRouter)
app.get('/', (req, res) => {
  res.json({ message: 'Bus system server running' });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
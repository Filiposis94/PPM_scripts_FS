require('express-async-errors');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
const express = require('express');
const app = express();
// Connect DB
const connectDB = require('./db/connect');
const path = require('path');
// SOCKET IO
const http = require('http');
const {Server} = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin:'http://localhost:3000',
        methods: ['GET', 'POST'],
    }
});
const sockets = new Map();
// IO CONNECTION
io.on('connection', (socket)=>{
    console.log('Someone connected');
    sockets.set(socket.id, socket);

    socket.on('disconnect',()=>{
        console.log('Someone disconnected');
        sockets.delete(socket.id);
    })
});
// IMPORT ROUTER AND MIDDLEWARES
const scriptsRouter = require('./routes/scripts')
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
// Adding list of sockets to request
app.use((req, res, next)=>{
    req.sockets = sockets;
    next();
});
// SECURITY
app.set('trust proxy', 1);
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per `window` (here, per 15 minutes)
}));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(express.static(path.resolve(__dirname, '../client/build')));

// ROUTES
app.use('/api/v1/scripts', scriptsRouter);

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });

// ERROR MIDDLEWARES
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;
const start = async ()=>{
    try {      
        await connectDB(process.env.MONGO_URI)
        server.listen(port, ()=>{
            console.log(`Server listening on port ${port}...`);
        });
    } catch (error) {
        console.log(error);
    };
};
start();
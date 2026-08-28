const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const util = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const { connect_to_db } = require('./db');
const createMovieRoutes = require('./routes/MovieRoutes');
const createAuthRoutes = require('./routes/AuthRoutes');
const createReviewRoutes = require('./routes/ReviewRoutes');
const createUserRoutes = require('./routes/UserRoutes');

const port = 3100;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

const randomBytesAsync = util.promisify(crypto.randomBytes);
const pbkdf2Async = util.promisify(crypto.pbkdf2);
const jwtSignAsync = util.promisify(jwt.sign);
const jwtVerifyAsync = util.promisify(jwt.verify);
const secret = process.env.JWT_SECRET;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

(async () => {
    const db = await connect_to_db();

    const users = db.collection('users');
    const reviews = db.collection('reviews');

    async function hashPassword(password) {
      const salt = (await randomBytesAsync(16)).toString('hex');
      const hash = ( await pbkdf2Async(password, salt, 1000, 64, 'sha512')).toString('hex');
      return { salt, hash };
    }

    async function authenticateToken(password, salt, hash) {
      const derivedHash = (await pbkdf2Async(password, salt, 1000, 64, 'sha512')).toString('hex');
      return derivedHash === hash;
    }

    const jwt_protection = async (req, res, next) => {
      const token = req.headers['authorization'];
      try {
        const payload = await jwtVerifyAsync(token, secret);
        req.user = payload;
        next();
      } catch (e) {
        res.status(401).json({
          message: 'Unauthorized',
        });
      }
    };

    app.use('/api/auth', 
      createAuthRoutes(
        { users, hashPassword, authenticateToken, jwtSignAsync, secret, jwt_protection }
      ));
    app.use('/api/movies', createMovieRoutes());
    app.use('/api/reviews', createReviewRoutes({ reviews, jwt_protection, io }));
    app.use('/api/user', createUserRoutes({ users, jwt_protection }));


    io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join-movie-room', (imdbID) => {
      socket.join(`movie:${imdbID}`);
    });

    socket.on('leave-movie-room', (imdbID) => {
      socket.leave(`movie:${imdbID}`);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  server.listen(port, () => {
    console.log(`Express.js is listening at ${port}`);
  });
})();
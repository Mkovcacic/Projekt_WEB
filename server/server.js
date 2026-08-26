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

    // test da se isproba
    app.get('/api/restricted', jwt_protection, async (req, res) => {
      res.send('Confidential information');
    });

    // SIGNUP
    app.post('/api/auth/signup', async (req, res) => {
      try {
        const { name, username, email, password, favGenre } = req.body;

        if (!name || !username || !email || !password) {
          return res.status(400).json({ error: 'Nedostaju obavezni podaci' });
        }

        const existingUser = await users.findOne({ username });

        if (existingUser) {
          return res.status(400).json({ error: 'Korisnicko ime vec postoji' });
        }

        const { salt, hash } = await hashPassword(password);

        const newUser = {
          name,
          username,
          email, 
          favGenre: favGenre || '',
          salt,
          passwordHash: hash,
          createdAt: new Date()
        };

        const result = await users.insertOne(newUser);

        const exp = Math.floor(Date.now() / 1000) + (60 * 60);
        const token = await jwtSignAsync({ _id: result.insertedId, username: newUser.username, exp }, secret);
        res.status(201).json({ message: 'Korisnik uspjesno kreiran', token });
      }
      catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    // LOGIN
    app.post('/api/auth/login', async (req, res) => {
      try {
        const { username, password} = req.body;

        if (!username || !password) {
          return res.status(400).json({ message: 'Nedostaju obavezni podaci' });
        }

        const user = await users.findOne({ username });

        if (!user) {
          return res.status(401).json({ message: 'Pristup odbijen' });
        }

        const isPasswordCorrect = await authenticateToken(password, user.salt, user.passwordHash);

        if (isPasswordCorrect) {
          const exp = Math.floor(Date.now() / 1000) + (60 * 60);
          const token = await jwtSignAsync({ _id: user._id, username: user.username, exp }, secret);

          res.status(200).json({ message: 'Uspjesno logiran', token });
        } else {
          res.status(401).json({ message: 'Pristup odbijen' });
        }
      }
      catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    // VANJSKI API: OMDb search po naslovu
    app.get('/api/movies/search', async (req, res) => {
      try {
        const title = req.query.title;
        
        if (!title) {
          return res.status(400).json({ error: 'Nedostaje title parametar' });
        }
      
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${encodeURIComponent(title)}`
        );
      
        const data = await response.json();
      
        if (data.Response === 'False') {
          return res.status(404).json({ error: data.Error });
        }
      
        const result = data.Search.map((movie) => ({
          imdbId: movie.imdbID,
          title: movie.Title,
          year: movie.Year,
          type: movie.Type,
          poster: movie.Poster !== 'N/A' ? movie.Poster : '',
        }));
      
        res.json(result);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    // VANJSKI API: detalji filma po IMDb ID-u
    app.get('/api/movies/:imdbId', async (req, res) => {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${encodeURIComponent(req.params.imdbId)}&plot=short`
        );

        const movie = await response.json();

        if (movie.Response === 'False') {
          return res.status(404).json({ error: movie.Error });
        }

        res.json({
          imdbId: movie.imdbID,
          title: movie.Title,
          year: movie.Year,
          genre: movie.Genre,
          director: movie.Director,
          actors: movie.Actors,
          plot: movie.Plot,
          imdbRating: movie.imdbRating,
          poster: movie.Poster !== 'N/A' ? movie.Poster : '',
        });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    // GET sve recenzije
    app.get('/api/reviews', async (req, res) => {
      try {
        const filter = {};

        if (req.query.authorName) {
          filter.authorName = req.query.authorName;
        }

        const result = await reviews.find(filter).sort({ createdAt: -1 }).toArray();
        
        res.json(result);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    // GET recenzije za jedan film
    app.get('/api/reviews/movie/:imdbId', async (req, res) => {
      try {
        const result = await reviews
          .find({ imdbId: req.params.imdbId })
          .sort({ createdAt: -1 })
          .toArray();

        res.json(result);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    // POST nova recenzija
    app.post('/api/reviews', jwt_protection, async (req, res) => {
      try {
        const review = {
          imdbId: req.body.imdbId,
          movieTitle: req.body.movieTitle,
          movieYear: req.body.movieYear,
          moviePoster: req.body.moviePoster,
          movieGenre: req.body.movieGenre,
          imdbRating: req.body.imdbRating,
          authorId: req.user._id,
          authorName: req.user.name,
          rating: Number(req.body.rating),
          text: req.body.text,
          createdAt: new Date(),
        };

        if (!review.imdbId || !review.movieTitle || !review.authorName || !review.rating || !review.text) {
          return res.status(400).json({ error: 'Nedostaju obavezni podaci' });
        }

        const result = await reviews.insertOne(review);

        const savedReview = {
          ...review,
          _id: result.insertedId,
        };

        io.to(`movie:${review.imdbId}`).emit('review-created', savedReview);

        res.status(201).json(savedReview);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    // PUT uredi recenziju
    app.put('/api/reviews/:id', async (req, res) => {
      try {
        const id = new mongodb.ObjectId(req.params.id);

        const result = await reviews.updateOne(
          { _id: id },
          {
            $set: {
              rating: Number(req.body.rating),
              text: req.body.text,
              updatedAt: new Date(),
            },
          }
        );

        res.json(result);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    // DELETE obriši recenziju
    app.delete('/api/reviews/:id', jwt_protection, async (req, res) => {
      try {
        const id = new mongodb.ObjectId(req.params.id);
        
        // Prvo dohvati recenziju da znaš imdbId za Socket.IO emit
        const review = await reviews.findOne({ _id: id, authorId: req.user._id });
        
        if (!review) {
          return res.status(404).json({ error: 'Recenzija nije pronađena ili nemas pravo brisanja' });
        }
        
        const result = await reviews.deleteOne({ _id: id, authorId: req.user._id });

        // Emitiraj event svim klijentima u movie sobi
        io.to(`movie:${review.imdbId}`).emit('review-deleted', { 
          _id: id, 
          imdbId: review.imdbId 
        });

        res.json(result);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    // USERS - drugi entitet za bazu

    app.get('/api/users', async (req, res) => {
      try {
        const result = await users.find().toArray();
        res.json(result);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    app.post('/api/users', async (req, res) => {
      try {
        const user = {
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          favGenre: req.body.favGenre || '',
          createdAt: new Date(),
        };

        const result = await users.insertOne(user);

        res.status(201).json({ ...user, _id: result.insertedId });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    app.put('/api/users/:id', async (req, res) => {
      try {
        const id = new mongodb.ObjectId(req.params.id);

        const result = await users.updateOne(
          { _id: id },
          {
            $set: {
              name: req.body.name,
              username: req.body.username,
              email: req.body.email,
              favGenre: req.body.favGenre,
              updatedAt: new Date(),
            },
          }
        );

        res.json(result);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    app.delete('/api/users/:id', async (req, res) => {
    try {
      const id = new mongodb.ObjectId(req.params.id);
      const result = await users.deleteOne({ _id: id });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Korisnik nije pronađen' });
      }

      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

    io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join-movie-room', (imdbId) => {
      socket.join(`movie:${imdbId}`);
    });

    socket.on('leave-movie-room', (imdbId) => {
      socket.leave(`movie:${imdbId}`);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  server.listen(port, () => {
    console.log(`Express.js is listening at ${port}`);
  });
})();
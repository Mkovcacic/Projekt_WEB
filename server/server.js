const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

(async () => {
    const db = await connect_to_db();

    const users = db.collection('users');
    const reviews = db.collection('reviews');

    // VANJSKI API: OMDb search po naslovu
    app.get('/api/movies/search', async (req, res) => {
      try {
        const title = req.query.title;
        
        if (!title) {
          return res.status(400).json({
            error: 'Nedostaje title parametar',
          });
        }
      
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${encodeURIComponent(title)}`
        );
      
        const data = await response.json();
      
        if (data.Response === 'False') {
          return res.status(404).json({
            error: data.Error,
          });
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
        res.status(500).json({
          error: e.message,
        });
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
          return res.status(404).json({
            error: movie.Error,
          });
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
        res.status(500).json({
          error: e.message,
        });
      }
    });

    // GET sve recenzije
    app.get('/api/reviews', async (req, res) => {
      try {
        const result = await reviews.find().sort({ createdAt: -1 }).toArray();
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
    app.post('/api/reviews', async (req, res) => {
      try {
        const review = {
          imdbId: req.body.imdbId,
          movieTitle: req.body.movieTitle,
          movieYear: req.body.movieYear,
          moviePoster: req.body.moviePoster,
          movieGenre: req.body.movieGenre,
          imdbRating: req.body.imdbRating,
          authorName: req.body.authorName,
          rating: Number(req.body.rating),
          text: req.body.text,
          createdAt: new Date(),
        };

        if (!review.imdbId || !review.movieTitle || !review.authorName || !review.rating || !review.text) {
          return res.status(400).json({
            error: 'Nedostaju obavezni podaci',
          });
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
    app.delete('/api/reviews/:id', async (req, res) => {
      try {
        const id = new mongodb.ObjectId(req.params.id);
        const result = await reviews.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
          return res.status(404).json({
            error: 'Recenzija nije pronađena',
          });
        }

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

        res.status(201).json({
          ...user,
          _id: result.insertedId,
        });
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
        return res.status(404).json({
          error: 'Korisnik nije pronađen',
        });
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
const express = require('express');
const mongodb = require('mongodb');

function createReviewRoutes({ reviews, jwt_protection, io }) {
    const router = express.Router();

    // GET sve recenzije jednog korisnika
    router.get('/user', async (req, res) => {
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

    // GET sve recenzije za jedan film
    router.get('/movie/:imdbID', async (req, res) => {
      try {
        const result = await reviews
          .find({ imdbID: req.params.imdbID })
          .sort({ createdAt: -1 })
          .toArray();

        res.json(result);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    // POST novu recenziju
    router.post('/new', jwt_protection, async (req, res) => {
      try {
        const review = {
          imdbID: req.body.imdbID,
          authorID: req.user._id,
          authorName: req.user.username,
          rating: Number(req.body.rating),
          text: req.body.text,
          createdAt: new Date(),
        };

        if (!review.imdbID || !review.authorID || !review.authorName || !review.rating || !review.text) {
          return res.status(400).json({ error: 'Nedostaju obavezni podaci' });
        }

        const result = await reviews.insertOne(review);

        const savedReview = {
          ...review,
          _id: result.insertedId,
        };

        io.to(`movie:${review.imdbID}`).emit('review-created', savedReview);

        res.status(201).json(savedReview);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    // PUT uredi recenziju
    router.put('/update/:id', jwt_protection, async (req, res) => {
      try {
        const { id } = req.params;
        const { rating, text } = req.body;

        const result = await reviews.updateOne(
          { 
            _id: id,
            authorId: req.user._id
          },
          {
            $set: {
              rating: Number(rating),
              text: text,
              updatedAt: new Date(),
            },
          }
        );

        if (!result) {
          return res.status(404).json({
            error: 'Recenzija nije pronađena ili nemaš pravo uređivanja'
          });
        }

        io.to(`movie:${result.imdbID}`).emit('review-updated', result);
        res.json(result);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    // DELETE recenziju
    router.delete('/delete/:id', jwt_protection, async (req, res) => {
      try {
        const id = new mongodb.ObjectId(req.params.id);

        const review = await reviews.findOne({ _id: id, authorId: req.user._id });

        if (!review) {
          return res.status(404).json({ error: 'Recenzija nije pronađena ili nemas pravo brisanja' });
        }

        const result = await reviews.deleteOne({ _id: id, authorId: req.user._id });

        io.to(`movie:${review.imdbID}`).emit('review-deleted', { _id: id, imdbID: review.imdbID});

        res.json({ message: 'Recenzija uspjesno obrisana' });

      } catch (e) {
        res.status(500).json({
          error: e.message
        });
      }
    });

    return router;
}

module.exports = createReviewRoutes;
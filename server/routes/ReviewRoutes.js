const express = require('express');
const mongodb = require('mongodb');

function createReviewRoutes({ reviews, jwt_protection, io }) {
    const router = express.Router();

    // GET sve recenzije jednog korisnika
    router.get('/user/:userID', async (req, res) => {
      try {
        const userID = req.params.userID;
      
        if (!mongodb.ObjectId.isValid(userID)) {
          return res.status(400).json({ error: 'Neispravan ID korisnika' });
        }
      
        const userReviews = await reviews
          .find({ authorID:  userID})
          .sort({ createdAt: -1 })
          .toArray();
      
        res.json(userReviews);
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


    // GET za download filmova
    router.get('/download', jwt_protection, async (req, res) => {
      try {
        const userReviews = await reviews
          .find({ authorID: req.user._id })
          .sort({ createdAt: -1 })
          .toArray();
      
        const data = userReviews.map((review) => ({
          imdbID: review.imdbID,
          title: review.title,
          rating: review.rating,
          text: review.text,
          createdAt: review.createdAt
        }));
      
        res.setHeader('Content-Type', 'application/json');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename="reviews.json"'
        );
      
        res.send(JSON.stringify(data, null, 2));
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
          title: req.body.title,
          rating: Number(req.body.rating),
          text: req.body.text,
          createdAt: new Date(),
        };

        if (!review.imdbID || !review.authorID || !review.authorName || !review.title || !review.rating || !review.text) {
          return res.status(400).json({ error: 'Nedostaju obavezni podaci' });
        }

        const result = await reviews.insertOne(review);

        const savedReview = {
          ...review,
          _id: result.insertedId,
        };

        io.to(`movie:${savedReview.imdbID}`).emit('review-created', savedReview);
        io.to(`user:${savedReview.authorID}`).emit('review-created',savedReview);

        res.status(201).json(savedReview);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    // PUT uredi recenziju
    router.put('/update/:id', jwt_protection, async (req, res) => {
      try {
        const id = new mongodb.ObjectId(req.params.id);
        const { rating, text } = req.body;

        const result = await reviews.updateOne(
          { 
            _id: id,
            authorID: req.user._id
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

        const updatedReview = await reviews.findOne({ _id: id });

        io.to(`movie:${updatedReview.imdbID}`).emit('review-updated', updatedReview);
        io.to(`user:${updatedReview.authorID}`).emit('review-updated',updatedReview);

        res.json(updatedReview);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    // DELETE recenziju
    router.delete('/delete/:id', jwt_protection, async (req, res) => {
      try {
        const id = new mongodb.ObjectId(req.params.id);

        const review = await reviews.findOne({ _id: id, authorID: req.user._id });

        if (!review) {
          return res.status(404).json({ error: 'Recenzija nije pronađena ili nemas pravo brisanja' });
        }

        const result = await reviews.deleteOne({ _id: id, authorID: req.user._id });

        io.to(`movie:${review.imdbID}`).emit('review-deleted', { _id: id, imdbID: review.imdbID});
        io.to(`user:${review.authorID}`).emit('review-deleted',review);

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
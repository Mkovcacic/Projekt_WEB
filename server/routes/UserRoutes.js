const express = require('express');
const mongodb = require('mongodb');

function createUserRoutes({ users, jwt_protection }) {
    const router = express.Router();

    router.get('/me', jwt_protection, async (req, res) => {
      try {
        const user = await users.findOne({
          _id: new mongodb.ObjectId(String(req.user._id))
        });
      
        if (!user) {
          return res.status(404).json({ error: 'Korisnik nije pronađen' });
        }
      
        res.json( user );
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    router.get('/:id', async (req, res) => {
      try {
        const { id } = req.params;
      
        if (!mongodb.ObjectId.isValid(id)) {
          return res.status(400).json({ error: 'Neispravan ID korisnika' });
        }
      
        const user = await users.findOne(
          { _id: new mongodb.ObjectId(id) },
          {
            projection: {
              name: 1,
              username: 1,
              email: 1,
              favGenre: 1,
              createdAt: 1
            }
          }
        );
      
        if (!user) {
          return res.status(404).json({ error: 'Korisnik nije pronađen' });
        }
      
        res.json(user);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    router.put('/update', jwt_protection, async (req, res) => {
      try {
        const id = new mongodb.ObjectId(String(req.user._id));

        const existingUser = await users.findOne({
          username: req.body.username,
          _id: { $ne: id }
        });
      
        if (existingUser) {
          return res.status(400).json({ error: 'Korisničko ime već postoji' });
        }        
        
        const result = await users.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              name: req.body.name,
              username: req.body.username,
              email: req.body.email,
              favGenre: req.body.favGenre
            },
          },
          { returnDocument: 'after' }
        );


        console.log(result)
        res.json(result);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    router.delete('/delete', jwt_protection, async (req, res) => {
    try {
      const id = new mongodb.ObjectId(String(req.user._id));
      const result = await users.deleteOne({ _id: id });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Korisnik nije pronađen' });
      }

      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
    return router;
}

module.exports = createUserRoutes;

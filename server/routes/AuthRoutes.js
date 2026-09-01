const express = require('express');

function createAuthRoutes({
    users,
    hashPassword,
    authenticateToken,
    jwtSignAsync,
    secret,
    jwt_protection
}) {
    const router = express.Router();

    router.post('/signup', async (req, res) => {
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
        const token = await jwtSignAsync({ _id: result.insertedId, username: newUser.username, name: newUser.name, exp }, secret);
        res.status(201).json({ message: 'Korisnik uspjesno kreiran', token });
      }
      catch (e) {
        res.status(500).json({ error: e.message });
      }
    });  
    
    router.post('/login', async (req, res) => {
      try {
        const { username, password} = req.body;

        if (!username || !password) {
          return res.status(400).json({ message: 'Nedostaju obavezni podaci' });
        }

        const user = await users.findOne({ username });

        if (!user) {
          return res.status(401).json({ message: 'Krivo korisnicko ime ili lozinka' });
        }

        const isPasswordCorrect = await authenticateToken(password, user.salt, user.passwordHash);

        if (isPasswordCorrect) {

          const exp = Math.floor(Date.now() / 1000) + (60 * 60);
          const token = await jwtSignAsync({ _id: user._id, username: user.username, name: user.name, exp }, secret);
          res.status(200).json({ message: 'Uspjesno logiran', token });

        } else {
          res.status(401).json({ message: 'Pristup odbijen' });
        }
      }
      catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    return router;
}

module.exports = createAuthRoutes;
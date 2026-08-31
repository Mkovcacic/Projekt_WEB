const express = require('express');

function createMovieRoutes() {
    const router = express.Router();

    // OMDb API search po naslovu

    router.get('/search', async (req, res) => {
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
      
        res.json(data.Search);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    // OMDb API search po IMDb ID-u
    router.get('/:imdbID', async (req, res) => {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${encodeURIComponent(req.params.imdbID)}&plot=short`
        );

        const movie = await response.json();

        if (movie.Response === 'False') {
          return res.status(404).json({ error: movie.Error });
        }

        res.json(movie);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    return router;
}

module.exports = createMovieRoutes;
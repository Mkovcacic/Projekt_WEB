const express = require('express');

function createMovieRoutes() {
    const router = express.Router();

    // neka se filmovi na home stranici zadrže na 5 minuta
    let newMoviesCache = null;
    let newMoviesCacheTime = 0;
    let newMoviesPromise = null;

    const NEW_MOVIES_CACHE_DURATION = 60 * 5 * 1000;

    // TMDB API za nove filmove
    function getRandomMovies(movies, count = 15) {
      const shuffled = [...movies];
    
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    
      return shuffled.slice(0, count);
    }
    
    router.get('/new', async (req, res) => {
      try {
        const now = Date.now();
      
        if (
          newMoviesCache &&
          now - newMoviesCacheTime < NEW_MOVIES_CACHE_DURATION
        ) {
          return res.json(newMoviesCache);
        }
      
        if (newMoviesPromise) {
          const movies = await newMoviesPromise;
          return res.json(movies);
        }
      
        newMoviesPromise = (async () => {
          const requests = [];
        
          for (let page = 1; page <= 5; page++) {
            requests.push(
              fetch(
                `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`,
                {
                  headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
                    accept: 'application/json'
                  }
                }
              )
            );
          }
        
          const responses = await Promise.all(requests);
        
          for (const response of responses) {
            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.status_message || 'Greška kod dohvaćanja filmova');
            }
          }
        
          const data = await Promise.all(
            responses.map((response) => response.json())
          );
        
          const currentYear = new Date().getFullYear().toString();
        
          const movies = data
            .flatMap((page) => page.results)
            .filter((movie) =>
              movie.original_language === 'en' &&
              movie.poster_path &&
              movie.release_date &&
              movie.release_date.startsWith(currentYear)
            );
          
          const relevantMovies = movies.slice(0, 40);
          const selectedMovies = getRandomMovies(relevantMovies, 15);
          
          newMoviesCache = selectedMovies;
          newMoviesCacheTime = Date.now();
          
          return selectedMovies;
        })();
      
        const movies = await newMoviesPromise;
      
        return res.json(movies);
      } catch (e) {
        console.error('TMDB NEW MOVIES ERROR:', e);
        return res.status(500).json({ error: e.message });
      } finally {
        newMoviesPromise = null;
      }
    });

    //TMDB API za popularne filmove
    let popularMoviesCache = null;
    let popularMoviesCacheTime = 0;
    let popularMoviesPromise = null;

    const POPULAR_MOVIES_CACHE_DURATION = 60 * 1000;

    router.get('/popular', async (req, res) => {
      try {
        const now = Date.now();
      
        if (
          popularMoviesCache &&
          now - popularMoviesCacheTime < POPULAR_MOVIES_CACHE_DURATION
        ) {
          return res.json(popularMoviesCache);
        }
      
        if (popularMoviesPromise) {
          const movies = await popularMoviesPromise;
          return res.json(movies);
        }
      
        popularMoviesPromise = (async () => {
          const requests = [];
        
          for (let page = 1; page <= 5; page++) {
            requests.push(
              fetch(
                `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
                {
                  headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
                    accept: 'application/json'
                  }
                }
              )
            );
          }
        
          const responses = await Promise.all(requests);
        
          for (const response of responses) {
            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.status_message || 'Greška kod dohvaćanja popularnih filmova');
            }
          }
        
          const data = await Promise.all(
            responses.map((response) => response.json())
          );
        
          const currentYear = new Date().getFullYear().toString();
        
          const movies = data
            .flatMap((page) => page.results)
            .filter((movie) =>
              movie.original_language === 'en' &&
              movie.poster_path &&
              movie.release_date &&
              movie.release_date.startsWith(currentYear)
            );
          
          const relevantMovies = movies.slice(0, 60);
          const selectedMovies = getRandomMovies(relevantMovies, 15);
          
          popularMoviesCache = selectedMovies;
          popularMoviesCacheTime = Date.now();
          
          return selectedMovies;
        })();
      
        const movies = await popularMoviesPromise;
      
        return res.json(movies);
      } catch (e) {
        console.error('TMDB POPULAR MOVIES ERROR:', e);
        return res.status(500).json({ error: e.message });
      } finally {
        popularMoviesPromise = null;
      }
    });

    //TMDB API za top rated filmove
    let topRatedMoviesCache = null;
    let topRatedMoviesCacheTime = 0;
    let topRatedMoviesPromise = null;

    const TOP_RATED_MOVIES_CACHE_DURATION = 60 * 1000;

    router.get('/top-rated', async (req, res) => {
      try {
        const now = Date.now();
      
        if (
          topRatedMoviesCache &&
          now - topRatedMoviesCacheTime < TOP_RATED_MOVIES_CACHE_DURATION
        ) {
          return res.json(topRatedMoviesCache);
        }
      
        if (topRatedMoviesPromise) {
          const movies = await topRatedMoviesPromise;
          return res.json(movies);
        }
      
        topRatedMoviesPromise = (async () => {
          const requests = [];
        
          for (let page = 1; page <= 5; page++) {
            requests.push(
              fetch(
                `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`,
                {
                  headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
                    accept: 'application/json'
                  }
                }
              )
            );
          }
        
          const responses = await Promise.all(requests);
        
          for (const response of responses) {
            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.status_message || 'Greška kod dohvaćanja najbolje ocijenjenih filmova');
            }
          }
        
          const data = await Promise.all(
            responses.map((response) => response.json())
          );
        
          const movies = data
            .flatMap((page) => page.results)
            .filter((movie) =>
              movie.original_language === 'en' &&
              movie.poster_path &&
              movie.release_date
            );
          
          const relevantMovies = movies.slice(0, 60);
          const selectedMovies = getRandomMovies(relevantMovies, 15);
          
          topRatedMoviesCache = selectedMovies;
          topRatedMoviesCacheTime = Date.now();
          
          return selectedMovies;
        })();
      
        const movies = await topRatedMoviesPromise;
      
        return res.json(movies);
      } catch (e) {
        console.error('TMDB TOP RATED MOVIES ERROR:', e);
        return res.status(500).json({ error: e.message });
      } finally {
        topRatedMoviesPromise = null;
      }
    });
    // TMDB trazi IMDB ID

    router.get('/tmdb/:tmdbID', async (req, res) => {
      try {
        const tmdbResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${req.params.tmdbID}/external_ids`,
          {
            headers: {
              Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
              accept: 'application/json'
            }
          }
        );
      
        const ids = await tmdbResponse.json();
      
        if (!tmdbResponse.ok) {
          return res.status(tmdbResponse.status).json(ids);
        }
      
        if (!ids.imdb_id) {
          return res.status(404).json({ error: 'IMDb ID nije pronađen' });
        }
      
        const omdbResponse = await fetch(
          `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${ids.imdb_id}&plot=short`
        );
      
        const movie = await omdbResponse.json();
      
        if (movie.Response === 'False') {
          return res.status(404).json({ error: movie.Error });
        }
      
        res.json(movie);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

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
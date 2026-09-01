import MovieSection from "../components/MovieSection.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getNewMovies, getPopularMovies, getTopRatedMovies } from "../services/api.ts";
import { useEffect, useState } from "react";

function Home() {

  const [newMovies, setNewMovies] = useState<TMDBMovie[]>([])
  const [popularMovies, setPopularMovies] = useState<TMDBMovie[]>([])
  const [topRatedMovies, setTopRatedMovies] = useState<TMDBMovie[]>([])

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const [newData, popularData, topRatedData] = await Promise.all([
          getNewMovies(),
          getPopularMovies(),
          getTopRatedMovies()
        ])

        setNewMovies(newData)
        setPopularMovies(popularData)
        setTopRatedMovies(topRatedData)
      } catch (e) {
        console.error(e)
      }
    }

    loadMovies()
  }, [])

  return (
    <>
      {
      /*
        <div className="box theme-a">Theme A (initial)</div> 
        <div className="box theme-a adaptive">Theme A (changed if dark preferred)</div>
      */
      }
      <div className="container py-5">
        <MovieSection
          title="New movies"
          movies={newMovies}
        />

        <MovieSection
          title="Popular movies"
          movies={popularMovies}
        />

        <MovieSection
          title="Top rated"
          movies={topRatedMovies}
        />
      </div>
    </>
  )
}

export default Home
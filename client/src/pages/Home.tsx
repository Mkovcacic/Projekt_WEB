import MovieSection from "../components/MovieSection.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';

const movies = [
  {
  "Title": "Spider-Man: Brand New Day",
  "Year": "2026",
  "Rated": "PG-13",
  "Released": "31 Jul 2026",
  "Runtime": "145 min",
  "Genre": "Action, Adventure, Sci-Fi",
  "Director": "Destin Daniel Cretton",
  "Writer": "Chris McKenna, Erik Sommers, Stan Lee",
  "Actors": "Tom Holland, Zendaya, Mark Ruffalo",
  "Plot": "A forgotten Peter Parker lives alone as a full-time Spider-Man until mounting pressure triggers a dangerous change and a powerful new enemy emerges.",
  "Language": "English",
  "Country": "United States, Canada, United Kingdom, Germany",
  "Awards": "1 nomination total",
  "Poster": "https://m.media-amazon.com/images/M/MV5BOWNjYWM3NWItOGE0ZS00MWRjLThiZWEtYjc4ZmNmMmU5ZTVmXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
  "Ratings": [
    {
      "Source": "Internet Movie Database",
      "Value": "8.1/10"
    },
    {
      "Source": "Metacritic",
      "Value": "66/100"
    }
  ],
  "Metascore": "66",
  "imdbRating": "8.1",
  "imdbVotes": "183,571",
  "imdbID": "tt22084616",
  "Type": "movie",
  "DVD": "N/A",
  "BoxOffice": "$655,088,528",
  "Production": "N/A",
  "Website": "N/A",
  "Response": "True"
},
{
  "Title": "Snow White",
  "Year": "2025",
  "Rated": "PG",
  "Released": "21 Mar 2025",
  "Runtime": "109 min",
  "Genre": "Adventure, Family, Fantasy",
  "Director": "Marc Webb",
  "Writer": "Erin Cressida Wilson, Jacob Grimm, Wilhelm Grimm",
  "Actors": "Rachel Zegler, Emilia Faucher, Gal Gadot",
  "Plot": "A princess joins forces with seven dwarfs and a group of rebels to liberate her kingdom from her cruel stepmother the Evil Queen.",
  "Language": "English, Italian, Turkish",
  "Country": "United States",
  "Awards": "3 nominations total",
  "Poster": "https://m.media-amazon.com/images/M/MV5BY2UwOGUxMzEtMzEyZi00NjEwLTkxOTMtYTljOWEzYjYyMWNjXkEyXkFqcGc@._V1_SX300.jpg",
  "Ratings": [
    {
      "Source": "Internet Movie Database",
      "Value": "2.1/10"
    },
    {
      "Source": "Metacritic",
      "Value": "50/100"
    }
  ],
  "Metascore": "50",
  "imdbRating": "2.1",
  "imdbVotes": "389,458",
  "imdbID": "tt6208148",
  "Type": "movie",
  "DVD": "N/A",
  "BoxOffice": "$87,203,963",
  "Production": "N/A",
  "Website": "N/A",
  "Response": "True"
},
];
function Home() {

  return (
    <>
      {
      /*
        <div className="box theme-a">Theme A (initial)</div> 
        <div className="box theme-a adaptive">Theme A (changed if dark preferred)</div>
      */
      }
      <div className="container py-4">
        <MovieSection
          title="What to watch"
          movies={movies}
        />

        <MovieSection
          title="Top box office"
          movies={movies}
        />
      </div>
    </>
  )
}

export default Home
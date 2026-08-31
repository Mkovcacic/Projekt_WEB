/*import { useState } from 'react'*/
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./pages/Layout.tsx";
import { ProtectedRoute } from "./ProtectedRoutes.tsx";

import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Profile from './pages/Profile'
import MovieDetails from "./pages/MovieDetails.tsx";
import SearchResults from "./pages/SearchResults.tsx";


import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:imdbID" element={<MovieDetails />} />
          <Route path="/movie/tmdb/:tmdbID" element={<MovieDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={ <ProtectedRoute> <Profile /> </ProtectedRoute>} />
          <Route path="/search" element={<SearchResults />} />
        </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

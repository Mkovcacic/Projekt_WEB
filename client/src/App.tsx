/*import { useState } from 'react'*/
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./pages/Layout.tsx";
import MovieDetails from "./pages/MovieDetails.tsx";
import Home from "./pages/Home.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:imdbID" element={<MovieDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import { OrbitProgress } from 'react-loading-indicators'
import Background from './components/Background'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage/HomePage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import MoviePage from './pages/MoviePage/MoviePage'

export type UserProfile = {
  name: string
  username: string
  memberSince: string
  fav_genre: string
}

function App() {
  const [loading, setLoading] = useState(true)

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Marko Kovač',
    username: 'marko_k',
    memberSince: 'Član od svibnja 2026.',
    fav_genre: 'drama',
  })

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  if (loading) {
    return (
      <div className="loader">
        <OrbitProgress color="#ffffff" size="medium" />
      </div>
    )
  }

  return (
    <>
      <Background />
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:imdbId" element={<MoviePage />} />
        <Route
          path="/profile"
          element={
            <ProfilePage
              reviews={[]}
              userProfile={userProfile}
              setUserProfile={setUserProfile}
            />
          }
        />
      </Routes>
    </>
  )
}

export default App
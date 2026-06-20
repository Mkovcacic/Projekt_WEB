import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router'
import { OrbitProgress } from "react-loading-indicators"

import Background from './components/Background'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage/HomePage'
import ProfilePage from './pages/ProfilePage/ProfilePage'

export type Review = {
  id: number
  title: string
  author: string
  rating: number
  date: string
  text: string
}

export type UserProfile = {
  name: string
  username: string
  memberSince: string
  fav_genre : string
}

const initialReviews: Review[] = [
  {
    id: 1,
    title: 'Interstellar',
    author: 'Ana Kovač',
    rating: 4.5,
    date: '12. 5. 2026.',
    text: 'Odličan film, emotivan i vizualno impresivan.',
  },
  {
    id: 2,
    title: 'Breaking Bad',
    author: 'Marko Marić',
    rating: 5,
    date: '10. 5. 2026.',
    text: 'Jedna od najboljih serija koje sam gledao.',
  },
  {
    id: 3,
    title: 'The Batman',
    author: 'Ivana Horvat',
    rating: 4,
    date: '8. 5. 2026.',
    text: 'Mračna atmosfera i vrlo dobar prikaz Batmana.',
  },
]


function App() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>(initialReviews)

  const [userProfile, setUserProfile] = useState<UserProfile>({
  name: 'Marko Kovač',
  username: 'marko_k',
  memberSince: 'Član od svibnja 2026.',
  fav_genre: 'drama'
  })

  useEffect(() => {
    // simulacija učitavanja
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) {
    return (
      <div className="loader">
        <OrbitProgress 
          color={["#cfd4cf", "#979c97", "#707270", "#848684"]} 
          speedPlus={2} 
          size="medium" 
          easing="ease-in-out"
        />
      </div>
    );
  }


  function addReview(newReview: Omit<Review, 'id' | 'date'>) {
    const review: Review = {
      id: Date.now(),
      date: new Date().toLocaleDateString('hr-HR'),
      ...newReview,
    }

    setReviews((prevReviews) => [review, ...prevReviews])
  }

  return (
    <>
      <Navbar onAddReview={addReview} />

      <Routes>
        <Route path="/" element={<HomePage reviews={reviews} />} />
        <Route path="/profile" element={ <ProfilePage reviews={reviews} userProfile={userProfile} onUpdateProfile={setUserProfile}
        />} />
      </Routes>
    </>
  )
}

export default App
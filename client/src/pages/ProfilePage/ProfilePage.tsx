import { useState } from 'react'
import EditProfileModal from '../../components/EditProfileModal'
import type { Review, UserProfile } from '../../App'
import './ProfilePage.css'

type ProfilePageProps = {
  reviews: Review[]
  userProfile: UserProfile
  onUpdateProfile: (updatedProfile: UserProfile) => void
}

function ProfilePage({ reviews, userProfile, onUpdateProfile }: ProfilePageProps) {
  const currentUser = 'Ana Kovač'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const userReviews = reviews.filter(
    (review) => review.author === currentUser,
  )

  const averageRating =
    userReviews.length > 0
      ? (
          userReviews.reduce((sum, review) => sum + review.rating, 0) /
          userReviews.length
        ).toFixed(1)
      : '0.0'
  
  return (
    <main className="profile-page">
      <section className="profile-header">
        <div className="profile-avatar">AK</div>

        <div className="profile-info">
          <h1>{userProfile.name}</h1>
          <p>@{userProfile.username}</p>
          <span>{userProfile.memberSince}</span>
        </div>

        <button className="edit-profile-button"
         onClick={() => setIsEditModalOpen(true)}
         >Uredi profil</button>
      </section>

      <section className="profile-stats">
        <div className="stat-card">
          <strong>{userReviews.length}</strong>
          <span>Komentara</span>
        </div>

        <div className="stat-card">
          <strong>{averageRating}</strong>
          <span>Prosječna ocjena</span>
        </div>

        <div className="stat-card">
          <strong>Drama</strong>
          <span>Omiljeni žanr</span>
        </div>
      </section>

      <section className="profile-reviews">
        <h2>Moji komentari</h2>

        <div className="profile-review-list">
          {userReviews.length > 0 ? (
            userReviews.map((review) => (
              <article key={review.id} className="profile-review-card">
                <div className="profile-review-top">
                  <div>
                    <h3>{review.title}</h3>
                    <p>{review.date}</p>
                  </div>

                  <span>{review.rating}/5</span>
                </div>

                <p className="profile-review-text">{review.text}</p>
              </article>
            ))
          ) : (
            <p className="empty-profile-reviews">
              Još nisi objavio nijedan komentar. 😟
            </p>
          )}
        </div>
      </section>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userProfile={userProfile}
        onSave={onUpdateProfile}
      />
    </main>
  )
}

export default ProfilePage
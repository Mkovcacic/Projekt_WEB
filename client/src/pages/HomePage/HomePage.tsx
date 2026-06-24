import { useState } from 'react'
import type { Review } from '../../App'
import './HomePage.css'

type HomePageProps = {
  reviews: Review[]
}

function HomePage({ reviews }: HomePageProps) {
  const [titleFilter, setTitleFilter] = useState('')
  const [authorFilter, setAuthorFilter] = useState('')
  const [minRating, setMinRating] = useState('')
  const [maxRating, setMaxRating] = useState('')

  const filteredReviews = reviews.filter((review) => {
    const matchesTitle = review.title
      .toLowerCase()
      .includes(titleFilter.toLowerCase())

    const matchesAuthor = review.author
      .toLowerCase()
      .includes(authorFilter.toLowerCase())

    const matchesMinRating =
      minRating === '' || review.rating >= Number(minRating)

    const matchesMaxRating =
      maxRating === '' || review.rating <= Number(maxRating)

    return matchesTitle && matchesAuthor && matchesMinRating && matchesMaxRating
  })

  return (
    <main className="homepage">
      <section className="homepage-header">
        <h1>Najnoviji reviewi</h1>
        <p>
          Pregledaj komentare korisnika i pronađi preporuke za filmove i serije.
        </p>
      </section>

      <section className="review-filters">
        <input
          type="text"
          placeholder="Pretraži po naslovu"
          value={titleFilter}
          onChange={(event) => setTitleFilter(event.target.value)}
        />

        <input
          type="text"
          placeholder="Pretraži po korisniku"
          value={authorFilter}
          onChange={(event) => setAuthorFilter(event.target.value)}
        />

        <div className="rating-range">
          <input
            type="number"
            min="0"
            max="5"
            step="0.5"
            placeholder="Ocjena od"
            value={minRating}
            onChange={(event) => setMinRating(event.target.value)}
          />

          <input
            type="number"
            min="0"
            max="5"
            step="0.5"
            placeholder="Ocjena do"
            value={maxRating}
            onChange={(event) => setMaxRating(event.target.value)}
          />
        </div>
      </section>

      <section className="review-list">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <article key={review.id} className="review-card">
              <div className="review-top">
                <div>
                  <h2 className="review-title">{review.title}</h2>

                  <div className="review-meta">
                    <span>{review.author}</span>
                    <span> • </span>
                    <span>{review.date}</span>
                  </div>
                </div>

                <span className="review-rating">{review.rating}/5</span>
              </div>

              <p className="review-text">{review.text}</p>
            </article>
          ))
        ) : (
          <p className="no-reviews">
            Nema osvrta koji odgovaraju odabranim filterima.
          </p>
        )}
      </section>
    </main>
  )
}

export default HomePage
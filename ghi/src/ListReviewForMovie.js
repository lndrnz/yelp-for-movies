import React, { useState, useEffect, useRef } from 'react';
import './style.css'
import { censors } from './fun'

function ListReviewForMovie(data) {
  const [reviews, setReviews] = useState([])
  const post_data = useRef()
  const review_api = process.env.REACT_APP_REVIEWS_HOST
  post_data["imdb_id"] = data.movie.imdbID
  post_data["title"] = data.movie["Title"]

  const getMovies = async () => {

    const url = `${review_api}/api/movies/`
    const fetchConfig = {
      method: "post",
      body: JSON.stringify(post_data),
      mode: "cors",
      headers: {
        'Content-type': 'application/json',
      },
    }
    await fetch(url, fetchConfig)
  }

  const getReviews = async () => {
    const response = await fetch(`${review_api}/api/reviews/${data.movie.imdbID}/`, { mode: "cors" })
    if (response.ok) {
      const data = await response.json();
      setReviews(data)
      post_data["reviews"] = data
    }
  }



  useEffect(() => {
    getMovies()
    getReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function ReviewExists(reviews) {
    if (reviews.length === 0) {
      return (
        <>
          <div className="mt-4">
            <div className="flex-grow-1 flex-shrink-1">
              <div className="shadow p-2 mb-5 bg-white rounded">
                <div className="p-3 mb-3 mb-md-0 mr-md-3 bg-light text-black">
                  <div>No reviews for this movie yet, click 'Create A Review' to make one!</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )
    } else {
      return (

        <div className='review-box scroll' id="scrolling">
          {reviews.map((review, i) => {
            return (
              <div key={i} className='bg-white mb-4 rounded-3 border border-dark text'>
                <span className="user">{'@' + review.user.user_name}</span>
                <span className="style">{'\t'}{review.date}</span>
                {checkIfRatings(review.rating)}
                <div key={i}> {review.title}</div>
                <span>{censors(review.post)}</span>
              </div>
            )
          })}
        </div>
      )
    }

  }

  const checkIfRatings = (rating) => {
    return (
      <>
        <div className="rating-color ratings i">
          {[...Array(rating)].map((star, i) => {
            return (
              <span key={i} className="star">&#9733;</span>
            );
          })}
        </div>
      </>
    )
  }

  return (
    <div>
      {ReviewExists(reviews)}
    </div >
  )
}
export default ListReviewForMovie






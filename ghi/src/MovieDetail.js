import React, { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';


const omdbapiKey = process.env.REACT_APP_OMDB_API_KEY
const tmdbapiKey = process.env.REACT_APP_TMDB_API_KEY
const omdbURL = process.env.REACT_APP_OMDB_URL
const tmdbURL = process.env.REACT_APP_TMDB_URL

function MovieDetail() {
    const imdbID = useRef()
    const poster = useRef()
    const overview = useRef()
    const posterUrl = "https://image.tmdb.org/t/p/w220_and_h330_face"
    const { movieId } = useParams()

    const [movie, setMovie] = useState({})
    const [genres, setGenres] = useState([])
    const [ratings, setRatings] = useState([])

    const getMovieData = async () => {
        const movieResponse = await fetch(`${omdbURL}/?i=${imdbID.current}&plot=full&apikey=${omdbapiKey}`)
        if (movieResponse.ok) {
            const moviesData = await movieResponse.json()
            setMovie(moviesData)
            setGenres(moviesData.Genre.split(","))
            setRatings(moviesData.Ratings)
        }
    }

    const getImdbID = async () => {
        const imdbIdResponse = await fetch(`${tmdbURL}/movie/${movieId}?api_key=${tmdbapiKey}&language=en-US`)
        if (imdbIdResponse.ok) {
            const imdbIddata = await imdbIdResponse.json()
            imdbID.current = imdbIddata.imdb_id
            poster.current = `${posterUrl}${imdbIddata.poster_path}`
            overview.current = imdbIddata.overview
            getMovieData()
        }
    }

    useEffect(() => {
        getImdbID()
    }, [])

    const checkIfRatings = (ratings) => {
        if (ratings.length === 0) {
            return (
                <div>
                    <span className="p-2 border bg-light border-dark rounded">Ratings N/A</span>
                </div>
            )
        } else {
            return (
                <Stack direction="horizontal" gap={4}>
                    {ratings.map((rating, index) => {
                        return (
                            <div key={index}>
                                <h6>
                                    { rating.Source } <span className="p-2 text-white border border-danger bg-danger rounded">{ rating.Value }</span> {/*Might want tot consider changing the formatting of this. having a smaller width screen causes the reviews to oversect with the source name.*/}
                                </h6>
                            </div>
                        )
                    })}
                </Stack>
            )        
        }
    }

    return (
        <>
        <div className="container mt-5 pt-4 pb-4">
            <h1>{ movie.Title }</h1>
            <ul className="list-inline">
                <li className="list-inline-item">{ movie.Year } • </li>
                <li className="list-inline-item">{ movie.Rated === "N/A" ? "NR" : movie.Rated } • </li>
                <li className="list-inline-item">{ movie.Runtime }</li>
            </ul>
            <div className="row">
                <div className="col-xl-3 ">
                    <img src={ poster.current } width='275' height='auto' />
                </div>
                <div className="col-9">
                    <div>
                        {genres.map((genre, index) => {
                            return (
                            <span key={index}>
                                <Button disabled className="rounded-pill" variant="outline-dark" size="sm">{ genre }</Button>{' '}
                            </span>
                            )
                        })}
                    </div>
                    <div className="table-responsive">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td colSpan={2}>{ movie.Plot === "N/A" ? overview.current : movie.Plot  }</td>
                                </tr>
                                <tr>
                                    <th scope="row">Release date</th>
                                    <td>{ movie.Released }</td>
                                </tr>
                                <tr>
                                    <th scope="row">Language</th>
                                    <td>{ movie.Language }</td> 
                                </tr>
                                <tr>
                                    <th scope="row">Country</th>
                                    <td>{ movie.Country }</td> 
                                </tr>
                                <tr>
                                    <th scope="row">Director(s)</th>
                                    <td>{ movie.Director }</td> 
                                </tr>
                                <tr>
                                    <th scope="row">Writer(s)</th>
                                    <td>{ movie.Writer }</td> 
                                </tr>
                                <tr>
                                    <th scope="row">Main Casts</th>
                                    <td>{ movie.Actors }</td> 
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-2">
                        {checkIfRatings(ratings)}
                    </div>    
                </div>
            </div>
        </div>
        </>
    )
}

export default MovieDetail;
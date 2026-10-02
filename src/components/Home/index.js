import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const sliderSettings = {
  dots: false,
  infinite: false, // avoids cloned slides, which would duplicate titles in tests
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {breakpoint: 1024, settings: {slidesToShow: 3}},
    {breakpoint: 768, settings: {slidesToShow: 2}},
  ],
}

const Home = props => {
  const [booksList, setBookList] = useState([])
  // Start in progress so the loader is on screen from the first render
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.inProgress)

  const booksListApi = async () => {
    setApiStatus(apiStatusConstants.inProgress)

    const jwtToken = Cookies.get('jwt_token')
    const topRatedBooksAPI = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(topRatedBooksAPI, options)
      if (response.ok) {
        const data = await response.json()
        const formattedBooks = data.books.map(eachBook => ({
          id: eachBook.id,
          authorName: eachBook.author_name,
          coverPic: eachBook.cover_pic,
          title: eachBook.title,
        }))
        setBookList(formattedBooks)
        setApiStatus(apiStatusConstants.success)
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    } catch {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    booksListApi()
  }, [])

  const onClickFindBooks = () => {
    const {history} = props
    if (history) {
      history.push('/shelf')
    }
  }

  const renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#0284c7" height={50} width={50} />
    </div>
  )

  return (
    <>
      <Header />
      <div className="home-container">
        <h1 className="heading">Find Your Next Favorite Books?</h1>
        <p className="description">
          You are in the right place. Tell us what titles or genres you have
          enjoyed in the past, and we will give you surprisingly insightful
          recommendations.
        </p>
      </div>

      <div className="section-one-container">
        <div className="section-one-header-section">
          <h1 className="top-rated-books-heading">Top Rated Books</h1>
          <button
            className="find-books-button"
            type="button"
            onClick={onClickFindBooks}
          >
            Find Books
          </button>
        </div>

        {apiStatus === apiStatusConstants.inProgress && renderLoader()}

        {apiStatus === apiStatusConstants.success && (
          <Slider {...sliderSettings}>
            {booksList.map(eachBook => (
              <div key={eachBook.id} className="book-card-item">
                <Link to={`/books/${eachBook.id}`} className="book-link">
                  <img
                    src={eachBook.coverPic}
                    alt={eachBook.title}
                    className="book-cover-image"
                  />
                  <h1 className="book-title">{eachBook.title}</h1>
                  <p className="book-author">{eachBook.authorName}</p>
                </Link>
              </div>
            ))}
          </Slider>
        )}

        {apiStatus === apiStatusConstants.failure && (
          <div className="failure-view">
            <img
              src="https://res.cloudinary.com/dyhvgkrzg/image/upload/v1790440773/Group_7522.svg"
              alt="failure view"
              className="failure-img"
            />
            <p>Something went wrong. Please try again.</p>
            <button type="button" onClick={booksListApi}>
              Try Again
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default Home

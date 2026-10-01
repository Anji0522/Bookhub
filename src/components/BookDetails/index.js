import {useState, useEffect, useCallback} from 'react'
import Cookies from 'js-cookie'
import {BsFillStarFill} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const BookDetails = props => {
  const {match} = props
  const {params} = match
  const {id} = params

  const [bookDetails, setBookDetails] = useState({})
  // Start in progress so the loader is on screen from the first render
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.inProgress)

  const getBookDetails = useCallback(async () => {
    setApiStatus(apiStatusConstants.inProgress)

    const jwtToken = Cookies.get('jwt_token')
    const bookDetailsApiUrl = `https://apis.ccbp.in/book-hub/books/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(bookDetailsApiUrl, options)
      if (response.ok) {
        const data = await response.json()
        const bookData = data.book_details
        const formattedData = {
          id: bookData.id,
          title: bookData.title,
          authorName: bookData.author_name,
          readStatus: bookData.read_status,
          rating: bookData.rating,
          coverPic: bookData.cover_pic,
          aboutAuthor: bookData.about_author,
          aboutBook: bookData.about_book,
        }
        setBookDetails(formattedData)
        setApiStatus(apiStatusConstants.success)
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    } catch {
      setApiStatus(apiStatusConstants.failure)
    }
  }, [id])

  useEffect(() => {
    getBookDetails()
  }, [getBookDetails])

  const renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#0284c7" height={50} width={50} />
    </div>
  )

  const renderFailureView = () => (
    <div className="book-details-failure-view">
      <img
        src="https://res.cloudinary.com/dyhvgkrzg/image/upload/v1790440773/Group_7522.svg"
        alt="failure view"
        className="failure-img"
      />
      <p className="failure-heading">Something went wrong. Please try again.</p>
      <button type="button" className="retry-btn" onClick={getBookDetails}>
        Try Again
      </button>
    </div>
  )

  const renderSuccessView = () => {
    const {
      title,
      authorName,
      readStatus,
      rating,
      coverPic,
      aboutAuthor,
      aboutBook,
    } = bookDetails

    return (
      <div className="book-item-details-card">
        <div className="book-item-header">
          <img className="book-item-cover" src={coverPic} alt={title} />
          <div className="book-item-info">
            <h1 className="book-item-title">{title}</h1>
            <p className="book-item-author">{authorName}</p>
            <div className="rating-container">
              <p className="avg-rating">Avg Rating</p>
              <BsFillStarFill className="star-icon" />
              <p className="rating-value">{rating}</p>
            </div>
            <p className="book-status">
              Status: <span className="status-highlight">{readStatus}</span>
            </p>
          </div>
        </div>

        <hr className="divider-line" />

        <div className="about-section">
          <h2 className="about-heading">About Author</h2>
          <p className="about-description">{aboutAuthor}</p>
        </div>

        <div className="about-section">
          <h2 className="about-heading">About Book</h2>
          <p className="about-description">{aboutBook}</p>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoaderView()
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return (
    <div className="book-details-page">
      <Header />
      <div className="book-details-container">{renderContent()}</div>
      <Footer />
    </div>
  )
}

export default BookDetails

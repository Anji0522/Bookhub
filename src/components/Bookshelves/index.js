import {useState, useEffect, useCallback} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {BsFillStarFill, BsSearch} from 'react-icons/bs'
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

const Bookshelves = props => {
  const {bookshelvesList = []} = props

  const [activeShelf, setActiveShelf] = useState(
    bookshelvesList[0]?.value || 'ALL',
  )
  const [activeLabel, setActiveLabel] = useState(
    bookshelvesList[0]?.label || 'All',
  )

  const [userInput, setUserInput] = useState('')
  const [searchText, setSearchText] = useState('')
  const [shelfList, setShelfList] = useState([])
  // Start in progress so the loader is on screen from the first render
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.inProgress)

  const onClickShelf = shelf => {
    setActiveLabel(shelf.label)
    setActiveShelf(shelf.value)
  }

  const onChangeUserInput = e => {
    setUserInput(e.target.value)
  }

  const onClickSearch = () => {
    setSearchText(userInput)
  }

  const onKeyDownSearch = e => {
    if (e.key === 'Enter') setSearchText(userInput)
  }

  const bookshelvesAPICalling = useCallback(async () => {
    setApiStatus(apiStatusConstants.inProgress)

    const jwtToken = Cookies.get('jwt_token')
    const booksAPIUrl = `https://apis.ccbp.in/book-hub/books?shelf=${activeShelf}&search=${searchText}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    try {
      const response = await fetch(booksAPIUrl, options)
      if (response.ok) {
        const data = await response.json()
        const formattedData = (data.books || []).map(eachbook => ({
          id: eachbook.id,
          title: eachbook.title,
          readStatus: eachbook.read_status,
          rating: eachbook.rating,
          authorName: eachbook.author_name,
          coverPic: eachbook.cover_pic,
        }))
        setShelfList(formattedData)
        setApiStatus(apiStatusConstants.success)
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    } catch {
      setApiStatus(apiStatusConstants.failure)
    }
  }, [activeShelf, searchText])

  useEffect(() => {
    bookshelvesAPICalling()
  }, [bookshelvesAPICalling])

  const renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#0284c7" height={50} width={50} />
    </div>
  )

  return (
    <div className="bookshelves-page">
      <Header />
      <div className="bookshelves-content">
        {/* Sidebar / Top Category Bar on Mobile */}
        <div className="sidebar-container">
          <h2 className="sidebar-heading">Bookshelves</h2>
          <ul className="sidebar-list">
            {bookshelvesList.map(eachList => {
              const isActive = activeShelf === eachList.value
              return (
                <li className="list-item" key={eachList.id || eachList.value}>
                  <button
                    type="button"
                    className={`shelf-btn ${isActive ? 'active' : ''}`}
                    onClick={() => onClickShelf(eachList)}
                  >
                    {eachList.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Main Books Section */}
        <div className="books-main-container">
          <div className="books-header-container">
            <h1 className="books-main-heading">{activeLabel} Books</h1>
            <div className="search-input-container">
              <input
                onChange={onChangeUserInput}
                value={userInput}
                onKeyDown={onKeyDownSearch}
                className="search-input"
                type="search"
                placeholder="Search"
              />
              <button
                data-testid="searchButton"
                className="search-button"
                type="button"
                aria-label="search"
                onClick={onClickSearch}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
          </div>

          <div className="books-body-container">
            {apiStatus === apiStatusConstants.inProgress && renderLoader()}

            {apiStatus === apiStatusConstants.success &&
              (shelfList.length === 0 ? (
                <div className="no-books-container">
                  <img
                    src="YOUR_NO_BOOKS_IMAGE_URL"
                    alt="no books"
                    className="no-books-img"
                  />
                  <p className="no-books-text">
                    Your search for {searchText} did not find any matches.
                  </p>
                </div>
              ) : (
                <ul className="books-list">
                  {shelfList.map(eachBook => (
                    <li className="book-card-item" key={eachBook.id}>
                      <Link to={`/books/${eachBook.id}`} className="book-link">
                        <div className="book-card">
                          <img
                            className="book-cover-img"
                            src={eachBook.coverPic}
                            alt={eachBook.title}
                          />
                          <div className="book-details">
                            <h2 className="book-title">{eachBook.title}</h2>
                            <p className="book-author">{eachBook.authorName}</p>
                            <div className="rating-container">
                              <p className="avg-rating">Avg Rating</p>
                              <BsFillStarFill className="star-icon" />
                              <p className="rating-value">{eachBook.rating}</p>
                            </div>
                            <p className="book-status">
                              Status:{' '}
                              <span className="status-highlight">
                                {eachBook.readStatus}
                              </span>
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}

            {apiStatus === apiStatusConstants.failure && (
              <div className="failure-view">
                <img
                  src="https://res.cloudinary.com/dkxxgpfd8/image/upload/v1647250727/Screenshot_30_u2uxsq.png"
                  alt="failure view"
                  className="failure-img"
                />
                <p className="failure-heading">
                  Something went wrong. Please try again.
                </p>
                <button
                  type="button"
                  className="retry-btn"
                  onClick={bookshelvesAPICalling}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Bookshelves

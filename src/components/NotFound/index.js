import {Link} from 'react-router-dom'

import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="YOUR_NOT_FOUND_IMAGE_URL"
      alt="not found"
      className="not-found-img"
    />
    <h1 className="not-found-heading">Page Not Found</h1>
    <p className="not-found-text">
      we are sorry, the page you requested could not be found
    </p>
    <Link to="/">
      <button type="button" className="go-home-btn">
        Go Back to Home
      </button>
    </Link>
  </div>
)

export default NotFound

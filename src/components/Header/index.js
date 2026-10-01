import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  const {location} = props
  const currentPath = location.pathname

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="link-item">
          <div className="logo-container">
            <img
              className="website-logo"
              src="https://res.cloudinary.com/dyhvgkrzg/image/upload/v1790166887/Group_7730.svg"
              alt="website logo"
            />
            <span className="website-logo-heading">ook Hub</span>
          </div>
        </Link>

        <ul className="nav-menu">
          <li className="nav-menu-item">
            <Link
              to="/"
              className={`nav-link ${currentPath === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li className="nav-menu-item">
            <Link
              to="/shelf"
              className={`nav-link ${currentPath === '/shelf' ? 'active' : ''}`}
            >
              Bookshelves
            </Link>
          </li>
          <li className="nav-menu-item">
            <button
              className="logout-button"
              type="button"
              onClick={onClickLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default withRouter(Header)

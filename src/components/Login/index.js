import {useState} from 'react'
import Cookies from 'js-cookie'
import {useHistory, Redirect} from 'react-router-dom'

import './index.css'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [errorMsgStatus, setErrorMsgStatus] = useState(false)

  const history = useHistory()

  // Redirect to home if user is already authenticated
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken !== undefined) {
    return <Redirect to="/" />
  }

  const onSubmitSuccess = token => {
    Cookies.set('jwt_token', token, {expires: 30})
    history.replace('/')
  }

  const onSubmitFailure = errormsg => {
    setErrorMsgStatus(true)
    setErrorMsg(errormsg)
  }

  const onSubmitLogin = async e => {
    e.preventDefault()

    const userDetails = {username, password}
    const loginApiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    try {
      const response = await fetch(loginApiUrl, options)
      const data = await response.json()

      if (response.ok) {
        onSubmitSuccess(data.jwt_token)
      } else {
        onSubmitFailure(data.error_msg)
      }
    } catch {
      onSubmitFailure('Something went wrong. Please try again.')
    }
  }

  const onChangeUsername = e => {
    setUsername(e.target.value)
  }

  const onChangePassword = e => {
    setPassword(e.target.value)
  }

  return (
    <div className="main-container">
      <div className="image-container">
        <img
          className="image"
          src="https://res.cloudinary.com/dyhvgkrzg/image/upload/v1789978211/148a5aab95408b437734c2edd58cd7fa89715e06.jpg"
          alt="website login"
        />
      </div>
      <div className="input-container">
        <div className="website-logo-container">
          <img
            className="website-logo"
            src="https://res.cloudinary.com/dyhvgkrzg/image/upload/v1790166887/Group_7730.svg"
            alt="login website logo"
          />
          <h1 className="heading">ook Hub!</h1>
        </div>
        <form className="from-container" onSubmit={onSubmitLogin}>
          <div className="username-container">
            <label className="username-label" htmlFor="username">
              Username*
            </label>
            <input
              className="username-input"
              onChange={onChangeUsername}
              value={username}
              id="username"
              type="text"
              placeholder="Enter Username"
            />
          </div>
          <div className="password-container">
            <label className="password-label" htmlFor="password">
              Password*
            </label>
            <input
              className="password-input"
              onChange={onChangePassword}
              value={password}
              id="password"
              type="password"
              placeholder="Enter Password"
            />
          </div>
          <button className="login-button" type="submit">
            Login
          </button>
          {errorMsgStatus && <p className="error-msg">*{errorMsg}</p>}
        </form>
      </div>
    </div>
  )
}

export default Login

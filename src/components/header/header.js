import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Image } from 'antd'

import { setIsLogOutTrue } from '../../redux/service-slice'

import './header.scss'

export const Header = () => {
  const dispatch = useDispatch()
  const service = useSelector((state) => state.service)
  const unauthorized = (
    <div className="authorization">
      <Link to="/sign-in" className="authorization-sign-in">
        Sign In
      </Link>
      <Link to="/sign-up" className="authorization-sign-up">
        Sign Up
      </Link>
    </div>
  )

  const authorized = (
    <div className="logged">
      <Link to="/new-article" className="logged-taskbutton">
        Create article
      </Link>
      <div className="logged-wrapper">
        <Link to="/profile" className="logged-link">
          <div className="logged-user">
            <span className="logged-username">{service.user.username}</span>
            <Image
              className="logged-avatar-wrapper"
              width={46}
              height={46}
              fallback="https://static.productionready.io/images/smiley-cyrus.jpg"
              src={service.user.image}
              preview={false}
            />
          </div>
        </Link>
        <button onClick={() => dispatch(setIsLogOutTrue())} className="logged-log-out-btn">
          Log Out
        </button>
      </div>
    </div>
  )

  return (
    <header className="header">
      <div className="header-wrapper">
        <Link to="/" className="header-title">
          Realworld Blog
        </Link>
        {service.user.token !== undefined && !service.isUserLoadError ? authorized : unauthorized}
      </div>
    </header>
  )
}

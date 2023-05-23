import { Navigate, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from 'antd'

import { Articles } from '../articles/articles'
import { Header } from '../header/header'
import { ModalSignIn } from '../modals/modal-sign-in/modal-sign-in'
import { ModalSignUp } from '../modals/modal-sign-up/modal-sign-up'
import { ModalEditProfile } from '../modals/modal-edit-profile/modal-edit-profile'
import { clearLoadUserFail, clearUser, setIsLogOutFalse } from '../../redux/service-slice'
import { getUser } from '../../service/users-service'
import { ModalCreateArticle } from '../modals/modal-create-article/modal-create-article'
import { ModalEditArticle } from '../modals/modal-edit-article/modal-edit-article'

import './App.scss'

const ProtectedRoute = ({ user, children }) => {
  if (user.token === undefined) {
    return <Navigate to="/" replace />
  }
  return children
}

const App = () => {
  const service = useSelector((state) => state.service)
  const dispatch = useDispatch()

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      dispatch(getUser(localStorage.getItem('token')))
    }
  }, [dispatch])

  useEffect(() => {
    if (localStorage.getItem('token') === null && service.user.token !== undefined && !service.isLogOut) {
      localStorage.setItem('token', service.user.token)
    } else if (localStorage.getItem('token') !== null && service.isLogOut) {
      localStorage.removeItem('token')
      dispatch(setIsLogOutFalse())
      dispatch(clearUser())
    } else if (service.isLogOut) {
      dispatch(setIsLogOutFalse())
    }
  }, [service.isLogOut, service.user, dispatch])

  const routes = [
    {
      element: <Articles />,
      path: '/',
    },
    {
      element: <Articles />,
      path: '/articles',
    },
    {
      element: <Articles />,
      path: '/articles/:slug',
    },
    {
      element: (
        <ProtectedRoute user={service.user}>
          <ModalEditArticle />
        </ProtectedRoute>
      ),
      path: '/articles/:slug/edit',
    },
    {
      element: <ModalSignIn />,
      path: '/sign-in',
    },
    {
      element: <ModalSignUp />,
      path: '/sign-up',
    },
    {
      element: (
        <ProtectedRoute user={service.user}>
          <ModalEditProfile />
        </ProtectedRoute>
      ),
      path: '/profile',
    },
    {
      element: (
        <ProtectedRoute user={service.user}>
          <ModalCreateArticle />
        </ProtectedRoute>
      ),
      path: '/new-article',
    },
    {
      element: <Navigate to="/" replace />,
      path: '*',
    },
  ]

  return (
    <>
      <Header />
      <main className="main">
        {service.isUserLoadError && (
          <Alert
            message="Error"
            description="Failed to load user, try again later."
            type="error"
            className="alert"
            afterClose={() => {
              dispatch(clearLoadUserFail())
            }}
            closable
            showIcon
          />
        )}
        <Routes>
          {routes.map((routData, i) => {
            return <Route key={i} path={routData.path} element={routData.element} />
          })}
        </Routes>
      </main>
    </>
  )
}

export default App

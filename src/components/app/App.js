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
          <Route path="/" element={<Articles />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<Articles />} />
          <Route
            path="/articles/:slug/edit"
            element={
              <ProtectedRoute user={service.user}>
                <ModalEditArticle />
              </ProtectedRoute>
            }
          />
          <Route path="/sign-in" element={<ModalSignIn />} />
          <Route path="/sign-up" element={<ModalSignUp />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={service.user}>
                <ModalEditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-article"
            element={
              <ProtectedRoute user={service.user}>
                <ModalCreateArticle />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default App

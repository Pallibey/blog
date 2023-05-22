import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'

import { postUser } from '../../../service/users-service'
import { clearInvalidData, clearLoadFail } from '../../../redux/service-slice'

import '../modal-form.scss'
import './modal-sign-in.scss'

export const ModalSignIn = () => {
  const service = useSelector((state) => state.service)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    register,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
  })

  useEffect(() => {
    return () => {
      dispatch(clearInvalidData())
      dispatch(clearLoadFail())
    }
  }, [dispatch])

  useEffect(() => {
    if (service.user.token !== undefined) {
      navigate('/')
    }
  }, [service.user, navigate])

  useEffect(() => {
    if (service.isInvalidData !== null) {
      const formError = {
        type: 'server',
        message: 'Username or Password Incorrect',
      }
      setError('password', formError)
      setError('email', formError)
    }
  }, [service.isInvalidData, setError])

  const onSubmit = (data) => {
    dispatch(postUser(data.email, data.password))
  }

  return (
    <div className="modal-form-wrapper">
      <form name="sign-in" className="modal-form" onSubmit={handleSubmit(onSubmit)}>
        <span className="modal-form-title">Sign In</span>
        <label>
          <p className="modal-form-about-text">Email address</p>
          <input
            className={`modal-form-input ${errors?.email && 'modal-form-input-error'}`}
            placeholder="Email address"
            {...register('email', {
              required: 'The field must be filled in',
              pattern: {
                value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                message: 'Write the email correctly',
              },
            })}
          />
          {errors?.email && <p className="modal-form-text-error">{errors.email.message}</p>}
        </label>
        <label>
          <p className="modal-form-about-text">Password</p>
          <input
            className={`modal-form-input ${errors?.password && 'modal-form-input-error'}`}
            type="password"
            placeholder="Password"
            {...register('password', {
              required: 'The field must be filled in',
              minLength: {
                value: 6,
                message: 'Your password needs to be at least 6 characters',
              },
            })}
          />
          {errors?.password && <p className="modal-form-text-error">{errors.password.message}</p>}
        </label>

        {errors?.server && <p className="modal-form-text-error">{errors.server.message}</p>}
        {service.isError && <p className="modal-form-text-error">Error sending the request, try again later</p>}
        <div className="modal-form-submit-wrapper">
          <button type="submit" className="modal-form-btn" disabled={service.isLoading}>
            Login
          </button>
          <p className="sign-in-no-account-text">
            Don’t have an account?{' '}
            <Link className="sign-in-no-account-link" to="/sign-up">
              Sign Up.
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

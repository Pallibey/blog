import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'

import { postNewUser } from '../../../service/users-service'
import { clearInvalidData, clearLoadFail } from '../../../redux/service-slice'

import '../modal-form.scss'
import './modal-sign-up.scss'

export const ModalSignUp = () => {
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
    if (service.isInvalidData !== null) {
      Object.keys(service.isInvalidData.errors).forEach((key) => {
        setError(String(key), {
          type: 'server',
          message: service.isInvalidData.errors[key],
        })
      })
    }
  }, [service.isInvalidData, setError])

  useEffect(() => {
    if (service.user.token !== undefined) {
      navigate('/')
    }
  }, [service.user, navigate])

  const onSubmit = (data) => {
    dispatch(postNewUser(data.username, data.email, data.password))
  }

  return (
    <div className="modal-form-wrapper">
      <form name="sign-up" className="modal-form" onSubmit={handleSubmit(onSubmit)}>
        <span className="modal-form-title">Create new account</span>
        <label>
          <p className="modal-form-about-text">Username</p>
          <input
            className={`modal-form-input ${errors?.username && 'modal-form-input-error'}`}
            placeholder="Username"
            {...register('username', {
              required: 'The field must be filled in',
              minLength: {
                value: 3,
                message: 'The username must contain from 3 to 20 characters',
              },
              maxLength: {
                value: 20,
                message: 'The username must contain from 3 to 20 characters',
              },
              pattern: {
                value: /^[a-z][a-z0-9]*$/,
                message: 'You can only use lowercase English letters and numbers',
              },
            })}
          />
          {errors?.username && <p className="modal-form-text-error">{errors.username.message}</p>}
        </label>
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
        <label>
          <p className="modal-form-about-text">Repeat Password</p>
          <input
            className={`modal-form-input ${errors?.repeatPassword && 'modal-form-input-error'}`}
            type="password"
            placeholder="Repeat Password"
            {...register('repeatPassword', {
              required: 'The field must be filled in',
              validate: (value, formValues) => {
                if (formValues.password === value) {
                  return true
                }
                return 'Passwords must match'
              },
            })}
          />
          {errors?.repeatPassword && <p className="modal-form-text-error">{errors.repeatPassword.message}</p>}
        </label>
        <div>
          <label>
            <input
              className={`sign-up-checkbox ${errors?.checkbox && 'sign-up-checkbox-error'}`}
              type="checkbox"
              {...register('checkbox', {
                required: 'The checkbox must be marked',
              })}
            />
            <p>I agree to the processing of my personal information</p>
            {errors?.checkbox && <p className="modal-form-text-error">{errors.checkbox.message}</p>}
          </label>
        </div>
        {service.isError && <p className="modal-form-text-error">Error sending the request, try again later</p>}
        <div className="modal-form-submit-wrapper">
          <button type="submit" className="modal-form-btn" disabled={service.isLoading}>
            Create
          </button>
          <p className="sign-in-no-account-text">
            Already have an account?{' '}
            <Link className="sign-in-no-account-link" to="/sign-in">
              Sign In.
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

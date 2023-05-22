import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'

import { putUpdateUser } from '../../../service/users-service'
import { clearInvalidData, clearLoadFail, setIsUserUpdateFalse } from '../../../redux/service-slice'

import '../modal-form.scss'
import './modal-edit-profile.scss'

export const ModalEditProfile = () => {
  const service = useSelector((state) => state.service)
  const dispatch = useDispatch()
  const {
    register,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      username: service.user.username,
      email: service.user.email,
      image: service.user.image,
    },
  })

  useEffect(() => {
    return () => {
      dispatch(clearInvalidData())
      dispatch(setIsUserUpdateFalse())
      dispatch(clearLoadFail())
    }
  }, [dispatch])

  useEffect(() => {
    if (service.isInvalidData !== null) {
      Object.keys(service.isInvalidData.errors).forEach((key) => {
        if (key === 'info') {
          const formError = {
            type: 'server',
            message: 'The data has not been changed',
          }
          setError('username', formError)
          setError('email', formError)
          setError('newPassword', formError)
          setError('image', formError)
        } else {
          setError(String(key), {
            type: 'server',
            message: `${key} ${service.isInvalidData.errors[key]}`,
          })
        }
      })
    }
  }, [service.isInvalidData, setError])

  const onSubmit = (data) => {
    dispatch(putUpdateUser(data.username, data.email, data.newPassword, data.image, service.user))
  }

  return (
    <div className="modal-form-wrapper">
      <form name="edit-profile" className="modal-form" onSubmit={handleSubmit(onSubmit)}>
        <span className="modal-form-title">Edit Profile</span>
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
          {errors?.username && errors.username.message !== 'The data has not been changed' && (
            <p className="modal-form-text-error">{errors.username.message}</p>
          )}
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
          {errors?.email && errors.email.message !== 'The data has not been changed' && (
            <p className="modal-form-text-error">{errors.email.message}</p>
          )}
        </label>
        <label>
          <p className="modal-form-about-text">New password</p>
          <input
            className={`modal-form-input ${errors?.newPassword && 'modal-form-input-error'}`}
            placeholder="New password"
            {...register('newPassword', {
              minLength: {
                value: 6,
                message: 'Your password needs to be at least 6 characters',
              },
            })}
          />
          {errors?.newPassword && errors.newPassword.message !== 'The data has not been changed' && (
            <p className="modal-form-text-error">{errors.newPassword.message}</p>
          )}
        </label>
        <label>
          <p className="modal-form-about-text">Avatar image (url)</p>
          <input
            className={`modal-form-input ${errors?.image && 'modal-form-input-error'}`}
            placeholder="Avatar image"
            {...register('image', {
              pattern: {
                value:
                  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/,
                message: 'Write the url correctly',
              },
            })}
          />
          {errors?.image && errors.image.message !== 'The data has not been changed' && (
            <p className="modal-form-text-error">{errors.image.message}</p>
          )}
        </label>
        {errors?.username && errors.username.message === 'The data has not been changed' && (
          <p className="modal-form-text-error">{errors.username.message}</p>
        )}
        {service.isUserUpdate ? <p className="modal-edit-profile-success">Data updated!</p> : null}
        {service.isError && <p className="modal-form-text-error">Error sending the request, try again later</p>}
        <div className="modal-form-submit-wrapper">
          <button type="submit" className="modal-form-btn" disabled={service.isLoading}>
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

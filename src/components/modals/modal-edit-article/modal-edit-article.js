import React, { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { putUpdateArticle } from '../../../service/articles-service'
import { clearInvalidData, clearLoadFail, setIsArticleChangeFalse } from '../../../redux/service-slice'

import '../modal-form.scss'
import './modal-edit-article.scss'

export const ModalEditArticle = () => {
  const service = useSelector((state) => state.service)
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const tags =
    service.oneArticle.tagList !== undefined
      ? service.oneArticle.tagList.map((tag) => {
          return { value: tag }
        })
      : [{ value: '' }]
  const {
    register,
    setError,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      title: service.oneArticle.title,
      description: service.oneArticle.description,
      textField: service.oneArticle.body,
      tags,
    },
  })
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'tags',
  })

  useEffect(() => {
    return () => {
      dispatch(clearInvalidData())
      dispatch(clearLoadFail())
    }
  }, [dispatch])

  useEffect(() => {
    if (service.isInvalidData !== null) {
      const formError = {
        type: 'server',
        message: 'The data has not been changed',
      }
      setError('title', formError)
      setError('description', formError)
      setError('textField', formError)
      dispatch(clearInvalidData())
    }
  }, [service.isInvalidData, setError])

  useEffect(() => {
    if (service.oneArticle.slug === undefined) {
      navigate(`/articles/${slug}`)
    }
  }, [service.oneArticle, slug, navigate])

  useEffect(() => {
    if (service.isArticleChange === true) {
      dispatch(setIsArticleChangeFalse())
      navigate(`/articles/${service.oneArticle.slug}`)
    }
  }, [service, navigate, dispatch])

  const onSubmit = (data) => {
    dispatch(
      putUpdateArticle(
        data.title,
        data.description,
        data.textField,
        data.tags,
        service.oneArticle,
        slug,
        service.user.token
      )
    )
  }

  return (
    <div className="modal-form-wrapper">
      <form name="create-post" className="modal-form create-post-form" onSubmit={handleSubmit(onSubmit)}>
        <span className="modal-form-title">Edit Article</span>
        <label>
          <p className="modal-form-about-text">Title</p>
          <input
            className={`modal-form-input ${errors?.title && 'modal-form-input-error'}`}
            placeholder="Title"
            {...register('title', {
              required: 'The field must be filled in',
              maxLength: {
                value: 5000,
                message: 'Maximum title length: 5000 characters',
              },
            })}
          />
          {errors?.title && errors.title.type !== 'server' && (
            <p className="modal-form-text-error">{errors.title.message}</p>
          )}
        </label>
        <label>
          <p className="modal-form-about-text">Short description</p>
          <input
            className={`modal-form-input ${errors?.description && 'modal-form-input-error'}`}
            placeholder="Description"
            {...register('description', {
              required: 'The field must be filled in',
            })}
          />
          {errors?.description && errors.description.type !== 'server' && (
            <p className="modal-form-text-error">{errors.description.message}</p>
          )}
        </label>
        <label>
          <p className="modal-form-about-text">Text</p>
          <textarea
            className={`modal-form-input modal-form-textarea ${errors?.textField && 'modal-form-input-error'}`}
            rows={10}
            placeholder="Text"
            {...register('textField', {
              required: 'The field must be filled in',
            })}
          />
          {errors?.textField && errors.textField.type !== 'server' && (
            <p className="modal-form-text-error">{errors.textField.message}</p>
          )}
        </label>
        <div className="create-post-tags-wrapper">
          <p className="modal-form-about-text">
            Tags <span className="create-post-tags-warning">(empty tags are not sent to the server)</span>
          </p>
          {fields.map((tag, i) => (
            <div key={tag.id} className="create-post-tag-wrapper">
              <input
                className={`modal-form-input create-post-tag-input ${
                  errors?.textField && errors.title.type === 'server' && 'modal-form-input-error'
                }`}
                placeholder="Tag"
                {...register(`tags.${i}.value`)}
              />
              {fields.length !== 1 && (
                <button
                  className="create-post-delete-tag-btn"
                  onClick={() => {
                    remove(i)
                  }}
                >
                  Delete
                </button>
              )}
              {i === fields.length - 1 && (
                <button
                  className="create-post-add-tag-btn"
                  onClick={() => {
                    append({ value: '' })
                  }}
                >
                  Add tag
                </button>
              )}
            </div>
          ))}
        </div>
        {errors?.textField && errors.textField.type === 'server' && (
          <p className="modal-form-text-error">{errors.textField.message}</p>
        )}
        {service.isError && <p className="modal-form-text-error">Error sending the request, try again later</p>}
        <div className="create-post-submit-wrapper">
          <button type="submit" className="modal-form-btn" disabled={service.isLoading}>
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

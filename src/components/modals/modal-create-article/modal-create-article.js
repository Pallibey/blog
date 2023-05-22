import React, { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { clearLoadFail, setIsArticleChangeFalse } from '../../../redux/service-slice'
import { postCreateArticle } from '../../../service/articles-service'

import '../modal-form.scss'
import './modal-create-article.scss'

export const ModalCreateArticle = () => {
  const service = useSelector((state) => state.service)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      tags: [{ value: '' }],
    },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  })

  useEffect(() => {
    return () => {
      dispatch(clearLoadFail())
    }
  }, [dispatch])

  useEffect(() => {
    if (service.isArticleChange === true) {
      dispatch(setIsArticleChangeFalse())
      navigate(`/articles/${service.oneArticle.slug}`)
    }
  }, [service, navigate, dispatch])

  const onSubmit = (data) => {
    console.log(data)
    dispatch(postCreateArticle(data, service.user.token))
  }

  return (
    <div className="modal-form-wrapper">
      <form name="create-post" className="modal-form create-post-form" onSubmit={handleSubmit(onSubmit)}>
        <span className="modal-form-title">Create New Article</span>
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
          {errors?.title && <p className="modal-form-text-error">{errors.title.message}</p>}
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
          {errors?.description && <p className="modal-form-text-error">{errors.description.message}</p>}
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
          {errors?.textField && <p className="modal-form-text-error">{errors.textField.message}</p>}
        </label>
        <div className="create-post-tags-wrapper">
          <p className="modal-form-about-text">
            Tags <span className="create-post-tags-warning">(empty tags are not sent to the server)</span>
          </p>
          {fields.map((tag, i) => (
            <div key={tag.id} className="create-post-tag-wrapper">
              <input
                className="modal-form-input create-post-tag-input"
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

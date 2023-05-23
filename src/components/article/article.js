import { React, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Image, Popconfirm } from 'antd'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import format from 'date-fns/format'
import enGB from 'date-fns/locale/en-GB'
import { useDispatch, useSelector } from 'react-redux'

import { deleteArticle, deleteLike, postAddLike } from '../../service/articles-service'
import { setIsArticleChangeFalse } from '../../redux/service-slice'
import redHeart from '../../assets/red-heart.svg'
import heart from '../../assets/heart.svg'

import './article.scss'

export const Article = ({ isOpen, data }) => {
  const { slug, title, description, body, author, createdAt, favorited, favoritesCount, tagList } = data
  const service = useSelector((state) => state.service)
  const userInfo = service.user
  const [likesCount, setLikesCount] = useState()
  const [isLiked, setIsLiked] = useState()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    setLikesCount(favoritesCount)
    setIsLiked(favorited)
  }, [favorited, favoritesCount])

  useEffect(() => {
    if (service.isArticleChange === true) {
      dispatch(setIsArticleChangeFalse())
      navigate('/')
    }
  }, [service, navigate, dispatch])

  const renderTags = (tags) => {
    const render = []
    for (let i = 0; i < 5; i++) {
      if (tags[i] !== undefined) {
        render.push(
          <button key={tags[i] + i} className="article-tag">
            {tags[i]}
          </button>
        )
      }
    }
    return render
  }

  const formatDate = (date) => {
    if (typeof date === 'string') {
      try {
        return format(new Date(date), 'MMMM dd, yyyy', { locale: enGB })
      } catch {
        return date
      }
    } else {
      return null
    }
  }

  const onConfirmDelete = () => {
    dispatch(deleteArticle(slug, userInfo.token))
  }

  return (
    <li className="article-item">
      <article className="article">
        <div className="article-header">
          <div className="article-wrapper-content">
            <div className="article-wrapper-title">
              <Link to={`/articles/${slug}`} className="article-link">
                {title}
              </Link>
              <button
                className="article-likes"
                onClick={() => {
                  if (isLiked) {
                    dispatch(deleteLike(slug, userInfo.token))
                    setLikesCount(likesCount - 1)
                    setIsLiked(false)
                  } else if (!isLiked && userInfo.token !== undefined) {
                    dispatch(postAddLike(slug, userInfo.token))
                    setLikesCount(likesCount + 1)
                    setIsLiked(true)
                  } else {
                    navigate('/sign-in')
                  }
                }}
              >
                {isLiked ? <img src={redHeart} alt="Like is set" /> : <img src={heart} alt="Like is not set" />}
                <span>{likesCount}</span>
              </button>
            </div>
            <div className="article-tags">
              {renderTags(tagList)}
              {isOpen && tagList[6] !== undefined ? (
                <button className="article-show-tags-btn">Смотреть все...</button>
              ) : null}
            </div>
            <p style={isOpen ? { marginBottom: 20, marginTop: 20 } : {}} className="article-decription">
              {description}
            </p>
          </div>
          <div>
            <div className="article-wrapper-user">
              <div className="article-user-info">
                <p className="username">{author.username}</p>
                <p className="date">{formatDate(createdAt)}</p>
              </div>
              <Image
                className="article-avatar-wrapper"
                width={46}
                height={46}
                src={author.image}
                preview={false}
                fallback="https://static.productionready.io/images/smiley-cyrus.jpg"
              />
            </div>
            {userInfo.username === author.username && isOpen ? (
              <>
                <Popconfirm
                  placement="bottomLeft"
                  title={'Are you sure to delete this article?'}
                  onConfirm={onConfirmDelete}
                  okText="Yes"
                  cancelText="No"
                >
                  <button className="article-btn article-btn-delete">Delete</button>
                </Popconfirm>

                <Link to={`/articles/${slug}/edit`} className="article-btn article-btn-edit">
                  Edit
                </Link>
              </>
            ) : null}
          </div>
        </div>
        <div>
          {isOpen ? (
            <ReactMarkdown className="article-text" remarkPlugins={[remarkGfm]}>
              {body}
            </ReactMarkdown>
          ) : null}
        </div>
      </article>
    </li>
  )
}

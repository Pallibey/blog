import React, { useEffect, useState } from 'react'
import { Pagination } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { Article } from '../article/article'
import { getArticles, getOneArticle } from '../../service/articles-service'
import ErrorMsg from '../error-msg/error-msg'
import LoadingIndicator from '../loading-indicator/loading-indicator'
import { clearLoadFail } from '../../redux/service-slice'

import './articles.scss'

export const Articles = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const dispatch = useDispatch()
  const { allArticles: data, oneArticle, user, isError, isLoading } = useSelector((state) => state.service)
  const { slug } = useParams()

  useEffect(() => {
    return () => {
      dispatch(clearLoadFail())
    }
  }, [dispatch])

  useEffect(() => {
    if (slug !== undefined) {
      if (user.token !== undefined) {
        dispatch(getOneArticle(slug, user.token))
      } else {
        dispatch(getOneArticle(slug))
      }
    } else if (user.token !== undefined) {
      dispatch(getArticles(currentPage, user.token))
    } else {
      dispatch(getArticles(currentPage))
    }
  }, [currentPage, user, slug, dispatch])

  if (isError) {
    return <ErrorMsg />
  }
  if (isLoading) {
    return <LoadingIndicator />
  }

  if (slug !== undefined && oneArticle.slug !== undefined) {
    return <Article key={slug} data={oneArticle} isOpen={true} />
  }

  return (
    <>
      <ul className="articles">
        {Array.isArray(data.articles) && slug === undefined
          ? data.articles.map((article) => {
              return <Article key={article.slug} data={article} />
            })
          : null}
      </ul>
      <Pagination
        total={data.articlesCount}
        current={currentPage}
        pageSize={20}
        responsive
        className="pagination"
        showSizeChanger={false}
        onChange={(page) => {
          setCurrentPage(page)
        }}
      />
    </>
  )
}

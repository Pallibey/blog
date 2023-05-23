import {
  loading,
  loadArticlesSuccess,
  loadFail,
  loadOneArticleSuccess,
  loadInvalidData,
  setIsArticleChangeTrue,
} from '../redux/service-slice'

const baseURL = new URL('https://blog.kata.academy')

export const getArticles = (page, token) => async (dispatch) => {
  try {
    const skip = (page - 1) * 20
    dispatch(loading())
    const link = new URL('/api/articles', baseURL)
    link.searchParams.set('offset', skip)
    const res = await fetch(link, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    if (!res.ok) {
      throw new Error()
    }
    const body = await res.json()
    dispatch(loadArticlesSuccess(body))
  } catch (err) {
    dispatch(loadFail())
  }
}

export const getOneArticle = (slug, token) => async (dispatch) => {
  try {
    dispatch(loading())
    const link = new URL(`/api/articles/${slug}`, baseURL)
    const res = await fetch(link, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    if (!res.ok) {
      throw new Error()
    } else {
      const body = await res.json()
      dispatch(loadOneArticleSuccess(body.article))
    }
  } catch (err) {
    dispatch(loadFail())
  }
}

export const postAddLike = (slug, token) => async (dispatch) => {
  try {
    const link = new URL(`/api/articles/${slug}/favorite`, baseURL)
    const res = await fetch(link, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    if (!res.ok) {
      throw new Error()
    }
  } catch (err) {
    dispatch(loadFail())
  }
}

export const deleteLike = (slug, token) => async (dispatch) => {
  try {
    const link = new URL(`/api/articles/${slug}/favorite`, baseURL)
    const res = await fetch(link, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    if (!res.ok) {
      throw new Error()
    }
  } catch (err) {
    dispatch(loadFail())
  }
}

export const postCreateArticle = (data, token) => async (dispatch) => {
  try {
    dispatch(loading())
    const link = new URL('/api/articles', baseURL)
    const tagList = []
    data.tags.forEach((tag) => {
      if (tag.value !== '') {
        tagList.push(tag.value)
      }
    })
    const articleInfo = {
      article: {
        title: data.title,
        description: data.description,
        body: data.textField,
        tagList,
      },
    }
    const res = await fetch(link, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(articleInfo),
    })
    const body = await res.json()
    if (!res.ok) {
      throw new Error()
    } else {
      dispatch(loadOneArticleSuccess(body.article))
      dispatch(setIsArticleChangeTrue())
    }
  } catch (err) {
    dispatch(loadFail())
  }
}

export const deleteArticle = (slug, token) => async (dispatch) => {
  try {
    const link = new URL(`/api/articles/${slug}`, baseURL)
    const res = await fetch(link, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    if (!res.ok) {
      throw new Error()
    } else {
      dispatch(setIsArticleChangeTrue())
    }
  } catch (err) {
    dispatch(loadFail())
  }
}

export const putUpdateArticle = (title, description, text, tags, oldArticleInfo, slug, token) => async (dispatch) => {
  try {
    dispatch(loading())
    const link = new URL(`/api/articles/${slug}`, baseURL)
    const articleInfo = { article: {} }
    if (title !== oldArticleInfo.title) {
      articleInfo.article = { ...articleInfo.article, title }
    }
    if (description !== oldArticleInfo.description) {
      articleInfo.article = { ...articleInfo.article, description }
    }
    if (text !== oldArticleInfo.body) {
      articleInfo.article = { ...articleInfo.article, body: text }
    }
    const tagList = []
    if (tags.length === oldArticleInfo.tagList.length) {
      tags.forEach((tag) => {
        if (!oldArticleInfo.tagList.includes(tag.value) && tag.value !== '') {
          tagList.push(tag.value)
        }
      })
    } else {
      tags.forEach((tag) => {
        if (tag.value !== '') {
          tagList.push(tag.value)
        }
      })
    }
    if (tagList.length !== 0) {
      articleInfo.article = { ...articleInfo.article, tagList }
    }
    if (Object.keys(articleInfo.article).length === 0) {
      dispatch(loadInvalidData({ errors: { info: 'nothing changes' } }))
      return
    }
    const res = await fetch(link, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(articleInfo),
    })
    const body = await res.json()
    if (!res.ok) {
      throw new Error()
    } else {
      dispatch(loadOneArticleSuccess(body.article))
      dispatch(setIsArticleChangeTrue())
    }
  } catch (err) {
    dispatch(loadFail())
  }
}

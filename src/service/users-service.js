import {
  loading,
  loadFail,
  loadUserSuccess,
  loadInvalidData,
  setIsUserUpdateTrue,
  setIsUserUpdateFalse,
  loadingUser,
  loadUserFail,
  clearLoadUserFail,
} from '../redux/service-slice'

const baseURL = new URL('https://blog.kata.academy')

export const postUser = (email, password) => async (dispatch) => {
  try {
    dispatch(loadingUser())
    const link = new URL('/api/users/login', baseURL)
    const userInfo = {
      user: {
        email,
        password,
      },
    }
    const res = await fetch(link, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(userInfo),
    })
    const body = await res.json()
    if (!res.ok) {
      if (res.status === 422) {
        dispatch(loadInvalidData(body))
      } else {
        throw new Error()
      }
    } else {
      dispatch(clearLoadUserFail())
      dispatch(loadUserSuccess(body.user))
    }
  } catch (err) {
    dispatch(loadUserFail())
  }
}

export const postNewUser = (username, email, password) => async (dispatch) => {
  try {
    dispatch(loadingUser())
    const link = new URL('/api/users', baseURL)
    const userInfo = {
      user: {
        username,
        email,
        password,
      },
    }
    const res = await fetch(link, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(userInfo),
    })
    const body = await res.json()
    if (!res.ok) {
      if (res.status === 422) {
        dispatch(loadInvalidData(body))
      } else {
        throw new Error()
      }
    } else {
      dispatch(clearLoadUserFail())
      dispatch(loadUserSuccess(body))
    }
  } catch (err) {
    dispatch(loadUserFail())
  }
}

export const getUser = (token) => async (dispatch) => {
  try {
    dispatch(loadingUser())
    const link = new URL('/api/user', baseURL)
    const res = await fetch(link, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    const body = await res.json()
    if (!res.ok) {
      throw new Error()
    } else {
      dispatch(clearLoadUserFail())
      dispatch(loadUserSuccess(body.user))
    }
  } catch (err) {
    dispatch(loadUserFail())
  }
}

export const putUpdateUser = (username, email, password, image, oldUserInfo) => async (dispatch) => {
  try {
    dispatch(loading())
    const link = new URL('/api/user', baseURL)
    const userInfo = { user: {} }
    if (username !== oldUserInfo.username) {
      userInfo.user = { ...userInfo.user, username }
    }
    if (email !== oldUserInfo.email) {
      userInfo.user = { ...userInfo.user, email }
    }
    if (password.length > 5) {
      userInfo.user = { ...userInfo.user, password }
    }
    if (image !== oldUserInfo.image) {
      userInfo.user = { ...userInfo.user, image }
    }
    if (Object.keys(userInfo.user).length === 0) {
      dispatch(loadInvalidData({ errors: { info: 'nothing changes' } }))
      return
    }
    const res = await fetch(link, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Token ${oldUserInfo.token}`,
      },
      body: JSON.stringify(userInfo),
    })
    const body = await res.json()
    if (!res.ok) {
      if (res.status === 422) {
        dispatch(setIsUserUpdateFalse())
        dispatch(loadInvalidData(body))
      } else {
        dispatch(setIsUserUpdateFalse())
        throw new Error()
      }
    } else {
      dispatch(loadUserSuccess(body.user))
      dispatch(setIsUserUpdateTrue())
    }
  } catch (err) {
    dispatch(loadFail())
  }
}

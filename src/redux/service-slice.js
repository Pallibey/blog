import { createSlice } from '@reduxjs/toolkit'

export const serviceSlice = createSlice({
  name: 'service',
  initialState: {
    user: {},
    allArticles: {},
    oneArticle: {},
    changeLike: false,
    isLoading: false,
    isUserLoading: false,
    isLogOut: false,
    isArticleChange: false,
    isUserUpdate: false,
    isInvalidData: null,
    isUserLoadError: false,
    isError: false,
  },
  reducers: {
    loading: (state) => {
      state.isLoading = true
    },
    loadingUser: (state) => {
      state.isUserLoading = true
    },
    loadArticlesSuccess: (state, action) => {
      state.isLoading = false
      state.allArticles = action.payload
    },
    loadOneArticleSuccess: (state, action) => {
      state.isLoading = false
      state.oneArticle = action.payload
    },
    clearOneArticle: (state) => {
      state.oneArticle = {}
    },
    loadUserSuccess: (state, action) => {
      state.isLoading = false
      state.user = action.payload
    },
    clearUser: (state) => {
      state.user = {}
    },
    setIsArticleChangeFalse: (state) => {
      state.isArticleChange = false
    },
    setIsArticleChangeTrue: (state) => {
      state.isArticleChange = true
    },
    setIsUserUpdateFalse: (state) => {
      state.isUserUpdate = false
    },
    setIsUserUpdateTrue: (state) => {
      state.isUserUpdate = true
    },
    loadInvalidData: (state, action) => {
      state.isLoading = false
      state.isInvalidData = action.payload
    },
    clearInvalidData: (state) => {
      state.isInvalidData = null
    },
    loadUserFail: (state) => {
      state.isUserLoading = false
      state.isUserLoadError = true
    },
    loadFail: (state) => {
      state.isLoading = false
      state.isError = true
    },
    clearLoadUserFail: (state) => {
      state.isUserLoadError = false
    },
    clearLoadFail: (state) => {
      state.isError = false
    },
    setIsLogOutTrue: (state) => {
      state.isLogOut = true
    },
    setIsLogOutFalse: (state) => {
      state.isLogOut = false
    },
  },
})

export const {
  loading,
  loadingUser,
  loadArticlesSuccess,
  loadOneArticleSuccess,
  clearOneArticle,
  loadUserSuccess,
  clearUser,
  setIsArticleChangeFalse,
  setIsArticleChangeTrue,
  setIsUserUpdateFalse,
  setIsUserUpdateTrue,
  loadInvalidData,
  clearInvalidData,
  loadUserFail,
  loadFail,
  clearLoadUserFail,
  clearLoadFail,
  setIsLogOutTrue,
  setIsLogOutFalse,
} = serviceSlice.actions

export default serviceSlice.reducer

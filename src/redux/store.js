import { configureStore } from '@reduxjs/toolkit'

import serviceSlice from './service-slice'

const store = configureStore({
  reducer: {
    service: serviceSlice,
  },
})
export default store

import { configureStore } from '@reduxjs/toolkit'
import usersSlice from './reducers/users'
import defectsSlice  from './reducers/defects'
import notificationsSlice from './reducers/notifications'
import siteSlice from './reducers/site'
import commentsSlice from './reducers/comments'

export const store = configureStore({
  reducer: {
    users: usersSlice,
    defects: defectsSlice,
    notifications: notificationsSlice,
    site:siteSlice,
    comments:commentsSlice
  },middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware({
      serializableCheck:{
        ignoreActions:['defects/comments']
      }
    })
  })
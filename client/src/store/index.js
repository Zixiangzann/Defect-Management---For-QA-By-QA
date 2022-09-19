import { configureStore } from '@reduxjs/toolkit'
import usersSlice from './reducers/users'
import defectsSlice  from './reducers/defects'
import notificationsSlice from './reducers/notifications'
import siteSlice from './reducers/site'
import commentsSlice from './reducers/comments'
import adminSlice from './reducers/admin'
import reportSlice from './reducers/report'
import historySlice from './reducers/history'

export const store = configureStore({
  reducer: {
    users: usersSlice,
    admin:adminSlice,
    defects: defectsSlice,
    report: reportSlice,
    notifications: notificationsSlice,
    site:siteSlice,
    history:historySlice,
    comments:commentsSlice,
  },middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware({
      serializableCheck:{
        ignoreActions:['defects/comments']
      }
    })
  })
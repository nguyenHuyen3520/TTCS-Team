import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/UserSlice'
import teamReducer from './slices/TeamSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        team: teamReducer,
    },
})
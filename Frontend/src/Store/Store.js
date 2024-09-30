

import {configureStore} from '@reduxjs/toolkit'
import authStateReducers from './AuthSlice'
import compSliceReducers from './componentSlice'
const store = configureStore({
    reducer:{
        authState:authStateReducers,
        compSlice:compSliceReducers
    }
})

export default store
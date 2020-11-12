import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    // todos: todosReduce,
})

export const store = configureStore({
    reducer: rootReducer,
})
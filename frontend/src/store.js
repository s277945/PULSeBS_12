import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

// Reduce store, implemented but not used, we don't have any diffictul state to manage for now
const rootReducer = combineReducers({
    // todos: todosReduce,
})

export const store = configureStore({
    reducer: rootReducer,
})
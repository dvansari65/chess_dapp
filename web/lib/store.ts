import { configureStore } from "@reduxjs/toolkit";
import setNameReducer from "../features/redux/setNameSlice"

export const store = configureStore({
    reducer:{
        setName:setNameReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
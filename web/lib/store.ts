import { configureStore } from "@reduxjs/toolkit";
import setNameReducer from "../features/redux/setNameSlice"
import saveUserReducer from "../features/redux/saveUser"
export const store = configureStore({
    reducer:{
        setName:setNameReducer,
        saveUser:saveUserReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface initialStateProps {
    userName:string | undefined;
    publickey:string  | undefined;
    createdAt?:string;
}

const initialState:initialStateProps= {
    userName:undefined,
    publickey:undefined,
    createdAt:new Date().toISOString()
}

export const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        saveUser:(state,action:PayloadAction<initialStateProps>)=>{
            state.userName = action.payload.userName;
            state.publickey= action.payload.publickey;
            state.createdAt = action.payload.createdAt
        }
    }
})

export const {saveUser} = userSlice.actions
export default userSlice.reducer;
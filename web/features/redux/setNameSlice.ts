import { createSlice, PayloadAction } from "@reduxjs/toolkit"


interface initialstateProps {
    isNameSet:boolean
}
const initialState:initialstateProps = {
    isNameSet:false
}

export const setNameSlice = createSlice({
    name:"isNameSet",
    initialState,
    reducers:{
        setName:(state,action:PayloadAction<boolean>)=>{
            state.isNameSet = !!action.payload
        }
    }
})

export const {setName} = setNameSlice.actions;
export default setNameSlice.reducer;
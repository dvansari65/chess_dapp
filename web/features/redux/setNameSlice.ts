import { createSlice, PayloadAction } from "@reduxjs/toolkit"


interface initialstateProps {
    isNameSetModalOpen:boolean
}
const initialState:initialstateProps = {
    isNameSetModalOpen:false
}

export const setNameSlice = createSlice({
    name:"isNameSet",
    initialState,
    reducers:{
        setName:(state,action:PayloadAction<boolean>)=>{
            state.isNameSetModalOpen = action.payload
        }
    }
})

export const {setName} = setNameSlice.actions;
export default setNameSlice.reducer;
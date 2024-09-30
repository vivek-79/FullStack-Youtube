
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status:true
}

const componentSlice=createSlice({
    name:'compSlice',
    initialState,

    reducers:{
        toggl:(state,action)=>{
            state.status=!state.status
        }
    }
})

export const {toggl}=componentSlice.actions

export default componentSlice.reducer
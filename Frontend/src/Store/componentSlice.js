
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status:false,
    data:[]
}

const componentSlice=createSlice({
    name:'compSlice',
    initialState,

    reducers:{
        toggl:(state,action)=>{
            state.status=!state.status
        },
        search:(state,action)=>{
            state.data=action.payload
        }
    }
})

export const {toggl,search}=componentSlice.actions

export default componentSlice.reducer

import {createSlice} from '@reduxjs/toolkit'

const initialState ={
    status:false,
    userData:''
}

const authSlice = createSlice({
    initialState,
    name:'authState',

    reducers:{
        logIn:(state,action)=>{
            state.status=true,
            state.userData= action.payload
        },
        logOut:(state,action)=>{
            state.status=false,
            state.userData=''
        }
    }
})
export const {logIn,logOut} = authSlice.actions
export default authSlice.reducer

import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export type accountRedux = {
    username:string,
    token:string,
}

const username = localStorage.getItem('username');
const token = localStorage.getItem('token');

export const accountSlice = createSlice({
    name:'account',
    initialState:{
        username,
        token,
    },
    reducers:{
        put(state,{payload}:PayloadAction<accountRedux>){
            state.username = payload.username
            state.token = payload.token
        }
    }
})
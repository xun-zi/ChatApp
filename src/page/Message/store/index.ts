import { createSlice } from "@reduxjs/toolkit";
import { MessageData } from "../../../indexedb/dbType";


export const messageListSlice = createSlice({
    name:'messageList',
    initialState:[],
    reducers:{
        preInsert:(state:any,data)=>{
            console.log(data);
            state = [...data.payload,...state]
        },
    }
})
import { configureStore } from "@reduxjs/toolkit";
import { messageListSlice } from "../page/Message/store";




export const store = configureStore({
    reducer:{
       messageList:messageListSlice.reducer
    }
})
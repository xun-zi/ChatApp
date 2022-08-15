import { configureStore } from "@reduxjs/toolkit";
import { messageListSlice } from "../page/Message/store";
import { accountSlice } from "./accountSlice";
import { friendSlice } from "./friendSlice";




export const store = configureStore({
    reducer:{
       message:messageListSlice.reducer,
       friend:friendSlice.reducer,
       account:accountSlice.reducer
    }
})
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageData } from "../../../indexedb/dbType";


export const messageListSlice = createSlice({
    name: 'messageList',
    initialState: [],
    reducers: {
        preInsert: (state: MessageData[], data: PayloadAction<MessageData[]>) => {
            state.unshift(...data.payload);
        },
    }
})
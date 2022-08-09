import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageData } from "../../../indexedb/dbType";

export type MessageRedux = {
    state:boolean,
    messageList:MessageData[]
}

export const messageListSlice = createSlice({
    name: 'message',
    initialState: {
        state:false,
        messageList:[]
    } as MessageRedux,
    reducers: {
        preInsert: (state, data: PayloadAction<MessageData[]>) => {
            state.state = true;
            state.messageList.unshift(...data.payload)
        },
    }
})
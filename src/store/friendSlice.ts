import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { friendData } from "../indexedb/dbType";




export type friendRedux = {
    state:boolean;
    friend:{
        [uuid:number]:friendData;
    };
}

export const friendSlice = createSlice({
    name:'friend',
    initialState:{
        state:false,
        friend:{},
    } as friendRedux,
    reducers:{
        insert:(state:friendRedux,{payload}:PayloadAction<friendData[]>) => {
            state.state = true;
            const {friend} = state;
            payload.forEach((data:friendData) => {
                friend[data.uuid] = data
            })
        }
    }
})
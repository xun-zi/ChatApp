import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPresonDate } from "../../api";
import { addMessage, getMessage } from "../../indexedb";
import { MessageData } from "../../indexedb/dbType";
import { deleteDb } from "../../indexedb/public";
import { messageListSlice } from "./store";

export default function (): React.ReactElement {
    //  (async () => {
    //     await addMessage({
    //      uuid:1,
    //      time:new Date().getTime(),
    //      message:'',
    //      bell:0,
    //      next:0,
    //     })

    //     await addMessage({
    //      uuid:2,
    //      time:new Date().getTime(),
    //      message:'',
    //      bell:0,
    //      next:0,
    //     })

    //     await addMessage({
    //      uuid:3,
    //      time:new Date().getTime(),
    //      message:'',
    //      bell:0,
    //      next:0,
    //     })
    //     await addMessage({
    //      uuid:4,
    //      time:new Date().getTime(),
    //      message:'',
    //      bell:0,
    //      next:0,
    //     })

    //     const data = await getMessage();
    //     data.sort((a:MessageData,b:MessageData):number => {
    //         return a.time - b.time
    //     })
    //     console.log(data);
    //  })();

    const messageList = useSelector((state: any) => state.messageList) as MessageData[];
    const {preInsert} = messageListSlice.actions
    const dispatch  = useDispatch();
    dispatch(preInsert([{
        uuid:0,
        time:0,
        message:'',
        bell:0,
    }]));
    useEffect(() => {
        if (messageList.length === 0) {
            (async function(){
                const data = await getMessage();
                dispatch(preInsert([...data,{
                    uuid:0,
                    time:0,
                    message:'',
                    bell:0,
                }]));
            })()
        }
    })

    console.log(messageList)

    return (<div>
        消息页1
        {/* {
            messageList.map((data,index) => {
                return (
                    <p key={index}>{new Date(data.time).toLocaleString()} {data.bell} {data.message}</p>
                )
            })
        } */}
        </div>)
}
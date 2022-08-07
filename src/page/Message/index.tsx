import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPresonDate } from "../../api";
import { addMessage, getFriend, getMessage, putFriend } from "../../indexedb";
import { MessageData } from "../../indexedb/dbType";
import { deleteDb } from "../../indexedb/public";
import { messageListSlice } from "./store";

export default function (): React.ReactElement {
    getPresonDate('1').then((data) => {
        console.log(data)
        putFriend(Object.assign({},data,{uuid:1}))
    })
    
    //  (async () => {
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

    const { preInsert } = messageListSlice.actions

    const dispatch = useDispatch();

    // dispatch(preInsert([{
    //     uuid: 0,
    //     time: 0,
    //     message: '',
    //     bell: 0,
    // }]));

    useEffect(() => {
        if(messageList.length === 0){
            (async function () {
                const mockData = {
                    uuid: 0,
                    time: 0,
                    message: '',
                    bell: 0,
                }
                const data = await getMessage();
                dispatch(preInsert([...data, mockData]));
                // dispatch(preInsert([mockData]));
            })()
    
        }
    }, []);

    return (<div>
        消息页1
        {
            messageList.map((data, index) => {
                return (
                    <p key={index}>{new Date(data.time).toLocaleString()} {data.bell} {data.message}</p>
                )
            })
        }
    </div>)
}
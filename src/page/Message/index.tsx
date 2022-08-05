import React from "react";
import { getPresonDate } from "../../api";
import { adDMessageData, getAllMessageData, MessageData, puTfriendData } from "../../indexedb";

export default function():React.ReactElement{
    
    (async () => {
        await adDMessageData({
            uuid:5,
            message:'',
            bell:0,
            next:0,
            pre:0,
        })

        const map= await getAllMessageData();
        
        console.log(map)
        const Data:MessageData[] = [];
        let cur = map.get(0) as MessageData;
        console.log(Data);
    })()
    
    
     
    
    return (<div>消息页</div>)
}
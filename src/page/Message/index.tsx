import React from "react";
import { getPresonDate } from "../../api";
import { addMessage, getMessage } from "../../indexedb";
import { MessageData } from "../../indexedb/dbType";
import { deleteDb } from "../../indexedb/public";

export default function():React.ReactElement{
     (async () => {
        await addMessage({
         uuid:1,
         time:new Date().getTime(),
         message:'',
         bell:0,
         next:0,
        })

        await addMessage({
         uuid:2,
         time:new Date().getTime(),
         message:'',
         bell:0,
         next:0,
        })

        await addMessage({
         uuid:3,
         time:new Date().getTime(),
         message:'',
         bell:0,
         next:0,
        })
        await addMessage({
         uuid:4,
         time:new Date().getTime(),
         message:'',
         bell:0,
         next:0,
        })

        const data = await getMessage();
        data.sort((a:MessageData,b:MessageData):number => {
            return a.time - b.time
        })
        console.log(data);
     })();
    return (<div>消息页</div>)
}
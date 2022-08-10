import { AddOutline, AudioOutline, SmileOutline } from "antd-mobile-icons";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SendMessage } from "../../../../api";
import './CharInput.scss'

export type CharInput = {
    id:number;
}

export default function({id}:CharInput){
    const [value,setValue] = useState<string>('');
    const MessageSend = (e:any) => {
        if(e.key === 'Enter'){
            SendMessage(id,{
                time:new Date().getTime(),
                message:value
            })
        }
    }

    return (<div className="ChatInput">
        <AudioOutline fontSize={36}/>
        <input 
        className="textInput" 
        value={value} 
        onChange={e => {setValue(e.currentTarget.value)}}
        onKeyDown={(e) => {MessageSend(e)}}></input>
        <SmileOutline fontSize={36}/>
        <AddOutline fontSize={36}/>
    </div>)
}
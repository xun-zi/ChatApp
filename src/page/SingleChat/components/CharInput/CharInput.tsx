import { InfiniteScroll } from "antd-mobile";
import { AddOutline, AudioOutline, SmileOutline } from "antd-mobile-icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { SendMessage } from "../../../../api";
import { resolveSubscriber } from "../../../../api/longPoll";
import { addsingle } from "../../../../indexedb";
import { accountSlice } from "../../../../store/accountSlice";
import './CharInput.scss'

export type CharInput = {
    id: number;
}

export default function ({ id }: CharInput) {
    const [value, setValue] = useState<string>('');
    const { username, token } = useSelector((state: any) => state.account)

    const MessageSend = (e: any) => {
        if (e.key === 'Enter' && value != '') {
            SendMessage(id, {
                time: new Date().getTime(),
                message: value,
            }, username, token)
            resolveSubscriber({
                [id]: [{
                    time: new Date().getTime(),
                    message: [{
                        uuid: +username,
                        message: value,
                    }]
                }]
            })
            setValue('')
        }
    }


    return (<div className="ChatInput">
        <AudioOutline fontSize={36} />
        <input
            className="textInput"
            value={value}
            onChange={e => { setValue(e.currentTarget.value) }}
            onKeyDown={(e) => { MessageSend(e) }}></input>
        <SmileOutline fontSize={36} />
        <AddOutline fontSize={36} />
        
    </div>)
}
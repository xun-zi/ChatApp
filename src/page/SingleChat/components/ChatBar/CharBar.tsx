import { Avatar, Button, List, Space } from "antd-mobile";
import './CharBar.scss'

type ChatBar = {
    message:string,
    src:string,
    own:boolean,
}


export default function ({data}:{data:ChatBar}) {
    return (<div className={`ChatBar ${data.own ? 'ChatOwn' :''}`}>
        <Avatar src={data.src} style={{ '--size': '32px' }}></Avatar>
        <div className="ChatMessage" >
            {data.message}
        </div>
    </div>)
}
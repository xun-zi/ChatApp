import { List, Image } from "antd-mobile";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPresonDate } from "../../api";
import { addsingle, getAllFriend, getFriend, getAllMessage, putFriend, putMessage, singleOpenCursor } from "../../indexedb";
import { messageListSlice, MessageRedux } from "./store";
import { useNavigate } from "react-router-dom";
import { friendRedux, friendSlice } from "../../store/friendSlice";
import { MessageData } from "../../indexedb/dbType";
import { subscribeDelete, subscribeFn } from "../../api/reciveMessage";
import { singleDataObject } from "../../dataDeformation/dateDeformation";


export type MessageRender = {
    uuid: number,
    message: string,
    userName: string,
    picture: string,
    bell: number,
    time: number,
}


const AddMessageHandle = (_state:MessageData[],data:singleDataObject) => {
    //数组转对象
    const state = new Map<string,MessageData>();
    _state.forEach((val,index) => {
        state.set(val.uuid + '',val);
    })
    
    //元素合并
    for(const key in data){
        if(state.has(key)){
            const val = state.get(key) as MessageData;
            const [val1] = data[key].slice(-1);
            val.bell = val.bell + val1.message.length;
            val.message = val1.message?.at(-1)?.message || '';
            val.time = val1.time;
        }else{
            const [val1] = data[key].slice(-1);
            state.set(key,{
                time:val1.time,
                uuid:+key,
                message:val1.message?.at(-1)?.message || '',
                bell:val1.message.length,
            });
        }
    }

    //对象转数组
    const stateArray:MessageData[] = [];
    state.forEach((val) => {
        stateArray.push(val);
    })

    //排序
    stateArray.sort((a, b) => {
        return b.time - a.time
    })

    return stateArray
}


export default function (): React.ReactElement {
    const messageRedux = useSelector((state: any) => state.message) as MessageRedux;
    const friendRedux = useSelector((state: any) => state.friend) as friendRedux
    const { preInsert } = messageListSlice.actions
    const { insert } = friendSlice.actions
    const dispatch = useDispatch();

    const [messageDate, setMessageData] = useState<MessageData[]>([]);

    useEffect(() => {
        if (!messageRedux.state) {
            (async function () {
                const data = await getAllMessage();
                dispatch(preInsert(data))
            })()
        }
        if (!friendRedux.state) {
            (async function () {
                dispatch(insert(await getAllFriend()))
            })()
        }

        // putMessage({
        //     uuid:2,
        //     message:'你好',
        //     bell:0,
        //     time:new Date().getTime(),
        // })
    }, []);

    useEffect(() => {
        const handle = () => {
            getAllMessage().then((data) => {
                data.sort((a, b) => {
                    return b.time - a.time
                })
                setMessageData((state) => {
                    return data;
                });

            })
        }
        handle()
        subscribeFn((data) => {
            
            setMessageData((state) => {
                return AddMessageHandle(state,data)
            })
        })
        return () => {
            subscribeDelete(handle)
        }
    }, [])


    const navigate = useNavigate();
    const skip = (id: number) => {
        navigate(`/singleChat?id=${id}`)
    }
    
    const message: MessageRender[] = messageDate.map((data) => {
        const PresonData = friendRedux.friend[data.uuid];
        if (!PresonData) {
            getPresonDate(data.uuid + '').then((data) => {
                dispatch(insert([data]));
                putFriend(data);
            })
        }
        return Object.assign({}, data, PresonData || { userName: '', picture: '' });
    })
    console.log(messageDate)

    return (
        <List >
            {message.map(user => (
                <div style={{ display: 'flex' }} key={user.uuid} onClick={() => { skip(user.uuid) }}>
                    <div style={{ flex: '1' }}>
                        <List.Item
                            key={user.uuid}
                            prefix={
                                <Image
                                    src={user.picture}
                                    style={{ borderRadius: 5 }}
                                    fit='cover'
                                    width={50}
                                    height={50}
                                />
                            }
                            description={user.message}
                        >
                            {user.userName}
                        </List.Item>
                    </div>
                    <div style={{ height: '100%', alignItems: 'center', }}>
                        <br />
                        <div>{new Date(user.time).toLocaleString()}</div>
                    </div>
                </div>
            ))}
        </List>
    )
}
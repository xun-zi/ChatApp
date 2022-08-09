import { List, Image } from "antd-mobile";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPresonDate } from "../../api";
import { addMessage, getAllFriend, getFriend, getMessage, putFriend } from "../../indexedb";
import { friendData, MessageData } from "../../indexedb/dbType";
import { deleteDb } from "../../indexedb/public";
import { messageListSlice, MessageRedux } from "./store";
import { useNavigate } from "react-router-dom";
import { friendRedux, friendSlice } from "../../store/friendSlice";

export type MessageRender = {
    uuid:number,
    message:string,
    userName:string,
    picture:string,
    bell:number,
    time:number,
}


export default function (): React.ReactElement {
    const messageRedux = useSelector((state: any) => state.message) as MessageRedux;
    const friendRedux = useSelector((state:any) => state.friend) as friendRedux
    const { preInsert } = messageListSlice.actions
    const {insert} = friendSlice.actions
    const dispatch = useDispatch();

    useEffect(() => {
        if (!messageRedux.state) {
            (async function () {
                const data = await getMessage();
                dispatch(preInsert(data))
            })()
        }
        if(!friendRedux.state){
            (async function(){
                dispatch(insert(await getAllFriend()))
            })()
        }
    }, []);


    const navigate = useNavigate();
    const skip = (id:number) => {
        navigate(`/singleChat?id=${id}`)
    }

    const message:MessageRender[] = messageRedux.messageList.map((data) => {

        return Object.assign({},data,friendRedux.friend[data.uuid] || {userName:'',picture:''});
    })

    // console.log(message);
    return (
        <List >
            {message.map(user => (
                <div style={{ display: 'flex' }} key={user.uuid} onClick={() => {skip(user.uuid)}}>
                    <div style={{flex:'1'}}>
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
                    <div style={{height:'100%',alignItems:'center',}}>
                        <br/>
                        <div>{new Date(user.time).toLocaleString()}</div>
                    </div>
                </div>
            ))}
        </List>
    )
}
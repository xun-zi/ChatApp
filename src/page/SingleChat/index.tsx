import { Image, Input, List } from 'antd-mobile'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { addsingle, singleOpenCursor } from '../../indexedb'
import { friendData, singleData } from '../../indexedb/dbType'
import Message from '../Message'
import CharBar from './components/ChatBar/CharBar'
import { AntOutline, BankcardOutline } from 'antd-mobile-icons'
import './index.css'
import CharInput from './components/CharInput/CharInput'
import { friendRedux, friendSlice } from '../../store/friendSlice'
import { useDispatch, useSelector } from 'react-redux'
import { stat } from 'fs'
import { accountRedux } from '../../store/accountSlice'
import { getPresonDate } from '../../api'
import {  subscribeDelete, subscribeFn, subscriber } from '../../api/longPoll'
import { subscribeDataToSingleData } from '../../dataDeformation/dateDeformation'

const mock = {
    message: '1111',
    src: 'http://127.0.0.1:8080/assest/1/picture.jpg',
    own: true
}


export default function () {
    const [userMessage, setUserMessage] = useState<singleData[]>([]);

    const { insert } = friendSlice.actions;
    const friendRedux = useSelector((state: any) => state.friend) as friendRedux;
    const { username, token } = useSelector((state: any) => state.account) as accountRedux;

    const dispatch = useDispatch();
    const navigate = useNavigate();


    let [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get('id') || username;
    let friendOwn = friendRedux.friend[+username] || { uuid: +username, userName: '', picture: '' }
    let friendIt = friendRedux.friend[+id] || { uuid: +id, userName: '', picture: '' }



    useEffect(() => {
        (async function () {
            if (!friendRedux.friend[+username]) {
                console.log('username',username);
                const data = await getPresonDate(username)
                dispatch(insert([data]))
            }
            if (!friendRedux.friend[+id]) {
                console.log('id',id)
                const data = await getPresonDate(id + '')
                dispatch(insert([data]))
            }
        })()
    }, [])

    useEffect(() => {
        (async function () {
            const cusor = await singleOpenCursor(+id);
            if (cusor) {
                setUserMessage((await cusor(50)).reverse());
            }
        })()
    },[])

    useEffect(() => {
        const subscribeAction:subscriber = (_data)=>{
            const data = _data[+id]
            if(!data || data.length === 0)return;
            setUserMessage(state => {
                return [...state,...data];
            })
        }

        subscribeFn(subscribeAction);
        
        return () => {
            subscribeDelete(subscribeAction);
        }
    },[])



    return (
        <div className='singlePage'>
            <div className='singlecontent'>
                {
                    userMessage.map(({ time, message }: singleData, index) => {

                        return (<div key={index}>
                            <div>{time}</div>
                            {
                                message.map((data, index) => {
                                    return (<CharBar data={{
                                        own: data.uuid === +username,
                                        src: data.uuid === +username ? friendOwn?.picture : friendIt?.picture,
                                        message: data.message
                                    }} key={index} />)
                                })
                            }
                        </div>)
                    })
                }
            </div>
            <CharInput id={+id} />
        </div>
    )
}
import { Image, InfiniteScroll, Input, List } from 'antd-mobile'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { addsingle, singleOpenCursor } from '../../indexedb'
import { friendData, singleData } from '../../indexedb/dbType'
import Message from '../Message'
import CharBar from './components/ChatBar/CharBar'
import { AntOutline, BankcardOutline } from 'antd-mobile-icons'
import './index.scss'
import CharInput from './components/CharInput/CharInput'
import { friendRedux, friendSlice } from '../../store/friendSlice'
import { useDispatch, useSelector } from 'react-redux'
import { stat } from 'fs'
import { accountRedux } from '../../store/accountSlice'
import { getPresonDate } from '../../api'
import { subscribeDelete, subscribeFn, subscriber, } from '../../api/longPoll'
import { singleDataObject, subscribeDataToSingleData } from '../../dataDeformation/dateDeformation'
import { debounce } from '../../api/public/utils'
import { solveScrollPosition } from '../../sundryFunction/solveScroll/resize_position'

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
    let [friendOwn, setFriendOwn] = useState<friendData>(friendRedux.friend[+username] || { uuid: +username, userName: '', picture: '' })
    let [friendIt, setFriendIt] = useState<friendData>(friendRedux.friend[+id] || { uuid: +id, userName: '', picture: '' })

    const ref = useRef<HTMLDivElement>(null);

    //获取好友数据
    useEffect(() => {
        ref.current?.scrollTo(0, ref.current.scrollHeight);
        (async function () {
            if (!friendRedux.friend[+username]) {
                const data = await getPresonDate(username + '')
                dispatch(insert([data]))
                setFriendOwn(data)

            }
            if (!friendRedux.friend[+id]) {
                const data = await getPresonDate(id + '')
                dispatch(insert([data]))
                setFriendIt(data);

            }
        })()
    }, [])
    //响应新消息
    useEffect(() => {
        const subscribeAction: subscriber = (_data: singleDataObject) => {
            const data = _data[+id]
            if (!data || data.length === 0) return;
            setUserMessage(state => {
                if (state.length && data.length) {
                    const [back] = state.slice(-1);
                    if (data[0].time - back.time <= 1000 * 3 * 60) {
                        data[0].time = back.time
                        data[0].message = [...back.message, ...data[0].message];
                        state.pop();
                    }
                }
                return [...state, ...data];
            })
        }

        subscribeFn(subscribeAction);

        return () => {
            subscribeDelete(subscribeAction);
        }
    }, [])



    //获取,内存中的数据
    useEffect(() => {
        (async () => {
            const cursor = await singleOpenCursor(+id);

            async function loadMore() {
                if (cursor) {
                    const data = await cursor(20);
                    data.reverse();
                    setUserMessage((state) => {
                        if(!data.length)return state;
                        if(!state.length)return data;
                        const [back] = data.slice(-1);
                        if(back.time === state[0].time){
                            state[0].message = [...back.message,...state[0].message];
                            data.pop()
                        }
                        return [...data,...state];
                    })
                }

            }
            await loadMore()
            setTimeout(()=>{
                ref.current?.scrollTo(0, ref.current?.scrollHeight);
            },100)
            const sonstantScroll = () => {
                if (!ref.current?.getBoundingClientRect()) return;
                if (!ref.current?.scrollTop) {
                    loadMore()
                }
            }
            ref.current?.addEventListener('scroll', sonstantScroll)



        })();
    }, [])

    useEffect(()=>{
        const El = ref.current as HTMLDivElement
        let heigh = El.scrollHeight;
        const timer = setInterval(async () => {
            const onchangeHeight = El.scrollHeight - heigh;
            if(onchangeHeight){
                El.scrollTo(0,El.scrollTop + onchangeHeight);
                heigh = El.scrollHeight;
            }
            
            
        },300);
        return () => {
            clearInterval(timer)
        }
    },[])


    return (
        <div className='singlePage'>
            <div className='singlecontent' ref={ref}>
                {
                    userMessage.map(({ time, message }: singleData, index) => {
                        return (<div key={index}>
                            <h6>{new Date(time).toLocaleString()}</h6>
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
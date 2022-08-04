import React, { lazy, Suspense } from 'react'
import { Router } from 'oh-router';
import { Outlet } from 'oh-router-react';
import { MustLoginMiddleware } from './middleware/MustLoginMiddleware';



const Message = lazy(() => import('../page/Message'));
const Find = lazy(() => import('../page/Find'));
const Login = lazy(() => import('../page/Login'));
const AddressList = lazy(() => import('../page/AddressList'));
const SingleChat = lazy(() => import('../page/SingleChat'))

const BottomNavigatin = () => {
    return (<div>导航栏 <Outlet/></div>)
}

export const router = new Router({
    routes:[
        {
            path:'Login',
            element:<Login/>
        },
        {
            path:'/',
            element:<BottomNavigatin/>,
            children:[{
                path:'Find',
                element:<Find/>
            },{
                path:'Message',
                element:<Message/>
            },{
                path:'AddressList',
                element:<AddressList/>
            },{
                path:'SingleChat',
                element:<SingleChat/>
            }]
        },
    ],
    middlewares:[ new MustLoginMiddleware()],
})



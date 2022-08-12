import React, { lazy, Suspense, useEffect } from 'react'
import Navigation from '../components/Navigation/Navigation';
import { Outlet, RouteObject, useMatch, useNavigate } from 'react-router-dom';
import { accountSlice } from '../store/accountSlice';
import { useDispatch } from 'react-redux';
import SingleChat from '../page/SingleChat';
import { NavBar } from 'antd-mobile';
import TopNavigation from '../page/SingleChat/compontent/TopNavigation/TopNavigation';
import Layout from '../page/Layout/Layout';



const Message = lazy(() => import('../page/Message'));
const Find = lazy(() => import('../page/Find'));
const Login = lazy(() => import('../page/Login'));
const AddressList = lazy(() => import('../page/AddressList'));





export const router: RouteObject[] = [
    {
        path: '/Login',
        element: <Login />
    }, {
        path: 'SingleChat',
        element: <SingleChat />
    },
    {
        path: '/',
        element: <Layout/>,
        children: [{
            path: 'Find',
            element: <Find />,
        }, {
            path: 'Message',
            element: <Message />
        }, {
            path: 'AddressList',
            element: <AddressList />
        }]
    },
]



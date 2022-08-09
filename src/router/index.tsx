import React, { lazy, Suspense } from 'react'
import { MustLoginMiddleware } from './middleware/MustLoginMiddleware';
import Navigation from '../components/Navigation/Navigation';
import { Outlet, RouteObject } from 'react-router-dom';



const Message = lazy(() => import('../page/Message'));
const Find = lazy(() => import('../page/Find'));
const Login = lazy(() => import('../page/Login'));
const AddressList = lazy(() => import('../page/AddressList'));
const SingleChat = lazy(() => import('../page/SingleChat'))


const Layout = () => {
    return (
        <div className='layout'>
            <div style={{flex:'1'}}>
                <Suspense fallback={null}>
                    <Outlet />
                </Suspense>
            </div>
            <Navigation />
        </div>
    )
}

export const router: RouteObject[] = [
    {
        path: '/Login',
        element: <Login />
    },
    {
        path: '/',
        element: <Layout />,
        children: [{
            path: 'Find',
            element: <Find />
        }, {
            path: 'Message',
            element: <Message />
        }, {
            path: 'AddressList',
            element: <AddressList />
        }, {
            path: 'SingleChat',
            element: <SingleChat />
        }]
    },
]



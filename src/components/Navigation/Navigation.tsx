import React, { useState } from 'react'
import { Badge, TabBar } from 'antd-mobile'
import './Navigation.css'
import {
  AppOutline,
  MessageOutline,
  MessageFill,
  UnorderedListOutline,
  UserOutline,
} from 'antd-mobile-icons'
import { router } from '../../router'
import {
  Outlet,
  useLocation, useNavigate,
} from 'react-router-dom'

const Navigation = () => {
  const tabs = [
    {
      key: '/message',
      title: '消息',
      icon: <AppOutline />,
      badge: Badge.dot,
    },
    {
      key: '/addressList',
      title: '通讯录',
      icon: <UnorderedListOutline />,
      badge: '5',
    },
    {
      key: '/find',
      title: '发现',
      icon: (active: boolean) =>
        active ? <MessageFill /> : <MessageOutline />,
      badge: '99+',
    },
    {
      key: '/Login',
      title: '登录',
      icon: <UserOutline />,
    },
  ]
  

  const [activeKey, setActiveKey] = useState('todo')
  const { pathname } = useLocation();
  const Navigate = useNavigate();
  const setRouteActive = (value: string) => {
    Navigate(value);
  }

  

  return (
      <TabBar
        activeKey={pathname}
        onChange={(value) => {
          setRouteActive(value)
        }}
      >
        {tabs.map(item => (
            <TabBar.Item
              key={item.key}
              icon={item.icon}
              title={item.title}
              badge={item.badge}  
            />
        ))}
      </TabBar>
  )
}

export default Navigation


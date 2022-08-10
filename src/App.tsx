
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { getMessageRequest } from './api/longPoll';
import { router } from './router';
import { accountSlice } from './store/accountSlice';


function App() {
  const navigate = useNavigate();
    const {put} = accountSlice.actions;
    const dispatch = useDispatch();
    useEffect(()=> {
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');
        if(!username || !token){
          //当直接进入Login会发生什么事
            navigate('/Login')
        }else {
          dispatch(put({username,token}))
          getMessageRequest('/getMessage');
        }
    },[])

  return (
    <div className="App">
      {useRoutes(router)}
    </div>
  );
}

export default App;

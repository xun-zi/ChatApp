import { Button, Form, Input } from "antd-mobile"
import { useState } from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Login } from "../../api"
import { accountSlice } from "../../store/accountSlice";
import './index.scss'



export default function () {

  const [account,setAccount] = useState('1228304333');
  const [password,setPassword] = useState('小马');
  const navigate = useNavigate();
  const {put} = accountSlice.actions;
  const dispatch = useDispatch();
  const handle = async () => {
    const data = await Login(account,password)
     if(data.state){
        dispatch(put({
          username:account,
          token:data.token,
        }))
        console.log('登录')
        navigate('/')
     }
  }
  return (
    <div className="Login">
      <input value={account} onChange={(e) => {setAccount(e.target.value)}} placeholder="账号"></input>
      <input value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="密码"></input>
      <Button block color='primary' size='large' onClick={() => {handle() }}>
        登录
      </Button>
    </div>
  )
}
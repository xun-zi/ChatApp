import { Button, Form, Input } from "antd-mobile"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { Login } from "../../api"
import './index.scss'



export default function () {

  const [account,setAccount] = useState('1228304333');
  const [password,setPassword] = useState('小马');
  const navigate = useNavigate();
  const handle = async () => {
     if(await Login(account,password)){
        console.log('登录')
        navigate('/message')
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
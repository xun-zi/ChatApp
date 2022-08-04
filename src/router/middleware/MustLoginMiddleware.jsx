import { Middleware } from 'oh-router'
import  {router}  from '..'

export class MustLoginMiddleware extends Middleware {
  handler = async (ctx, next) => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      // 已登录则放行
      await next()
    } else {
      // 没登陆前往登陆
      router.navigate('/Login')
      // alert('请登录')
    }
  }

  register = ({ to }) => {
    // 如果 path 不是 '/login' 则为当前路由注册该中间件
    return to.pathname !== '/Login'
  }
}
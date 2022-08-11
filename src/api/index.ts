import { friendData } from "../indexedb/dbType";
import Ajax from "./public/ajax";


export async function Login(username:string,password:string){
        const {state,token} = (await Ajax('/Login',{username,password})).data
        if(!state)return false;
        localStorage.setItem('token',token);
        localStorage.setItem('username',username)
        return true;
}

export async function getPresonDate(id:string):Promise<friendData>{
    const data = (await Ajax(`/data/${id}`)).data
    
    return data;
}

export async function SendMessage(target:number,data:{time:number,message:string},username:string,token:string){
    return (await Ajax('/send',{
        verifyData:{
            username,
            token,
        },
        target,
        data,
    },'POST')).data;
}
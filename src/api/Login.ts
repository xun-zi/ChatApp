import Ajax from "./public/ajax";


export default async function(username:string,password:string){
    const {state,token} = (await Ajax('/Login',{username,password})).data
    if(res){
        // localStorage.setItem('token',res.token);
        if(res.state)return false;
        console.log(res);
        localStorage.setItem('token',token);
        return true;
    }
}
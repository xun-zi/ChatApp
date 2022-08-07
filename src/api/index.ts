import Ajax from "./public/ajax";


export async function Login(username:string,password:string){
    const {state,token} = (await Ajax('/Login',{username,password})).data
        // localStorage.setItem('token',res.token);
        // console.log(state)
        if(!state)return false;
        localStorage.setItem('token',token);
        localStorage.setItem('username',username)
        return true;
}

export async function getPresonDate(id:string) {
    const data = (await Ajax(`/data/${id}`)).data
    return data;
}
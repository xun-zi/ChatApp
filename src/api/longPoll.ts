
const baseURL = 'http://127.0.0.1:8080'

export default async function getMessageRequest(url: string,func:Function) {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const response = await fetch(`${baseURL}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            username,
            token,
        })
    })
    if(response.ok){
        const data = response.json();
        func(data);
    }else{
        getMessageRequest(url,func);
    }
}
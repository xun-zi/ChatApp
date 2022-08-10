import { singleDataObject, subscribeDataToSingleData } from "../dataDeformation/dateDeformation"
import { addsingle, getMessage, putFriend, putMessage } from "../indexedb"
import { IdMessage, singleData } from "../indexedb/dbType"
import { put } from "../indexedb/public"
import Ajax from "./public/ajax"

const baseURL = 'http://127.0.0.1:8080'
export type subscribeData = {
    [uuid:number]:{
      time:number
      message:string  
    }[]
}
export type subscriber = (data:singleDataObject) => void;
const subscriber = new Set<subscriber>()
export  async function getMessageRequest(url: string) {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const response = await Ajax(url,{
        username,
        token,
    });
    

    if(response.status === 200){
        const _data = response.data as {[uuid:string]:[{
            time:number;
            message:string;
        }]};

        console.log(_data)

        const data = subscribeDataToSingleData(_data);

        for(const key in data){
            const data_1 = data[key];
            for(const value of data_1){
                await addsingle(+key,value);
            }
            if(data_1.length){
                const [val] = data_1.slice(-1);
                const val1 = await getMessage(+key);
                await putMessage({
                    uuid:+key,
                    message:val.message?.at(-1)?.message || '系统错误',
                    time:val.time,
                    bell:val1 ? val1.bell + 1 : 1,
                });
            }
        }

        //将消息存入indexeddb
        subscriber.forEach((fn) => {
             fn(data);
        })
        getMessageRequest(url);
    }else{
        setTimeout(()=>{
            getMessageRequest(url);
        },1000)
    }
}


export function subscribeFn(fn:subscriber){
    subscriber.add(fn)
}

export function subscribeDelete(fn:subscriber){
    subscriber.delete(fn)
}
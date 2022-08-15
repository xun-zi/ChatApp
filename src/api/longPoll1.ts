import Ajax from "./public/ajax";


const subscriber = new Map<string,Set<Function>>();

type addFriendFunction = (uuid:string) => any
subscriber.set('addFrinedRequest',new Set<addFriendFunction>)

//长轮询
export async function longPoll(url:string,data = {}){
    const responce = await Ajax(url,data);
    if(responce.status === 200){
        const data = responce.data;
        resolveSubscriber(data);
        longPoll(url,data);
    }else{
        setTimeout(()=>{
            longPoll(url,data);
        },1000)
        console.log('本地连接外部有问题');
    }
}
//data
export function resolveSubscriber(_data:any){
    if(_data.identify && subscriber.has(_data.identify)){
        const subscr = subscriber.get(_data.identify);
        const data:any = _data.data;
        subscr?.forEach((fn) => {
            fn(data);
        })
    }else{
        console.log('发送了一个没有标识符或者标识符为没有订阅者的数据')
    }
}

export function addSubscribeSelect(identify:string,set:Set<Function>){
    subscriber.set(identify,set);
}

export function subscribeFn(identify:string,fn:Function){
    subscriber.get(identify)?.add(fn);
}

export function subscriberDelete(identify:string,fn:Function){
    subscriber.get(identify)?.delete(fn);
}
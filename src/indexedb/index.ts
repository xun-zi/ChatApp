import { resolve } from "path";
import { add, deleteDb, getAll, getAllToMap, getByKey, getStore, put, StoreData } from "./public";
let db: IDBDatabase | undefined;
export function getDb() {
    const username = localStorage.getItem('username')
    if (!username) {
        console.log('username不存在');
        return;
    }
    if (db) return Promise.resolve(db);
    const require = indexedDB.open(username, 1);
    require.onsuccess = function (event) {
        db = require.result;
        return Promise.resolve(db)

    }

    require.onerror = function (event) {
        console.log('数据库打开失败');
    }

    require.onupgradeneeded = function (event) {
        db = require.result;
        const messagePage = db.createObjectStore('messagePage', {
            keyPath: 'uuid',
        })
        messagePage.createIndex('uuid', 'uuid', { unique: true })
        messagePage.add({
            uuid: 0,
            message: '',
            bell: '',
            next: -1,
            pre: -1,
        });
        messagePage.add({
            uuid: -1,
            message: '',
            bell: '',
            next: 0,
            pre: 0,
        });
        const friendData = db.createObjectStore('friendData', {
            keyPath: 'uuid'
        })
        friendData.createIndex('uuid', 'uuid', { unique: true })
        const singleData = db.createObjectStore('singleData', {
            keyPath: 'index',
            autoIncrement: true
        })
        singleData.createIndex('index', 'index')
        singleData.createIndex('uuid', 'uuid', { unique: false });
    }
}


export async function puTfriendData(data: { uuid: string | number }) {
    const db = await getDb();
    // console.log(db)
    // store.put(data);
    if (!db) console.log('数据库未被打开')
    const store: [IDBDatabase, string] = [db as IDBDatabase, 'friendData'];
    put(store, data)
}

export type MessageData = {
    uuid: number;
    message: string;
    bell: Number;
    pre: number;
    next: number;
}

export type MessageList = {
    uuid:number
    message:string;
    bell:Number;
}

async function getMessagestore(): Promise<[IDBDatabase, string]> {
    const db = await getDb();
    if (!db) console.log('数据库未被打开')
    return [db as IDBDatabase, 'messagePage']
}


async function NodeDelete(key:number) {
    if(key === -1 || key === 0)return;
    let store = await getMessagestore();
    const midddleNode = await getByKey(store,key) as MessageData;
    if(!midddleNode)return;
    const pre = await getByKey(store,midddleNode.pre) as MessageData;
    const end = await getByKey(store,midddleNode.next) as MessageData;
    pre.next = end.uuid;
    end.pre = pre.uuid;
    await put(store,pre);
    await put(store,end);
    await deleteDb(store,key);
}

export async function adDMessageData(data: MessageData) {
    let store = await getMessagestore();
    let dummy = await getByKey(store, 0) as MessageData;
    
    const MessageData: MessageData = Object.assign({},data, { next: dummy.next, pre: 0 });
    await NodeDelete(data.uuid);
    dummy = await getByKey(store, 0) as MessageData;
    const second = await getByKey(store, dummy.next) as MessageData;

    second.pre = data.uuid;
    dummy.next = data.uuid;
    
    await put(store,dummy)
    await put(store,second);
    await put(store,MessageData)
}


export async function getAllMessageData(){
    const store = await getMessagestore();
    const Data = await getAllToMap(store);
    return Data
}



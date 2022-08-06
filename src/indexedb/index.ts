import { resolve } from "path";
import { friendData, MessageData, singleData, singleDataHead, singleDataNext, StoreData } from "./dbType";
import { add, deleteByIndex, deleteDb, getAll, getByKey, getStore, put } from "./public";
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
        //消息页聊天信息
        const messagePage = db.createObjectStore('messagePage', {
            keyPath: 'uuid',
        })
        messagePage.createIndex('uuid', 'uuid', { unique: true })
        messagePage.createIndex('time', 'time', { unique: false })
        //朋友基本数据
        const friendData = db.createObjectStore('friendData', {
            keyPath: 'uuid'
        })
        friendData.createIndex('uuid', 'uuid', { unique: true })

        //单聊页信息
        const singleData = db.createObjectStore('singleData', {
            keyPath: 'index',
            autoIncrement: true
        })
        singleData.createIndex('index', 'index')
        singleData.createIndex('uuid', 'uuid', { unique: false });
        singleData.add({
            index: 0,
            length: 1,
        })
    }
}

async function getStoreData(storeName: string): Promise<StoreData> {
    const db = await getDb();
    if (!db) console.log('数据库未被打开')
    return [
        db as IDBDatabase,
        storeName,
    ]
}
//消息页
async function messagePageStoreData(): Promise<StoreData> {
    return await getStoreData('messagePage');
}

export async function addMessage(data: MessageData) {
    const store = await messagePageStoreData();
    put(store, data);
}

export async function getMessage() {
    const store = await messagePageStoreData();
    return (await getAll(store) as MessageData[]).sort((a,b) => {
        return a.time - b.time;
    })
}

//朋友页
async function friendStoreData() {
    return await getStoreData('friendData');
}

export async function putfriend(data: friendData) {
    const store = await friendStoreData();
    put(store, data);
}

export async function getFriend(key: number) {
    const store = await friendStoreData();
    return await getByKey(store, key);
}

export async function getAllFriend() {
    const store = await friendStoreData();
    return await getAll(store);
}

//单聊页
async function singleStoreData() {
    return await getStoreData('singleData')
}

async function singleHeadData():Promise<singleDataHead>{
    const store = await singleStoreData();
    const head = (await getByKey(store, 0)) as singleDataHead;
    return head;
}

export async function addsingle(uuid: number, data: singleData) {
    const store = await singleStoreData();
    const head = (await getByKey(store, 0)) as singleDataHead;
    if (!head[uuid]) {
        head[uuid] = head.length++;
        put(store,head);
        await add(store, {
            index: head[uuid],
            next: -1,
            data,
        })
    } else {
        let headData = await getByKey(store, head[uuid]) as singleDataNext;
        if (data.time - headData.data.time <= 1000 * 5) {
            headData.data.message = [...headData.data.message, ...data.message]
            put(store, headData);
        } else {
            console.log(headData.data.time);
            await add(store, {
                index: head.length,
                data,
                next: head[uuid],
            })
            head[uuid] = head.length++;
            put(store,head);
        }
    }
}

export async function singleOpenCursor(uuid:number) {
    let cursor = (await singleHeadData())[uuid];
    const store = await singleStoreData()
    if(!cursor)return false;
    return async function (){
        const list:singleData[] = [];
        while(cursor != -1){
            let data = await getByKey(store,cursor) as singleDataNext;
            list.push(data.data);
            cursor = data.next;
        }
        return list
    }
}


import { resolve } from "path";
import { friendData, MessageData, singleData, singleDataHead, singleDataNext, StoreData } from "./dbType";
import { add, deleteByIndex, deleteDb, getAll, getByKey, getStore, put } from "./public";
let db: IDBDatabase | undefined;
export async function getDb() {
    const username = localStorage.getItem('username')
    if (!username) {
        console.log('username不存在');
        return;
    }
    if (db) return Promise.resolve(db);
    return new Promise((resolve) => {
        const require = indexedDB.open(username, 1);
        require.onsuccess = function (event) {
            db = require.result;
            return resolve(db)
        }

        require.onerror = function (event) {
            if (db) resolve(db);
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
    })
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

export async function putMessage(data: MessageData) {
    const store = await messagePageStoreData();
    put(store, data);
}

export async function getMessage(key: number): Promise<MessageData | undefined> {
    const store = await messagePageStoreData();
    return await getByKey(store, key) as MessageData | undefined
}



export async function getAllMessage() {
    const store = await messagePageStoreData();
    return (await getAll(store) as MessageData[]).sort((a, b) => {
        return a.time - b.time;
    })
}

//朋友页
async function friendStoreData() {
    return await getStoreData('friendData');
}

export async function putFriend(data: friendData) {
    const store = await friendStoreData();
    put(store, data);
}

export async function getFriend(key: number) {
    const store = await friendStoreData();
    return await getByKey(store, key);
}

export async function getAllFriend(): Promise<friendData[]> {
    const store = await friendStoreData();
    return await getAll(store);
}

//单聊页
async function singleStoreData() {
    return await getStoreData('singleData')
}

async function singleHeadData(): Promise<singleDataHead> {
    const store = await singleStoreData();
    const head = (await getByKey(store, 0)) as singleDataHead;
    return head;
}
let lock = false;
let queue: [number, singleData][] = [];
export async function addsingle(uuid: number, data: singleData) {
    if (lock) queue.push([uuid, data])
    lock = true;
    const store = await singleStoreData();
    const head = (await getByKey(store, 0)) as singleDataHead;
    if (!head[uuid]) {
        head[uuid] = head.length++;
        await put(store, head);
        await add(store, {
            index: head[uuid],
            next: -1,
            data,
        })
    } else {
        let headData = await getByKey(store, head[uuid]) as singleDataNext;
        if (data.time - headData.data.time <= 1000 * 5) {
            headData.data.message = data.message;
            await put(store, headData);
        } else {
            console.log(headData.data.time);
            await add(store, {
                index: head.length,
                data,
                next: head[uuid],
            })
            head[uuid] = head.length++;
            await put(store, head);
        }
    }
    lock = false;
    if (queue.length) {
        addsingle(...(queue.shift() as [number, singleData]));
    }
}

export async function singleOpenCursor(uuid: number) {
    let cursor = (await singleHeadData())[uuid];
    const store = await singleStoreData()
    if (!cursor) return false;
    const list: singleData[] = [];
    let len = 0;


    return async function (page: number) {
        while (cursor != -1 && len < page) {
            let singleDataNext = await getByKey(store, cursor) as singleDataNext;
            len += singleDataNext.data.message.length;
            list.push(singleDataNext.data);
            cursor = singleDataNext.next;
        }

        let cnt = 0;
        let data: singleData[] = [];
        let p = 0;
        for (let li of list) {
            if (cnt + li.message.length > page) {
                if (cnt != page) {
                    data.push({
                        time: li.time,
                        message: li.message.slice(0, page - cnt),
                    })
                    li.message = li.message.slice(page - cnt);
                    const _cnt = cnt;
                    cnt += page - _cnt;
                    len -= page - _cnt;
                }
                break;
            }
            data.push(li);
            len -= li.message.length;
            cnt += li.message.length;
            p++;
        }
        while (p--) list.shift()
        return data
    }
}


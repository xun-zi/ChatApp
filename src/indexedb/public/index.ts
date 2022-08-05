import { MessageData } from "..";

export type StoreData = [IDBDatabase,string];

export function getStore(db: IDBDatabase, storeName: string): IDBObjectStore {
    return db.transaction([storeName], 'readwrite').objectStore(storeName);
}

export function getAllToMap(Store:StoreData):Promise<Map<number,MessageData>> {
    return new Promise((resolve) => {
        const request = getStore(...Store).openCursor();;
        const map = new Map<number,MessageData>()
        request.onsuccess = function () {
            var cursor = request.result;
            if (cursor) {
                const data = cursor.value;
                map.set(data.uuid,data);
                cursor.continue();
            } else {
                return resolve(map);
            }
        }
    })
}

export function getAll(Store:StoreData):Promise<Array<any>>{
    return new Promise((resolve) => {
        const request = getStore(...Store).openCursor();;
        const list: any = [];
        request.onsuccess = function () {
            var cursor = request.result;
            if (cursor) {
                list.push(cursor.value);
                cursor.continue();
            } else {
                return resolve(list);
            }
        }
    })
}

export async function add(StoreData:StoreData, data: object) {
    const request = getStore(...StoreData).add(data);
    request.onsuccess = function () {
    }
    request.onerror = function () {
        console.log('加入失败')
    }
}

export async function put(storeData:StoreData, data: object) {
    
    const request = getStore(...storeData).put(data);

    request.onsuccess = function () {
    }
    request.onerror = function () {
        console.log('加入失败')
    }
}

export function onlyKeyAllData(Store: IDBObjectStore, indexName: string, indexValue: string) {
    return new Promise((resolve, reject) => {
        const list: any = [];
        const request = Store.index(indexName).openCursor(IDBKeyRange.only(indexValue));
        request.onsuccess = function () {
            var cursor = request.result;
            if (cursor) {
                list.push(cursor.value);
                cursor.continue();
            } else {
                return resolve(list);
            }
        }
    })
}


export function getByKey(StoreData:StoreData,key:number){
    // console.log(StoreData)
    return new Promise((resolve) => {
        const request = getStore(...StoreData).get(key);
        // console.log(request)
        request.onsuccess = function(){
            // console.log(request.result)
            resolve(request.result);
        }
        request.onerror = function(){
            console.log("getByKey失败")
        }
    })

}

export function deleteDb(StoreData:StoreData,key:number){
    const request = getStore(...StoreData).delete(key);

    request.onsuccess = function(){
    }

    request.onerror = function(){
        console.log('删除失败')
    }
}
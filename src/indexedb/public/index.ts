
import { singleData, singleDataNext, StoreData } from "../dbType";

export function getStore(db: IDBDatabase, storeName: string): IDBObjectStore {
    return db.transaction([storeName], 'readwrite').objectStore(storeName);
}

export async function add(StoreData:StoreData, data: object) {
    const request = getStore(...StoreData).add(data);
    request.onerror =  function () {
        console.log('加入失败')
    }
}

export async function put(storeData:StoreData, data: object) {
    const request = getStore(...storeData).put(data);
    request.onerror = function () {
        console.log('加入失败')
    }
}

export function getByKey(StoreData:StoreData,key:number){
    return new Promise((resolve) => {
        const request = getStore(...StoreData).get(key);
        request.onsuccess = function(){
            resolve(request.result);
        }
        request.onerror = function(){
            console.log("getByKey失败")
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

export function deleteDb(StoreData:StoreData,key:number){
    const request = getStore(...StoreData).delete(key);
    request.onerror = function(){
        console.log('删除失败')
    }
}

export function deleteByIndex(StoreData:StoreData,indexName:string,value:any){
    const request = getStore(...StoreData).index(indexName).openCursor(IDBKeyRange.only(value));
    request.onsuccess = function(){
        var cursor = request.result;
        if(cursor){
            const requestDelete = cursor.delete();
            requestDelete.onerror = function(){
                console.log('deleteByIndex 删除失败')
            }
            cursor.continue();
        }
    }
    request.onerror = function(){
        console.log('deleteByIndex 游标打开失败')
    }
}







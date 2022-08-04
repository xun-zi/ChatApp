const { resolve } = require("path/posix");


function createDB(dbName, storeName, version = 1, ...Indexnames) {
    if (Indexnames.length === 0) Indexnames = ['store'];

    return new Promise((resolve, reject) => {
        //  兼容浏览器
        var indexedDB =
            window.indexedDB ||
            window.mozIndexedDB ||
            window.webkitIndexedDB ||
            window.msIndexedDB;
        let db;
        // 打开数据库，若没有则会创建
        const request = indexedDB.open(dbName, version);
        // 数据库打开成功回调
        request.onsuccess = function (event) {
            db = event.target.result; // 数据库对象
            console.log("数据库打开成功");
            resolve(db);
        };
        // 数据库打开失败的回调
        request.onerror = function (event) {
            console.log("数据库打开报错");
        };
        // 数据库有更新时候的回调
        request.onupgradeneeded = function (event) {
            // 数据库创建或升级的时候会触发
            console.log("onupgradeneeded");
            db = event.target.result; // 数据库对象
            var objectStore;
            // 创建存储库
            objectStore = db.createObjectStore(storeName, {
                keyPath: Indexnames[0], // 这是主键
                autoIncrement: true // 实现自增
            });
            // 创建索引，在后面查询数据的时候可以根据索引查
            Indexnames.forEach((Indexname) => {
                objectStore.createIndex(Indexname, Indexname, { unique: false });
            });
        };
    });
}



class dbRequest {
    constructor(dbName, storeName) {
        this.store = ()=>{return this.getStore(dbName,storeName)}
    }

    async addData(data) {
        const request = this.store.add(data)
        request.onsuccess = function (event) {
            console.log('数据写入成功');
        }
        request.onerror = function (event) {
            console.log('数据夹菜失败');
        }
    }

    getDataAll() {
        return new Promise((resolve, reject) => {
            const request = this.store.openCursor();
            let list = [];
            request.onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor) {
                    // 必须要检查
                    list.push(cursor.value);
                    cursor.continue(); // 遍历了存储对象中的所有内容
                } else {
                    // console.log("游标读取的数据：", list);
                    resolve(list);
                }
            };
        })
    }

    getDataByKey(key) {
        return new Promise((resolve, reject) => {
            const request = this.store.get(key);

            request.onerror = function (event) {
                console.log("事务失败");
            };

            request.onsuccess = function (event) {
                console.log("主键查询结果: ", request.result);
                resolve(request.result);
            };
        })
    }

    getDb(dbName) {
        return new Promise((resolve, reject) => {
            let indexedDB =
                window.indexedDB ||
                window.mozIndexedDB ||
                window.webkitIndexedDB ||
                window.msIndexedDB;
            // 打开数据库，若没有则会创建
            const request = indexedDB.open(dbName, version);
            // 数据库打开成功回调
            request.onsuccess = function (event) {
                let db = event.target.result; // 数据库对象
                console.log("数据库打开成功");
                resolve(db);
            };
            // 数据库打开失败的回调
            request.onerror = function (event) {
                console.log("数据库打开报错");
            };
        })
    }

    async getStore(dbName,storeName){
        if(this.store)return this.store;
        if(this.store)return Promise.resolve(this.store);
        const db = await this.getDb(dbName)
        return db.transaction([storeName],'readwrite').objectStore(storeName);
    }
}

module.exports = {
    dbRequest,
    createDB
}
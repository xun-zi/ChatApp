

let dbMap = new Map();
function openDb(dbName, version = 1, store = []) {
  return new Promise((resolve, reject) => {
    //  兼容浏览器
    var indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;
    if(dbMap.get(dbName)){
      console.log('db存在')
      resolve(dbMap.get(dbName));
      return;
    }
    // 打开数据库，若没有则会创建
    const request = indexedDB.open(dbName, version);
    // 数据库打开成功回调
    request.onsuccess = function (event) {
      dbMap.set(dbName,event.target.result) ; // 数据库对象
      console.log("数据库打开成功");
      resolve(dbMap.get(dbName));
    };
    // 数据库打开失败的回调
    request.onerror = function (event) {
      console.log("数据库打开");
    };
    // 数据库有更新时候的回调
    request.onupgradeneeded = function (event) {
      // 数据库创建或升级的时候会触发
      console.log("onupgradeneeded");
      dbMap.set(dbName,event.target.result); // 数据库对象
      const db = event.target.result
      store.forEach(({storeName,indexnames}) => {
        var objectStore;
        // 创建存储库
        objectStore = db.createObjectStore(storeName, {
          keyPath: indexnames[0], // 这是主键
          autoIncrement: true // 实现自增
        });
        // 创建索引，在后面查询数据的时候可以根据索引查
        indexnames.forEach((Indexname) => {
          objectStore.createIndex(Indexname, Indexname, { unique: false });
        });
      })
    };
  });
}

class dbRequest {
  constructor(db, storeName) {
    // console.log('1',db)
    // console.log('2',db.transaction([storeName],'readwrite'))
    // console.log('3',db.transaction([storeName],'readwrite').objectStore(storeName))
    this.store = db.transaction([storeName],'readwrite').objectStore(storeName);
    this.db = db;
    this.putData = this.putData.bind(this)
    // console.log(this.store);
  }

  addData(data) {
    const request = this.store.add(data)
    request.onsuccess = (e) => {
      console.log('加入成功')
    }
    request.onerror = (e) => {
      console.log('加入失败',e.target.error)
    }
  }

  getDataByKey(key) {
    return new Promise((resolve, error) => {
      const request = this.store.get(key);

      request.onsuccess = (e) => {
        console.log('getDataByKey响应成功')
        return resolve(request.result);
      }

      request.onerror = (e) => {
        console.log('getDataByKey失败')
      }
    })
  }

  getAllData() {
    return new Promise((resolve, reject) => {
      const request = this.store.openCursor();
      const list = [];
      request.onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
          list.push(cursor.value);
          cursor.continue();
        } else {
          resolve(list);
        }
      }
      request.oncerror = (e) => {
        console.log('getAllData响应失败')
      }
    })
  }

  getDataByIndexAndValue(index, indexVal) {
    return new Promise((resolve, reject) => {
      const request = this.store.index(index).get(indexVal);
      request.onsuccess = (e) => {
        resolve(e.target.result);
      }
      request.onerror = (e) => {
        console.log('getDataByIndexAndValue失败')
      }
    })
  }

  getAllDataByIndexAndValue(index, indexVal) {
    console.log(1);
    return new Promise((resolve, reject) => {
      const request = this.store.index(index).openCursor(IDBKeyRange.only(indexVal));
      
      const list = [];
      request.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          list.push(cursor.value);
          cursor.continue();
        } else {
          resolve(list);
        }
      }
      request.onerror = () => {
        console.log('打开失败')
      }
    })
  }

  putData(data) {
    const request = this.store.put(data);
    request.onsuccess = (e) => {
      console.log('数据更新成功')
    }
    request.onerror = (e) => {
      console.log('数据更新失败')
    }
  }
}



module.exports = {
  openDb,
  dbRequest,
}
class DB {
  public db: any;
  public dbName = "webserveDb";
  public dbVersion = 1;
  public personStore = "configDB";
  // 创建indexedDB对象，兼容各种浏览器
  public indexedDB = (<any>window).indexedDB;
  constructor() {}
  loadTableData() {
    var trans = this.db.transaction(this.personStore, "readwrite");
    var store = trans.objectStore(this.personStore);
    var cursorRequest = store.openCursor();
    cursorRequest.onsuccess = function(e: any) {
      var cursor = e.target.result;
      if (cursor) {
        console.log(22, cursor.value);
        cursor.continue(); // 游标继续往下 搜索，重复触发 onsuccess方法，如果到到返回null
      }
    };
  }

  //打开数据库
  openIndexedDB(callback: Function | null) {
    var dbName = this.dbName;
    var dbVersion = this.dbVersion;
    var personStore = this.personStore;
    if (!this.indexedDB) {
      console.log("你的浏览器不支持IndexedDB");
      return;
    }

    // 打开一个数据库
    var request = this.indexedDB.open(dbName, dbVersion);

    // 打开失败
    request.onerror = function(e: any) {
      console.log(e.currentTarget.error.message);
    };

    // 打开成功！
    request.onsuccess = (e: any) => {
      this.db = e.target.result;
      console.log(this.db, "成功打开DB");
      // this.loadTableData();
      callback !== null ? callback() : false;
    };

    // 打开成功后，如果版本有变化自动执行以下事件
    request.onupgradeneeded = (e: any) => {
      this.db = e.target.result;
      if (!this.db.objectStoreNames.contains(personStore)) {
        console.log("我需要创建一个新的存储对象");
        //如果表格不存在，创建一个新的表格（keyPath，主键 ； autoIncrement,是否自增），会返回一个对象（objectStore）
        var objectStore = this.db.createObjectStore(personStore, {
          keyPath: "id",
          autoIncrement: true
        });

        //指定可以被索引的字段，unique字段是否唯一, 指定索引可以加快搜索效率。
        //   objectStore.createIndex("name", "name", {
        //     unique: true
        //   });
        //   objectStore.createIndex("phone", "phone", {
        //     unique: false
        //   });
      }
      console.log("数据库版本更改为： " + dbVersion);
    };
  }

  // 添加数据
  addPerson(projectData: any) {
    var personStore = this.personStore;
    if (!this.db) {
      return;
    }
    // 创建一个事务
    var transaction = this.db.transaction(personStore, "readwrite");

    // 通过事务来获取store
    var store = transaction.objectStore(personStore);
    //使用put，如果数据库中他的键值存在了，那就是修改，反之就是新增，也有添加的效果。但add就只有添加
    var addPersonRequest = store.put({
      id: projectData?.uuid||'test',
      ...projectData
    });
    addPersonRequest.onsuccess = function(e: any) {
      console.log("本地保存成功", e.target);
      //loadTableData(); // 添加成功后重新加载数据
    };
    addPersonRequest.onerror = function(e: any) {
      console.log(e.target.error);
    };
  }

  read(id: any, callback: Function) {
    console.log(4545, id, this.db);
    if (this.db !== undefined) {
      var transaction = this.db.transaction(this.personStore);
      var objectStore = transaction.objectStore(this.personStore);
      var request = objectStore.get(id?id:'test');

      request.onerror = function(event: any) {
        console.log("事务失败");
      };

      request.onsuccess = function(event: any) {
        if (request.result) {
          //  console.log('Name: ' + request.result.name);
          //  console.log('Age: ' + request.result.age);
          //  console.log('Email: ' + request.result.email);
          console.log("Email: " + request.result);
          // (<any>window).dataDB = JSON.parse(JSON.stringify(request.result));
          // pcObject.pageData = JSON.parse(JSON.stringify(request.result));
          callback !== null ? callback(request.result) : false;
        } else {
          console.log("未获得数据记录");
          callback !== null ? callback(false) : false;
        }
      };
    }
  }

  // 根据索引查值(若数据不存在，返回一个[]数组)
  // 对象仓库（表名）
  searchFromIndex(objectStoreName: any, index: any, data: any) {
    if (this.db != null) {
      console.log(this.db);

      // 执行事务，从对象仓库（表）中获取所有数据
      var request = this.db
        .transaction([objectStoreName], "readonly")
        .objectStore(objectStoreName)
        .index(index)
        .getAll(data);

      // 数据获取失败
      request.onerror = function(event: any) {
        console.log("事务失败");
      };

      //数据获取成功
      request.onsuccess = function(event: any) {
        if (request.result) {
          // 遍历打印所有数据
          console.log(request.result);
        } else {
          console.log("未获得数据记录");
        }
      };
    }
  }
}
export default DB;

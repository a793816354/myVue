(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// 1.提供model
// 2.修改model则通知vm更新
//     1.手动触发（setState）
//     2.自动触发（对象监听）
// 此处使用对象监听
const observer = require("./observer.js");
let vid = 1;

class Model {
  constructor(option) {
    this.vid = vid++;

    const { data } = option;
    this.data = data;
    observer.observe(this.vid, this.data);
  }
}

class Component extends Model {
  constructor(option) {
    super(option);
  }
}

const jane = new Component({
  data: {
    name: "jane",
    age: 20,
    frends: ["jack", "mike"],
    job: {
      compony: "bat",
      silar: 30,
    },
  },
});

const mike = new Component({
  data: {
    name: "mike",
    age: 27,
    frends: ["jane", "alem"],
    job: {
      compony: "tmd",
      silar: 40,
    },
  },
});

jane.data.age = 22;
jane.data.job.compony = "ms";
mike.data.job.silar = 35;

// 更新虚拟模板！
// 更新虚拟模板！
// 更新视图！
},{"./observer.js":2}],2:[function(require,module,exports){
const updater = require("./updater.js");

class Observer {
  observe(vid, data) {
    if (typeof data !== "object") return;

    for (const key in data) {
      // 遍历当前state的每个属性，修改其setter，getter
      if (Object.hasOwnProperty.call(data, key)) {
        // 外部获取值，若在getter内部获取则触发死循环

        let curVal = data[key]
        Reflect.defineProperty(data, key, {
          get: () => {
            return curVal;
          },
          set: (val) => {
            curVal = val
            // 通知vm更新视图
            updater.notify(vid);
          },
        });
      }
      // 递归操作，深度监听

      this.observe(vid, data[key]);
    }
  }
}

module.exports = new Observer();

},{"./updater.js":3}],3:[function(require,module,exports){
const { getUniqueQueue } = require("./utils/index.js");

class Updater {
  queue = [];
  /**
   * 1.不直接通知虚拟模板更新视图，而是先存入队列中
   * 2.同步代码执行完后才消费队列
   * 3.消费队列，对虚拟dom进行修改
   * 4.队列清空，则可以解析虚拟dom生成真实dom，修改视图了
   */
  notify(vid) {
    this.queue.push(vid);
    Promise.resolve().then(() => {
      this.update();
    });
  }

  update() {
    if (!this.queue.length) return;

    const uniqueQueue = getUniqueQueue(this.queue);
    while (uniqueQueue.length) {
      uniqueQueue.shift();
      // 消费队列，更新虚拟模板
      this.updateVm();
    }
    //清空任务队列
    this.queue = [];

    // 更新虚拟模板结束，开始更新视图
    this.updateView();
  }

  updateVm() {
    console.log("更新虚拟模板！");
  }

  updateView() {
    console.log("更新视图！");
  }
}

module.exports = new Updater();

},{"./utils/index.js":4}],4:[function(require,module,exports){
const getUniqueQueue = (arr) => {
  const result = [];
  const set = new Set();
  for (let index = 0; index < arr.length; index++) {
    const curId = arr[index];
    if (set.has(curId)) continue;
    set.add(curId);
    result.push(curId);
  }
  return result;
};

module.exports = {
  getUniqueQueue,
};

},{}]},{},[1]);

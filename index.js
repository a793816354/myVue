// 1.提供model
// 2.修改model则通知vm更新
//     1.手动触发（setState）
//     2.自动触发（对象监听）
// 此处使用对象监听

// 初始化各种参数
// 执行beforeCreate
// 初始化state
// 执行created
// 获取目标元素
// 执行beforeMount
// 添加监听Watcher（监听执行updateComponent）？
// Watcher构造器执行了一遍updateComponent，渲染组件
// 执行mounted

// observe：监听对象get，set，通知dep.notify
// dep：收集与改属性相关的组件，比如一个属性传给了三个组件，则都要收集起来
// watcher：每个dep的虚拟模板更新（推入队列，nextTick消费）

// 他们的关系：
// observe监听对象，对象中每个属性的get收集dep为列表，set则广播dep，使其执行watcher的update

const pug = require("pug");
const observer = require("./observer.js");
const updater = require("./updater.js");
const { execHook } = require("./utils/index");
const componentMap = require("./common/index");
let vid = 0;

const initLifecycle = function () {
  this.$children = [];
  this.$refs = {};

  this._watcher = null;
  this._inactive = null;
  this._directInactive = false;
  this._isMounted = false;
  this._isDestroyed = false;
  this._isBeingDestroyed = false;
};

const initRender = function () {
  const { template, data } = this.$options;
  this.template = template;
  // 编译这份代码
  this.render = pug.compile(template).bind(pug, data);
  this.renderHTML = "";
};

const initState = function () {
  // data, methods, props, computed, watch

  const { data } = this.$options;
  this.data = data;
  observer.observe(this.vid, this.data);
};

const execHook = function (hook) {
  console.log(hook);
};

class Vue {
  vid = vid++;
  _isVue = true;
  constructor(option) {
    componentMap.push(this);
    this.$options = option;
    initLifecycle.call(this);
    initRender.call(this);

    execHook.call(this, "beforeCreate");
    initState.call(this);
    execHook.call(this, "created");
    updater.notify(this.vid);
    execHook.call(this, "mounted");
  }
}

Vue.prototype.initLifecycle = function () {
  this._isMounted = false
}

class Component extends Vue {
  constructor(option) {
    super(option);
  }
}

const jane = new Component({
  data: {
    name: "jane",
    age: 20,
    friends: ["jack", "mike"],
    job: {
      compony: "bat",
      silar: 30,
    },
  },
  template: `p 姓名#{name}，年龄#{age}！`,
});

const mike = new Component({
  data: {
    name: "mike",
    age: 27,
    friends: ["jane", "alem"],
    job: {
      compony: "tmd",
      silar: 40,
    },
  },
  template: `p 工作#{job.compony}，工资#{job.silar}！`,
});

const input = document.getElementById("input");
input.addEventListener("input", (e) => {
  jane.data.name = e.target.value;
});

// 更新虚拟模板！
// 更新虚拟模板！
// 更新视图！

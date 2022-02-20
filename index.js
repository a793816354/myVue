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

// key:weather
// key:name
// 更新虚拟模板！
// 更新视图！
// 注意：因为以组件为单位渲染，所以队列中只有一次更新虚拟模板

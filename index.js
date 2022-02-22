// 1.提供model
// 2.修改model则通知vm更新
//     1.手动触发（setState）
//     2.自动触发（对象监听）
// 此处使用对象监听
const pug = require('pug');
const observer = require("./observer.js");
const updater = require("./updater.js");
const componentMap = require("./store/index");
let vid = 0;

class Model {
  constructor(option) {
    this.vid = vid++;
    componentMap.push(this)
    updater.notify(this.vid)


    const { data, template } = option;
    this.data = data;
    this.template = template;
    // 编译这份代码
    this.render = pug.compile(template).bind(pug, this.data);
    this.renderHTML = ''

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
    friends: ["jack", "mike"],
    job: {
      compony: "bat",
      silar: 30,
    },
  },
  template: `p 姓名#{name}，年龄#{age}！`
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
  template: `p 工作#{job.compony}，工资#{job.silar}！`
});

const input = document.getElementById("input")
input.addEventListener("input", (e) => {
  jane.data.friends = e.target.value
})


// 更新虚拟模板！
// 更新虚拟模板！
// 更新视图！
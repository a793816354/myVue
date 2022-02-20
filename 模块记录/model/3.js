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

class Model {
  id = 1;
  state = {};
  queue = [];
  constructor() {
    // defineProperty版本
    this.state = {
      weather: "sunny",
      profile: { name: "jane" },
    };
    this.observe(this.state);
  }

  observe(data) {
    if (typeof data !== "object") return;

    for (const key in data) {
      // 遍历当前state的每个属性，修改其setter，getter
      if (Object.hasOwnProperty.call(data, key)) {
        // 外部获取值，若在getter内部获取则触发死循环
        const value = data[key];
        Reflect.defineProperty(data, key, {
          get: () => {
            return value;
          },
          set: (val) => {
            console.log(`key:${key}`);
            // 通知vm更新视图
            this.notify(this.id);
          },
        });
      }
      // 递归操作，深度监听
      this.observe(data[key]);
    }
  }

  /**
   * 1.不直接通知虚拟模板更新视图，而是先存入队列中
   * 2.同步代码执行完后才消费队列
   * 3.消费队列，对虚拟dom进行修改
   * 4.队列清空，则可以解析虚拟dom生成真实dom，修改视图了
   */
  notify(id) {
    this.queue.push(id);
    // console.log(this.queue);
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

const model = new Model();
model.state.weather = "snow";
model.state.profile.name = "mary";

// key:weather
// key:name
// 更新虚拟模板！
// 更新视图！
// 注意：因为以组件为单位渲染，所以队列中只有一次更新虚拟模板

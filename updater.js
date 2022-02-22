const { getUniqueQueue } = require("./utils/index.js");
const componentMap = require("./store/index");

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
    let flag = false;

    const uniqueQueue = getUniqueQueue(this.queue);
    while (uniqueQueue.length) {
      // 消费队列，更新虚拟模板
      const vid = uniqueQueue.shift();
      const component = componentMap[vid];

      const oldHTML = component.renderHTML;
      this.updateVm(component);
      if (oldHTML !== component.renderHTML) flag = true;
    }
    //清空任务队列
    this.queue = [];

    // 更新虚拟模板结束，开始更新视图
    if (flag) this.updateView();
  }

  updateVm(component) {
    const { render } = component;
    // 渲染一组数据
    component.renderHTML = render();
    // "<p>李莉的 Pug 代码！</p>"
    console.log("更新组件模版！");
  }

  updateView() {
    // execHook.call(this, "beforeMount");

    const renderHTML = componentMap.map((item) => item.renderHTML).join("");
    try {
      const target = document.getElementById("vue");
      target.innerHTML = renderHTML;
    } catch (error) {}
    console.log("更新视图！");
  }
}

module.exports = new Updater();

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

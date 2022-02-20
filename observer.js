const updater = require("./updater.js");

class Observer {
  observe(vid, data) {
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

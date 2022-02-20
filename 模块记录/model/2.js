class Model {
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
            this.notifyVmUpdate();
          },
        });
      }
      // 递归操作，深度监听
      this.observe(data[key]);
    }
  }

  notifyVmUpdate() {
    console.log("触发视图更新!");
  }
}

const model = new Model();
model.state.weather = "snow";
model.state.profile.name = "mary";

// key:weather
// 触发视图更新!
// key:name
// 触发视图更新!

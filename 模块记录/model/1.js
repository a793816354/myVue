// 1.提供model
// 2.修改model则通知vm更新
//     1.手动触发（setState）
//     2.自动触发（对象监听）
// 此处使用对象监听

class Model {
  constructor() {
    // defineProperty版本
    this.state = {
      weather: "sunny",
      profile: { name: "jane" },
    };
    for (const key in this.state) {
      // 遍历当前state的每个属性，修改其setter，getter
      if (Object.hasOwnProperty.call(this.state, key)) {
        // 外部获取值，若在getter内部获取则触发死循环
        const value = this.state[key];
        Reflect.defineProperty(this.state, key, {
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

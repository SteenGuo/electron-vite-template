import router from "./router";
import Performance from "@/utils/performance";

let end: any = null;
router.beforeEach((to, from, next) => {
  end = Performance.startExecute(`${from.path} => ${to.path} 路由耗时`); /// 路由性能监控
  next();
  setTimeout(() => {
    end();
  }, 0);
});

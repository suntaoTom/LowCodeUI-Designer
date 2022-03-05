/**
 * main组件名称
 *@desc 用于跨域调用接口，运行时，只需调用相应的接口名即可；打包编译无需注释代码，及其他操作
 *@author Tommy
 *@date 2018.8.31
 *@param  -
 *@example 调用示例,title就是调试的接口名
 *   import title from './main'
 */
let title = "";

if (process.env.NODE_ENV === "production") {
  // 不要动它
  title = "http://192.168.18.41:8007"; // 不要动它
} else {
  title = "http://192.168.1.190:8007"; // 可直接替换成相应请求地址进行调试
}
export let serverModuleApi="http://localhost:8081"  //服务组件地址
export default title;

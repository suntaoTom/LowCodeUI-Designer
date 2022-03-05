<template>
  <ul class="lcu_rightMenu" ref="lcu_rightMenu" style="width:70px;">
    <li class="lcu_rightMenu_li">删除</li>
    <li class="lcu_rightMenu_rename">重命名</li>
  </ul>
  <ul class="lcu_rightMenu" ref="lcu_rightElement" style="width:70px;">
    <li class="lcu_rightMenu_del_Element">删除</li>
    <li class="lcu_rightMenu_rename_Element">重命名</li>
  </ul>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "tool",
  components: {},
  props: {}
})
export default class tool extends Vue {
  private position: any = null;
  conTextMenu() {
    let _self = this;
    document.documentElement.oncontextmenu = function(e) {
      let a: any = e.target;
      _self.position = a.getAttribute("index");
      if (
        a.className === "lcu_app_lication_name" ||
        a.className === "lcu_app_lication_name lcu_select" ||
        a.className === "lcu_app_right_content_cur"
      ) {
        let rm: any = null;
        _self.position = a.getAttribute("index");
        if (a.className === "lcu_app_right_content_cur") {
          rm = _self.$refs.lcu_rightElement;
        } else {
          rm = _self.$refs.lcu_rightMenu;
        }
        //显示我们自己定义的右键菜单
        //1.找到菜单
        //提取到函数外面作为全局变量
        //兼容Event对象
        e = e || window.event;
        //2.设置菜单的位置等于鼠标的坐标
        //判断：如果鼠标的位置+菜单的宽度>网页的宽度，那么就改为右边定位
        //鼠标坐标
        var mx = e.clientX;
        var my = e.clientY;
        //菜单宽度
        var rmWidth = parseInt(rm.style.width);
        //网页的宽度(高度用同样的方法解决)
        var pageWidth = document.documentElement.clientWidth;
        //console.log(pageWidth);
        if (mx + rmWidth < pageWidth) {
          rm.style.left = mx + "px";
          rm.style.top = my + "px";
        } else {
          rm.style.right = mx + "px";
          rm.style.top = my + "px";
        }
        //3.显示右键菜单
        rm.style.display = "block";
        document.onmousedown = function(e) {
          let a: any = e.target;
          if (a.className === "lcu_rightMenu_li") {
            let c: any = e.target;
            let d: any = _self.$parent;
            let b = d.appInfo[_self.position];
            console.log(2323, JSON.stringify(b));
            d.appDelete(b);
          } else if (a.className === "lcu_rightMenu_rename") {
            let d: any = _self.$parent;
            d.reNameIndex = parseInt(_self.position);
          } else if (a.className === "lcu_rightMenu_del_Element") {
            let c: any = e.target;
            let d: any = _self.$parent;
            let b = d.pageArray[_self.position];
            console.log(2323, JSON.stringify(b));
            d.pageDelete(b);
          } else if (a.className === "lcu_rightMenu_rename_Element") {
            let d: any = _self.$parent;
            d.reNameElementIndex = parseInt(_self.position);
          } else {
            if (a.className !== "lcu_edit") {
              let d: any = _self.$parent;
              // if (d.reNameIndex !== "" || d.reNameElementIndex !== "") {

              //   d.reNameIndex = "";
              //   d.reNameElementIndex = "";
              // }
              d.reNameIndex = "";
              d.reNameElementIndex = "";
            }
          }
          rm.style.display = "none";
        };
        //阻止默认的右键菜单显示
        return false;
      }
    };
  }
  // copydataEle(data: any) {
  //   let z: any = this.$parent;
  //   const input = document.createElement("input");
  //   document.body.appendChild(input);
  //   input.setAttribute("value", data);
  //   input.select();
  //   if (document.execCommand("copy")) {
  //     document.execCommand("copy");
  //   }
  //   document.body.removeChild(input);
  // }
  mounted() {
    this.conTextMenu();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.lcu_rightMenu {
  list-style: none;
  background: white;
  border: solid 1px darkgrey;
  margin: 0px;
  padding: 0px;
  left: 0px;
  top: 0px;
  right: 0px;
  display: none;
  position: fixed;
  z-index: 99999;
  cursor: pointer;
  font-size: 12px;
}
.lcu_rightMenu li {
  border-bottom: solid 1px darkgrey;
}
.lcu_rightMenu li:hover {
  background-color: #d4d6d8;
}
</style>

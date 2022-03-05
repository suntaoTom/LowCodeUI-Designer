<template>
  <ul class="lcu_rightMenu" ref="lcu_rightMenu" style="width:70px;">
    <li class="lcu_rightMenu_li">复制</li>
  </ul>
  <ul class="lcu_rightMenu" ref="lcu_rightElement" style="width:70px;">
    <li class="lcu_rightMenu_collect">收藏</li>
  </ul>
  <ul class="lcu_rightMenu" ref="lcu_rightPerson" style="width:70px;">
    <li class="lcu_rightMenu_del">删除</li>
  </ul>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import DesignStore from "@/store/modules/design";
import LoginStore from "@/store/modules/login";

@Options({
  name: "tool",
  components: {},
  props: {}
})
export default class tool extends Vue {
  private position: any = null;
  private type = 0;
  conTextMenu() {
    let _self: any = this;
    document.documentElement.oncontextmenu = function(e) {
      let k: any = _self.$parent.$refs.componentlibrary;
      console.log(2424, k);
      _self.type = parseInt(k.addElement);
      let a: any = e.target;
      if (
        a.className === "lcu_curs" ||
        a.className === "lcu_element_content_ele_curs"
      ) {
        let rm: any = null;
        if (a.className === "lcu_curs") {
          rm = _self.$refs.lcu_rightMenu;
          _self.position = a.getAttribute("index");
        } else if (
          a.className === "lcu_element_content_ele_curs" &&
          _self.type === 3
        ) {
          rm = _self.$refs.lcu_rightPerson;
          _self.position = a.getAttribute("data");
        } else {
          rm = _self.$refs.lcu_rightElement;
          _self.position = a.getAttribute("data");
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
        document.onmousedown = async function(e) {
          let a: any = e.target;
          if (a.className === "lcu_rightMenu_li") {
            let c: any = e.target;
            let d: any = _self.$parent;
            let b = d.dataEle.elements[_self.position];
            console.log(2323, JSON.stringify(b));
            _self.copydataEle(JSON.stringify(b));
          } else if (a.className === "lcu_rightMenu_collect") {
            console.log(233, Object.keys(JSON.parse(_self.position))[0]);
            let key = Object.keys(JSON.parse(_self.position))[0];
            //let c: any = _self.$route.query;
            let b: any = LoginStore.personInfo;
            await DesignStore.getPersonRule({
              user_id: b.id
            });
            console.log(33, DesignStore.personRules);
            let jsonB: any =
              Object.keys(DesignStore.personRules).length === 0
                ? DesignStore.personRules
                : JSON.parse(DesignStore.personRules);

            if (jsonB[key] === undefined) {
              jsonB[key] = JSON.parse(_self.position)[key];
              await DesignStore.setPersonRule({
                rule: JSON.stringify(jsonB),
                user_id: b.id
              });
              console.log(999, jsonB);
            } else {
              alert("此组件已收藏");
            }
          } else if (a.className === "lcu_rightMenu_del") {
            let l = Object.keys(JSON.parse(_self.position))[0];
            let g = JSON.parse(JSON.stringify(DesignStore.assemblyData));
            console.log(2323, g, l);
            let b: any = LoginStore.personInfo;
            delete g[l];
            console.log(3434, g);
            await DesignStore.setPersonRule({
              rule: JSON.stringify(g),
              user_id: b.id
            });
            await DesignStore.setAssembly({
              user_id: b.id,
              element_type: _self.type,
              thisObj: k
            });
          }
          rm.style.display = "none";
        };
        //阻止默认的右键菜单显示
        return false;
      }
    };
  }
  copydataEle(data: any) {
    let z: any = this.$parent;
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.setAttribute("value", data);
    input.select();
    if (document.execCommand("copy")) {
      document.execCommand("copy");
    }
    document.body.removeChild(input);
  }
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

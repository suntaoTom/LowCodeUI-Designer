<template>
  <div class="in-coder-panel">
    <textarea v-model="code" ref="textarea"></textarea>
    <!-- <el-select class="code-mode-select" v-model="mode" @change="changeMode">
      <el-option
        v-for="mode in modes"
        :key="mode.value"
        :label="mode.label"
        :value="mode.value"
      >
      </el-option>
    </el-select> -->
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
// 引入全局实例
import CodeMirror from "codemirror";

// 核心样式
import "codemirror/lib/codemirror.css";
// 引入主题后还需要在 options 中指定主题才会生效
// import "codemirror/theme/cobalt.css";
// import "codemirror/theme/idea.css";
import "codemirror/theme/panda-syntax.css";

// 需要引入具体的语法高亮库才会有对应的语法高亮效果
// codemirror 官方其实支持通过 /addon/mode/loadmode.js 和 /mode/meta.js 来实现动态加载对应语法高亮库
// 但 vue 貌似没有无法在实例初始化后再动态加载对应 JS ，所以此处才把对应的 JS 提前引入
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/css/css.js";

require("codemirror/lib/codemirror");
//tab补全代码（这里暂时有问题，待解决？）
// import "codemirror/addon/hint/show-hint.css";
// import "codemirror/addon/hint/show-hint.js";
// import "codemirror/addon/hint/anyword-hint.js";
//代码折叠
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/comment-fold.js";

//全屏
import "codemirror/addon/display/fullscreen.css";
import "codemirror/addon/display/fullscreen.js";

import FunctionCode from "./functionCode";
// import "codemirror/mode/xml/xml.js";
// import "codemirror/mode/clike/clike.js";
// import "codemirror/mode/markdown/markdown.js";
// import "codemirror/mode/python/python.js";
// import "codemirror/mode/r/r.js";
// import "codemirror/mode/shell/shell.js";
// import "codemirror/mode/sql/sql.js";
// import "codemirror/mode/swift/swift.js";
// import "codemirror/mode/vue/vue.js";

// 尝试获取全局实例
//const CodeMirror = window.CodeMirror || _CodeMirror;

@Options({
  emits: {},
  components: {},
  props: {
    // 外部传入的内容，用于实现双向绑定
    value: String,
    // 外部传入的语法类型
    language: {
      type: String,
      default: null
    }
  },
  watch: {
    value: [{ handler: "valueApies", immediate: false, deep: false }]
  }
})
export default class IdeComponent extends Vue {
  private code = "";
  private coder: any = null;
  private options: any = {
    mode: "javascript",
    // 缩进格式
    tabSize: 2,
    // 主题，对应主题库 JS 需要提前引入
    theme: "panda-syntax",
    // 显示行号
    lineNumbers: true,
    line: true,
    matchBrackets: true,
    //代码折叠
    foldGutter: true,
    lineWrapping: true,
    gutters: [
      "CodeMirror-linenumbers",
      "CodeMirror-foldgutter",
      "CodeMirror-lint-markers"
    ],
    //全屏
    // fullScreen: true
    // hintOptions: {
    //   completeSingle: false,
    //   alignWithWord: false,
    //   hint: this.getHints.bind(this)
    // }
    extraKeys: {
      F11: function(cm: any) {
        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
      },
      Esc: function(cm: any) {
        if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
      }
    }
  };
  private selection: any = { from: {}, to: {} };
  private hintFunctionCode: any = [];
  private hintColumnCode: any = [];

  apiValueApies(newV: any, oldV: any) {
    if (newV !== oldV) {
      this.code = newV;
    }
  }

  addIcon(data: any, type: any, name: any) {
    // 给 hint 添加类型 icon
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      let nativeItem = {
        text: data[i].code,
        displayText: data[i].name,
        className: "",
        render: (elt: any, self: any, data: any) => {
          let compEle = document.createElement("div");
          compEle.innerHTML = `<span class="iconfont icon-${type}" style='color: red;'></span>  ${data.displayText}`;
          elt.appendChild(compEle);
        }
      };
      let a: any = this;
      a[name].push(nativeItem);
    }
  }

  hintCode() {
    return [].concat(this.hintFunctionCode, this.hintColumnCode);
  }
  getHints(cm: any, option: any) {
    let a: any = this.hintCode();
    return new Promise(accept => {
      setTimeout(() => {
        let WORD = /[\w\[\]\"\.$]+/;
        let cursor = cm.getCursor(),
          curLine = cm.getLine(cursor.line);
        let start = cursor.ch,
          end = cursor.ch;
        while (start && WORD.test(curLine.charAt(start - 1))) {
          --start;
        }
        let curWord = start != end && curLine.slice(start, end);
        let list: any = [],
          isDefinedObj = false;
        if (curWord) {
          if (list.length === 0) {
            var dotIndex = curWord.lastIndexOf("."),
              memberStr = curWord.slice(dotIndex + 1),
              comList: any = [];
            comList = a;
            for (let j = 0; j < comList.length; j++) {
              if (
                comList[j].displayText
                  .toLowerCase()
                  .lastIndexOf(memberStr.toLowerCase(), 0) === 0
              ) {
                list.push(comList[j]);
              }
            }
            isDefinedObj = true;
          }
        }
        if (isDefinedObj) {
          return accept({
            list: list,
            from: CodeMirror.Pos(cursor.line, start),
            to: CodeMirror.Pos(cursor.line, end)
          });
        } else {
          return accept({
            list: list,
            from: CodeMirror.Pos(cursor.line, start + 1),
            to: CodeMirror.Pos(cursor.line, end)
          });
        }
      }, 100);
    });
  }
  refresh(cou: any) {
    let pos1 = this.coder.getCursor();
    let pos2: any = {};
    pos2.line = pos1.line;
    pos2.ch = pos1.ch;
    this.coder.replaceRange(cou, pos2);
  }

  _initialize() {
    // 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置
    let a: any = this.$refs;
    this.coder = CodeMirror.fromTextArea(a.textarea, this.options);
    // 编辑器赋值
    //this.coder.setValue("eewe  12  1231 2131312312414324141241");
    // 支持双向绑定
    this.coder.on("change", () => {
      let a: any = this.$parent;
      this.code = this.coder.getValue();
      a.cont = this.coder.getValue();
      console.log(11, this.coder.getValue());
      //   if (this.$emit) {
      //     this.$emit("input", this.code);
      //   }
    });

    // this.coder.on("cursorActivity", (cm: any) => {
    //   console.log(4, this.coder.showHint);
    //   this.coder.showHint();
    //   this.selection.to = cm.getCursor();
    //   if (this.coder.getSelection().length === 0) {
    //     this.selection.from = cm.getCursor();
    //   }
    // });
    // this.coder.on("inputRead", () => {
    //   this.coder.showHint();
    // });

    // this.coder.on("cursorActivity", function(e: any) {
    //   debugger;
    //   var line = e.doc.getCursor().line, //Cursor line
    //     ch = e.doc.getCursor().ch, //Cursor character
    //     stringToMatch = "color:",
    //     n = stringToMatch.length,
    //     stringToTest = e.doc.getLine(line).substr(Math.max(ch - n, 0), n);

    //   if (stringToTest == stringToMatch) console.log("SUCCESS!!!");
    // });
    //   // 尝试从父容器获取语法类型
    //   if (this.language) {
    //     // 获取具体的语法类型对象
    //     let modeObj = this._getLanguage(this.language)

    //     // 判断父容器传入的语法是否被支持
    //     if (modeObj) {
    //       this.mode = modeObj.label
    //     }
    //   }
  }
  created() {
    let a: any = this.$props;
    this.code = a.value;
  }
  mounted() {
    this._initialize();
    //this.addIcon(FunctionCode, "function", "hintFunctionCode");
  }
}
</script>

<style lang="scss">
.in-coder-panel {
  height: 71%;
  flex-grow: 1;
  display: flex;
  position: relative;
  text-align: left;
}

.CodeMirror {
  flex-grow: 1;
  z-index: 1;
  height: 100%;
}

.CodeMirror-code {
  line-height: 19px;
}
textarea {
  line-height: 19px;
}

.code-mode-select {
  position: absolute;
  z-index: 2;
  right: 10px;
  top: 10px;
  max-width: 130px;
}
</style>

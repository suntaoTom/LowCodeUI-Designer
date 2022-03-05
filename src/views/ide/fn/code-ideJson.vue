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
import _CodeMirror from "codemirror";

// 核心样式
import "codemirror/lib/codemirror.css";
// 引入主题后还需要在 options 中指定主题才会生效
// import "codemirror/theme/cobalt.css";
// import "codemirror/theme/idea.css";
import "codemirror/theme/cobalt.css";

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

// import FunctionCode from "./functionCode";
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
var CodeMirror: any = _CodeMirror;
import "codemirror/addon/lint/lint.css";
import "codemirror/addon/lint/lint.js";

import "codemirror/addon/lint/json-lint.js";

//格式化
// import "./formatting.js";

CodeMirror.defineExtension("autoFormatRange");

@Options({
  emits: { blur: null, focus: null },
  components: {},
  props: {
    // 外部传入的内容，用于实现双向绑定
    value: String,
    // 外部传入的语法类型
    language: {
      type: String,
      default: null
    },
    blur: Object,
    focus: Object
  },
  watch: {
    value: [{ handler: "apiValueApies", immediate: false, deep: false }]
  }
})
export default class IdeComponent extends Vue {
  private code = "";
  private coder: any = null;
  private options: any = {
    mode: "application/json",
    // 缩进格式
    tabSize: 2,
    // 主题，对应主题库 JS 需要提前引入
    theme: "cobalt",
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
    //快捷键
    extraKeys: {
      F7: function autoFormat(cm: any) {
        let from = { line: 0, ch: 0 };
        let to = { line: cm.lineCount() };
        let line = cm.getValue().split("\n").length;
        for (var cur = from.line + 1, end = from.line + line; cur <= end; ++cur)
          cm.indentLine(cur, "smart");
        cm.setSelection(from, cm.getCursor(false));
      }, //代码格式化
      F11: function(cm: any) {
        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
      },
      Esc: function(cm: any) {
        if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
      }
    }
    // hintOptions: {
    //   completeSingle: false,
    //   alignWithWord: false,
    //   hint: this.getHints.bind(this)
    // }
  };
  private selection: any = { from: {}, to: {} };
  apiValueApies(newV: any, oldV: any) {
    if (newV !== oldV) {
      setTimeout(() => {
        // this.code = newV;
        // this.refresh(newV, "application/json");
      }, 0);
    }
  }
  refresh(cou: any, mode?: string) {
    if (this.coder) {
      this.code = cou;
      this.coder.toTextArea();
      this.coder = null;
      if (mode) {
        this.options.mode = mode;
      }
      setTimeout(() => {
        this._initialize();
      }, 0);
    }
  }

  _initialize() {
    let self = this;
    // 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置
    let a: any = this.$refs;
    this.coder = CodeMirror.fromTextArea(a.textarea, this.options);
    this.coder.on("blur", function() {
      self.$emit("blur", self.code);
      console.log("onBlur");
    });
    this.coder.on("focus", function() {
      console.log("onfocus");
      self.$emit("focus", self.code);
    });
    // this.coder.autoFormatRange(
    //   { line: 0, ch: 0 },
    //   { line: this.coder.lineCount() }
    // );
    this.format({ line: 0, ch: 0 }, { line: this.coder.lineCount() });
    // 编辑器赋值
    //this.coder.setValue("eewe  12  1231 2131312312414324141241");
    // 支持双向绑定
    this.coder.on("change", () => {
      let a: any = this.$parent;
      this.code = this.coder.getValue();
      a.apiValueTwo = this.coder.getValue();
      console.log(11, this.coder.getValue());
      //   if (this.$emit) {
      //     this.$emit("input", this.code);
      //   }
    });
  }
  created() {
    let a: any = this.$props;
    this.code = a.value;
  }
  mounted() {
    this._initialize();

    // var totalLines = CodeMirror.lineCount();
    // CodeMirror.autoFormatRange({ line: 0, ch: 0 }, { line: totalLines });
  }

  format(from: any, to: any) {
    let line = this.code.split("\n").length;
    for (var cur = from.line + 1, end = from.line + line; cur <= end; ++cur)
      this.coder.indentLine(cur, "smart");
    this.coder.setSelection(from, this.coder.getCursor(false));
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

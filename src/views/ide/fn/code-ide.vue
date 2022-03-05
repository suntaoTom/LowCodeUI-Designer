<template>
  <div class="in-coder-panel">
    <textarea ref="mycode" v-model="code"></textarea>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import _CodeMirror from "codemirror";
// 核心样式
import "codemirror/lib/codemirror.css";
import "codemirror/theme/cobalt.css";
// import "codemirror/theme/rubyblue.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/css/css.js";
// 尝试获取全局实例
const CodeMirror = window.CodeMirror || _CodeMirror;

@Options({
  emits: {},
  components: {},
  props: {
    // 外部传入的内容，用于实现双向绑定
    value: String
  }
})
export default class codeIde extends Vue {
  private editor: any = null;
  private code: any = "";
  private options = {
    mode: "javascript",
    // 缩进格式
    tabSize: 2,
    // 主题，对应主题库 JS 需要提前引入
    theme: "cobalt",
    // 显示行号
    lineNumbers: true,
    line: true
  };
  created() {
    let b: any = this.$props;
    this.code = b.value;
  }
  mounted() {
    let a: any = this.$refs;
    this.editor = CodeMirror.fromTextArea(a.mycode, this.options);
    // 编辑器赋值
    // this.editor.setValue("eewe  12  1231 2131312312414324141241");
    // 支持双向绑定
    this.editor.on("change", () => {
      this.code = this.editor.getValue();
      console.log(11, this.editor.getValue());
      //   if (this.$emit) {
      //     this.$emit("input", this.code);
      //   }
    });
  }
}
</script>

<style lang="scss">
// .CodeMirror-sizer {
//   text-align: left;
// }

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

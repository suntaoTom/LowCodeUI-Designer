declare module "*.vue" {
  import { defineComponent } from "vue";
  const component: ReturnType<typeof defineComponent>;
  export default component;
}

declare module "vue-codemirror" {
  import VueCodeMirror from "vue-codemirror";
  export default VueCodeMirror;
}

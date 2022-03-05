<template>
  <div class="components-edit-shape" :style="defaultStyle">
    <div :id="idname" class="lcu_slot"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  emits: {
    assemblyFnOne: null
  },
  components: {},
  props: {
    defaultStyle: {
      type: Object
    },
    idname: String
  }
})
export default class editShape extends Vue {
  mounted() {
    setTimeout(() => {
      this.$emit("assemblyFnOne");
    }, 0);
  }
}
</script>

<style lang="scss">
.edit-shape-point {
  width: 10px;
  height: 10px;
  background-color: #fff;
  border: 1px solid #59c7f9;
  border-radius: 10px;
  position: absolute;
  z-index: 1001;
}

.components-edit-shape {
  cursor: auto !important;
  &.active {
    outline: 1px dashed #25a589;
  }
  &:hover {
    outline: 1px dashed #25a589;
  }
}
.lcu_slot {
  width: 100%;
  height: 100%;
}
</style>

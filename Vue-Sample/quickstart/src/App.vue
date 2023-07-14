<template>
  <div class="control-section">
    <div id="custom-diagram" class="control-section">
      <ejs-diagram
        style="display: block"
        ref="diagram"
        id="diagram"
        :width="width"
        :nodeTemplate="nodeTemplate"
        :annotationTemplate="annotationTemplate"
        :userHandleTemplate="'cTemplate'"
        :height="height"
        :nodes="nodes"
        :connectors="connectors"
        :selectedItems="selectedItems"
      >
      <template v-slot:cTemplate>
        <button>v-slot-temp</button>
      </template>
    </ejs-diagram>
    </div>
  </div>
</template>

<script>

import Vue from "vue";
import {
  Diagram,
  DiagramPlugin,
  SelectorConstraints,
} from "@syncfusion/ej2-vue-diagrams";
import NodeTemplate from "./complex-template.vue";
import AnnotationTemplate from "./annotation-template.vue";
import UserHandleTemplate from "./userHandle-template.vue";
Vue.use(DiagramPlugin);

let diagramInstance;

    var inlineTemplate = Vue.component("inlineTemplate", {
    template: '<div><input type="button" value="Node_Template-inline"/></div>',
    data() { return { data: {} }; }
  });
  
let nodes = [
{
        id: 'html1', width: 100, height: 100, offsetX: 100, offsetY: 100,
        shape: { type: 'HTML' }
    },
    {
        id: 'basic1', width: 100, height: 100, offsetX: 300, offsetY: 300,
        annotations: [{ id:'an1' }],
    },];

  let connectors = [
  { id: 'connector1', sourceID: 'html1', targetID: 'basic1',annotations: [{ id:'connector_label' }] },

  ]

export default {
  name: 'app',
  data () {
     return {
      nodeTemplate: function () {
        return { template: NodeTemplate };
      },
      annotationTemplate: function () {
        return { template: AnnotationTemplate };
      },
      width: "100%",
      height: "1000px",
      nodes: nodes,
      connectors: connectors,
      selectedItems: {
        constraints:SelectorConstraints.All | SelectorConstraints.UserHandle, userHandles: [{}]
      },
      backgroundColor: "#f5f5f5",
  }
}
}
</script>

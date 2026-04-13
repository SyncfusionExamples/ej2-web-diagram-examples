<template>
  <div>
    <ejs-diagram
      id="diagram"
      :width="'1000px'"
      height="600px"
      :snapSettings="{ constraints: SnapConstraints.None }"
      :layout="{ type: 'HierarchicalTree' }"
      :dataSourceSettings="dataSourceSettings"
      :getNodeDefaults="getNodeDefaults"
      :getConnectorDefaults="getConnectorDefaults"
    >
    </ejs-diagram>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { DataManager } from "@syncfusion/ej2-data";
import { DiagramComponent, DataBinding, HierarchicalTree, SnapConstraints } from "@syncfusion/ej2-vue-diagrams";

export default defineComponent({
  name: "App",
  components: {
    'ejs-diagram': DiagramComponent
  },
  provide: {
     diagram: [DataBinding, HierarchicalTree]
  },
  data() {
    const dataManager = new DataManager({
      url: "http://localhost:5137/api/Diagram",
    });

    return {
      dataManager,
      DataBinding,
      HierarchicalTree,
      SnapConstraints,
      dataSourceSettings: {
        id: "id",
        parentId: "parentId",
        dataSource: dataManager,
        doBinding: (nodeModel: any, data: any) => {
          nodeModel.annotations = [
            {
              content: data.name,
              style: { color: "#FFFFFF" },
            },
          ];
        },
      },
    };
  },
  methods: {
    getNodeDefaults(node: any) {
      node.width = 120;
      node.height = 40;
      node.style = { fill: "#1F3A8A", strokeColor: "#1E40AF" };
      return node;
    },
    getConnectorDefaults(connector: any) {
      connector.type = "Orthogonal";
      connector.cornerRadius = 7;
      connector.targetDecorator = { shape: "None" };
      connector.style = { strokeColor: "#94A3B8", strokeWidth: 1.5 };
      return connector;
    },
  },
});

</script>

<style>
  @import "../node_modules/@syncfusion/ej2-base/styles/material.css";
  @import "../node_modules/@syncfusion/ej2-popups/styles/material.css";
  @import "../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
  @import "../node_modules/@syncfusion/ej2-navigations/styles/material.css";
  @import "../node_modules/@syncfusion/ej2-diagrams/styles/material.css";
</style>
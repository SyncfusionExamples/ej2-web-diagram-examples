<template>
    <div v-if="data.id == 'an1'">
       <div>
         <input type="button" value="Annotation_Template_1"/>
        </div>
    </div>
      <div  v-else-if="data.id == 'node_label2'">
         <input type="button" value="Annotation_Template_2"/>
     </div>
     <div  v-else-if="data.id == 'connector_label'">
         <input type="button" value="ConnectorAnnotation_Template"/>
     </div>  
   </template>
   
   <script>
   
   
   export default {
     data() {
       return {
         
   
   }},
   
   };
   
   </script>
   <style scoped>
   .wrapper {
     max-width: 250px;
     margin: 0 auto;
   }
   </style>
   
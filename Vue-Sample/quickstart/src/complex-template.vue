<template>
    <div v-if="data.id == 'html1'">
       <div>
         <div style="background-color: aqua;width: 100px;height: 100px;"><input type="button" value="Node_Template"/></div>
        </div>
    </div>
      <div  v-else-if="data.id == 'node2Template'">
         <input type="button" value="Node_Template 2"/>
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
   
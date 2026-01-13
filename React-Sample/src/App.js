import './App.css';
import * as React from "react";
import { DiagramComponent, SelectorConstraints } from "@syncfusion/ej2-react-diagrams";
function nodeTemplate1(props) {
     return <div><input type="button" id="button" value={props.id}/></div>
}
function nodeTemplate2(props) {
     return <div><input type="button" id="button" value="second"/></div>
}
function annotationTemplate1(props) {
     return <div><input type="button" id="button" value={props.id}/></div>
}
function annotationTemplate2(props) {
     return <div><input type="button" id="button" value="annotation template"/></div>
}
function userHandleTemplate(props) {
     return <div><input type="button" id="button" value="userHandle template"/></div>
}

function App() {
  const nodes = [
    {
      id: 'html1', width: 100, height: 100, offsetX: 100, offsetY: 100,
      shape: { type: 'HTML' }
  },
  {
      id: 'html2', width: 100, height: 100, offsetX: 100, offsetY: 300,
      shape: { type: 'HTML', content: nodeTemplate2 }
  },
  {
      id: 'basic1', width: 100, height: 100, offsetX: 300, offsetY: 100,
      annotations: [{ id:'an1' }],
  },
  {
      id: 'basic2', width: 100, height: 100, offsetX: 300, offsetY: 300,
      annotations: [{ id:'an2', template: annotationTemplate2}],
  }
];
const connectors = [
  { id: 'connector1', sourceID: 'basic1', targetID: 'basic2',annotations: [{ id:'con_an1',template:annotationTemplate1 }] },

]
return (<DiagramComponent id="container"
 width={"100%"}
 height={"700px"}
 nodes={nodes}
 connectors={connectors}
 nodeTemplate={nodeTemplate1.bind(this)}
 annotationTemplate={annotationTemplate1.bind(this)}
 userHandleTemplate={userHandleTemplate.bind(this)}
 selectedItems={{constraints:SelectorConstraints.All| SelectorConstraints.UserHandle,userHandles:[{}]}}
 />);
}

export default App;

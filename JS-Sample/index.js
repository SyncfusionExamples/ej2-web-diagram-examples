var employees = [
    { name: "John Doe", fillColor: "blue", strokeColor: "white" },
    { name: "Jane Smith", fillColor: "green", strokeColor: "black" },
];

var nodeTemplate1 = function (data) {
    var employeeList = '';
    employees.forEach(function (employee) {
        var fillColor = employee.fillColor || 'transparent';
        var strokeColor = employee.strokeColor || 'black';
        var liStyle = "background-color: " + fillColor + "; border: 1px solid " + strokeColor + ";";
        employeeList += "<li style=\"" + liStyle + "\">" + employee.name + "</li>";
    });
    return "<div onclick=\"myFunction()\" style=\"background-color:grey\"><span>" + data.id + "</span><input onclick=\"myFunction2()\" type=\"button\" value=" + data.id + "><ul style=\"list-style-type: square; padding-left: 20px;\">" + employeeList + "</ul></div>";
};

var nodeTemplate2 = function (data) {
    return '<div><input type="button" value="node-temp"</div>';
};

var annotationTemplate1 = function (data) {
    return '<div><input type="button" value='+ data.id +'</div>';
};

var annotationTemplate2 = function (data) {
    return '<div><input type="button" value="annot-temp2"</div>';
};

var userHandleTemplate = function (data) {
    return '<div><input type="button" value="handle-temp1"</div>';
};

var nodes = [
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

var connectors = [
    { id: 'connector1', sourceID: 'basic1', targetID: 'basic2',annotations: [{ id:'con_an1',template:annotationTemplate1 }] },
];

var diagram = new ej.diagrams.Diagram({
    width: '700px', height: '600px',
    nodes: nodes,
    connectors: connectors,
    nodeTemplate: nodeTemplate1,
    annotationTemplate: annotationTemplate1,
    userHandleTemplate: userHandleTemplate,
    }, '#element');

    window.myFunction = function () {
        console.log('Clicked!');
    };
    window.myFunction2 = function () {
        console.log('Clicked button!');
    };
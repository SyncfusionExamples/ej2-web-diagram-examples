#pragma checksum "C:\Users\ShyamG\Downloads\Radialtreewithoutput\Radialtree\Radialtree\WebApplication1\Views\Home\Index.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "312c70d4cedbd2ed3df80fcdfb67258d7e29edf1"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Home_Index), @"mvc.1.0.view", @"/Views/Home/Index.cshtml")]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#nullable restore
#line 1 "C:\Users\ShyamG\Downloads\Radialtreewithoutput\Radialtree\Radialtree\WebApplication1\Views\_ViewImports.cshtml"
using WebApplication1;

#line default
#line hidden
#nullable disable
#nullable restore
#line 1 "C:\Users\ShyamG\Downloads\Radialtreewithoutput\Radialtree\Radialtree\WebApplication1\Views\Home\Index.cshtml"
using Syncfusion.EJ2;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "C:\Users\ShyamG\Downloads\Radialtreewithoutput\Radialtree\Radialtree\WebApplication1\Views\Home\Index.cshtml"
using WebApplication1.Models;

#line default
#line hidden
#nullable disable
#nullable restore
#line 3 "C:\Users\ShyamG\Downloads\Radialtreewithoutput\Radialtree\Radialtree\WebApplication1\Views\Home\Index.cshtml"
using WebApplication1.Controllers;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"312c70d4cedbd2ed3df80fcdfb67258d7e29edf1", @"/Views/Home/Index.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"8c9311070cf3b57be9f620fdc7d86c36529e7ebe", @"/Views/_ViewImports.cshtml")]
    public class Views_Home_Index : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_0 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("id", "Id", global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_1 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("parentId", "Manager", global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_2 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("id", "container", global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_3 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("width", "100%", global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_4 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("height", "700px", global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        #line hidden
        #pragma warning disable 0649
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperExecutionContext __tagHelperExecutionContext;
        #pragma warning restore 0649
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperRunner __tagHelperRunner = new global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperRunner();
        #pragma warning disable 0169
        private string __tagHelperStringValueBuffer;
        #pragma warning restore 0169
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager __backed__tagHelperScopeManager = null;
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager __tagHelperScopeManager
        {
            get
            {
                if (__backed__tagHelperScopeManager == null)
                {
                    __backed__tagHelperScopeManager = new global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager(StartTagHelperWritingScope, EndTagHelperWritingScope);
                }
                return __backed__tagHelperScopeManager;
            }
        }
        private global::Syncfusion.EJ2.Diagrams.Diagram __Syncfusion_EJ2_Diagrams_Diagram;
        private global::Syncfusion.EJ2.Diagrams.DiagramDataSource __Syncfusion_EJ2_Diagrams_DiagramDataSource;
        private global::Syncfusion.EJ2.Diagrams.DiagramLayout __Syncfusion_EJ2_Diagrams_DiagramLayout;
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
#nullable restore
#line 4 "C:\Users\ShyamG\Downloads\Radialtreewithoutput\Radialtree\Radialtree\WebApplication1\Views\Home\Index.cshtml"
  
    ViewData["Title"] = "Home Page";

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n<input type=\"button\" value=\"convertDiagramToPPTX\" onclick=\"convertDiagramToPPTX()\"/>\r\n\r\n    <div class=\"control-section\"> \r\n        ");
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("ejs-diagram", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "312c70d4cedbd2ed3df80fcdfb67258d7e29edf15627", async() => {
                WriteLiteral("\r\n            ");
                __tagHelperExecutionContext = __tagHelperScopeManager.Begin("e-diagram-datasourcesettings", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "312c70d4cedbd2ed3df80fcdfb67258d7e29edf15904", async() => {
                }
                );
                __Syncfusion_EJ2_Diagrams_DiagramDataSource = CreateTagHelper<global::Syncfusion.EJ2.Diagrams.DiagramDataSource>();
                __tagHelperExecutionContext.Add(__Syncfusion_EJ2_Diagrams_DiagramDataSource);
                __Syncfusion_EJ2_Diagrams_DiagramDataSource.Id = (string)__tagHelperAttribute_0.Value;
                __tagHelperExecutionContext.AddTagHelperAttribute(__tagHelperAttribute_0);
                __Syncfusion_EJ2_Diagrams_DiagramDataSource.ParentId = (string)__tagHelperAttribute_1.Value;
                __tagHelperExecutionContext.AddTagHelperAttribute(__tagHelperAttribute_1);
#nullable restore
#line 12 "C:\Users\ShyamG\Downloads\Radialtreewithoutput\Radialtree\Radialtree\WebApplication1\Views\Home\Index.cshtml"
__Syncfusion_EJ2_Diagrams_DiagramDataSource.DataManager = new DataManager() { Data = (List<OrganizationalDetails>)ViewBag.Nodes };

#line default
#line hidden
#nullable disable
                __tagHelperExecutionContext.AddTagHelperAttribute("dataManager", __Syncfusion_EJ2_Diagrams_DiagramDataSource.DataManager, global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
                await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
                if (!__tagHelperExecutionContext.Output.IsContentModified)
                {
                    await __tagHelperExecutionContext.SetOutputContentAsync();
                }
                Write(__tagHelperExecutionContext.Output);
                __tagHelperExecutionContext = __tagHelperScopeManager.End();
                WriteLiteral("\r\n            ");
                __tagHelperExecutionContext = __tagHelperScopeManager.Begin("e-diagram-layout", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "312c70d4cedbd2ed3df80fcdfb67258d7e29edf17821", async() => {
                }
                );
                __Syncfusion_EJ2_Diagrams_DiagramLayout = CreateTagHelper<global::Syncfusion.EJ2.Diagrams.DiagramLayout>();
                __tagHelperExecutionContext.Add(__Syncfusion_EJ2_Diagrams_DiagramLayout);
#nullable restore
#line 13 "C:\Users\ShyamG\Downloads\Radialtreewithoutput\Radialtree\Radialtree\WebApplication1\Views\Home\Index.cshtml"
__Syncfusion_EJ2_Diagrams_DiagramLayout.Type = global::Syncfusion.EJ2.Diagrams.LayoutType.OrganizationalChart;

#line default
#line hidden
#nullable disable
                __tagHelperExecutionContext.AddTagHelperAttribute("type", __Syncfusion_EJ2_Diagrams_DiagramLayout.Type, global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
#nullable restore
#line 13 "C:\Users\ShyamG\Downloads\Radialtreewithoutput\Radialtree\Radialtree\WebApplication1\Views\Home\Index.cshtml"
__Syncfusion_EJ2_Diagrams_DiagramLayout.GetLayoutInfo = ViewBag.GetLayoutInfo;

#line default
#line hidden
#nullable disable
                __tagHelperExecutionContext.AddTagHelperAttribute("getLayoutInfo", __Syncfusion_EJ2_Diagrams_DiagramLayout.GetLayoutInfo, global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
                await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
                if (!__tagHelperExecutionContext.Output.IsContentModified)
                {
                    await __tagHelperExecutionContext.SetOutputContentAsync();
                }
                Write(__tagHelperExecutionContext.Output);
                __tagHelperExecutionContext = __tagHelperScopeManager.End();
                WriteLiteral("\r\n        ");
            }
            );
            __Syncfusion_EJ2_Diagrams_Diagram = CreateTagHelper<global::Syncfusion.EJ2.Diagrams.Diagram>();
            __tagHelperExecutionContext.Add(__Syncfusion_EJ2_Diagrams_Diagram);
            __Syncfusion_EJ2_Diagrams_Diagram.Id = (string)__tagHelperAttribute_2.Value;
            __tagHelperExecutionContext.AddTagHelperAttribute(__tagHelperAttribute_2);
            __Syncfusion_EJ2_Diagrams_Diagram.Width = (string)__tagHelperAttribute_3.Value;
            __tagHelperExecutionContext.AddTagHelperAttribute(__tagHelperAttribute_3);
            __Syncfusion_EJ2_Diagrams_Diagram.Height = (string)__tagHelperAttribute_4.Value;
            __tagHelperExecutionContext.AddTagHelperAttribute(__tagHelperAttribute_4);
#nullable restore
#line 11 "C:\Users\ShyamG\Downloads\Radialtreewithoutput\Radialtree\Radialtree\WebApplication1\Views\Home\Index.cshtml"
__Syncfusion_EJ2_Diagrams_Diagram.GetConnectorDefaults = ViewBag.getConnectorDefaults;

#line default
#line hidden
#nullable disable
            __tagHelperExecutionContext.AddTagHelperAttribute("getConnectorDefaults", __Syncfusion_EJ2_Diagrams_Diagram.GetConnectorDefaults, global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
#nullable restore
#line 11 "C:\Users\ShyamG\Downloads\Radialtreewithoutput\Radialtree\Radialtree\WebApplication1\Views\Home\Index.cshtml"
__Syncfusion_EJ2_Diagrams_Diagram.GetNodeDefaults = ViewBag.getNodeDefaults;

#line default
#line hidden
#nullable disable
            __tagHelperExecutionContext.AddTagHelperAttribute("getNodeDefaults", __Syncfusion_EJ2_Diagrams_Diagram.GetNodeDefaults, global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
            await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
            if (!__tagHelperExecutionContext.Output.IsContentModified)
            {
                await __tagHelperExecutionContext.SetOutputContentAsync();
            }
            Write(__tagHelperExecutionContext.Output);
            __tagHelperExecutionContext = __tagHelperScopeManager.End();
            WriteLiteral(@"
    </div>
    
    <script>
        function nodeDefaults(obj, diagram) {
            obj.shape = {
                type: 'Text', content: obj.data.Role,
                margin: { left: 10, right: 10, top: 10, bottom: 10 }
            };
            obj.backgroundColor = obj.data.Color;
            obj.style = { fill: 'none', strokeColor: 'none', color: 'white' };
            obj.expandIcon = { height: 10, width: 10, shape: 'None', fill: 'lightgray', offset: { x: .5, y: 1 } };
            obj.expandIcon.verticalAlignment = 'Center';
            obj.expandIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
            obj.collapseIcon.offset = { x: .5, y: 1 };
            obj.collapseIcon.verticalAlignment = 'Center';
            obj.collapseIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
            obj.collapseIcon.height = 10;
            obj.collapseIcon.width = 10;
            obj.collapseIcon.shape = 'None';
            obj.collapseIcon.fill = 'lightgray';
            o");
            WriteLiteral(@"bj.width = 120;
            obj.height = 30;
            return obj;
        }

        function ConnectorDefaults(connector, diagram) {
            connector.targetDecorator.shape = 'None';
            connector.type = 'Orthogonal';
            connector.style.strokeColor = '#6d6d6d';
            connector.constraints = 0;
            connector.cornerRadius = 5;
            return connector;
        }

        function getLayoutInfo(node, options, orientation, type) {
            if (node.data.Role === 'General Manager') {
                options.assistants.push(options.children[0]);
                options.children.splice(0, 1);
            }
            if (!options.hasSubTree) {
                options.type = 'Right';
            }
        }

        function convertDiagramToPPTX() {
            var diagram = document.getElementById(""container"").ej2_instances[0];
            var nodePropertyCollection = [];
            var connectorPropertyCollection = [];
            //save th");
            WriteLiteral(@"e diagram
            var saveData = diagram.saveDiagram();
            //parse the JSON string
            var parsedData = JSON.parse(saveData);
            //iterate the nodes
            for (var i = 0; i < parsedData.nodes.length; i++) {
                var node = parsedData.nodes[i];
                nodePropertyCollection.push({ id: node.id, width: node.width, height: node.height, offsetX: node.offsetX, offsetY: node.offsetY, shape: node.shape, annotations: [{ content: node.data.Role }], addInfo: node.data.Level });
            }
            //iterate the connectors
            for (var j = 0; j < parsedData.connectors.length; j++) {
                var connector = parsedData.connectors[j];
                connectorPropertyCollection.push({ id: connector.id, sourceID: connector.sourceID, targetID: connector.targetID });
            }
            var jsonResult = { nodeProperty: nodePropertyCollection, connectorProperty: connectorPropertyCollection };
            var Jsonstring= JSON.strin");
            WriteLiteral(@"gify(jsonResult);
            //pass JSON string to server via AJAX post
            $.ajax({
                url: ""/Home/save"",
                type: ""Post"",
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: Jsonstring,
                success: function (Jsonstring) {
                    alert(""Success"");
                    return true;
                },
            });
        }
       
    </script>
");
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<dynamic> Html { get; private set; }
    }
}
#pragma warning restore 1591

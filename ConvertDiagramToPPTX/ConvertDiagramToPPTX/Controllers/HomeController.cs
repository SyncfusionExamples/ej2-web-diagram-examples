using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebApplication1.Models;
using Syncfusion.EJ2.Diagrams;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Syncfusion.Presentation;
using System.IO;
using System.Globalization;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            ViewBag.nodes = OrganizationalDetails.GetData();
            ViewBag.getConnectorDefaults = "ConnectorDefaults";
            ViewBag.getNodeDefaults = "nodeDefaults";
            ViewBag.GetLayoutInfo = "getLayoutInfo";
            return View();

        }

        [HttpPost]
        public ActionResult save([FromBody] Dictionary<string, object> NCProperty)
        {
            //Create an instance for PowerPoint presentation
            IPresentation pptxDoc = Presentation.Create();
            //Add slide to the presentation
            ISlide slide = pptxDoc.Slides.Add(SlideLayoutType.Blank);
            //Resize a slide size to diagram canvas size.
            slide.SlideSize.Width = 1000;
            slide.SlideSize.Height = 1000;

            //parse a node collection
            List<DiagramNode> Nodes = JsonConvert.DeserializeObject<List<DiagramNode>>(NCProperty["nodeProperty"].ToString());
            foreach (var node in Nodes)
            {
                //Adds a new shape to the slide.
                IShape shape = slide.Shapes.AddShape(AutoShapeType.Rectangle, node.OffsetX, node.OffsetY, node.Width, node.Height);
                //Adds a shape id and its level.
                shape.Description = node.Id + "&" + node.AddInfo.ToString();

                // Apply the color for shape
                string hexColorCode = GetShapeColorBasedOnLevel(node.AddInfo.ToString());
                shape.Fill.FillType = FillType.Solid;                
                shape.Fill.SolidFill.Color = ColorObject.FromArgb(int.Parse(hexColorCode.Substring(0, 2), NumberStyles.AllowHexSpecifier),
                     int.Parse(hexColorCode.Substring(2, 2), NumberStyles.AllowHexSpecifier),
                     int.Parse(hexColorCode.Substring(4, 2), NumberStyles.AllowHexSpecifier));

                // Disable the line format of shape.
                shape.LineFormat.Fill.FillType = FillType.None;

                // Apply VerticalAlignment
                shape.TextBody.VerticalAlignment = VerticalAlignmentType.Middle;

                foreach (var annotation in node.Annotations)
                {
                    //get the node label
                    string content = annotation.Content;
                    //Adds a paragraph to the shape.
                    IParagraph paragraph = shape.TextBody.AddParagraph();
                    // Apply HorizontalAlignment
                    paragraph.HorizontalAlignment = HorizontalAlignmentType.Center;
                    //Adds a text to the paragraph.
                    ITextPart textPart = paragraph.AddTextPart(content);
                    // Apply text properties.
                    textPart.Font.Color = ColorObject.White;
                    textPart.Font.FontSize = 10;
                }
            }
            //To get connectors collection
            List<DiagramConnector> Connectors = JsonConvert.DeserializeObject<List<DiagramConnector>>(NCProperty["connectorProperty"].ToString());
            //Iterate an connectors
            foreach (var connector in Connectors)
            {
                IShape sourceShape = GetShapeWithID(connector.SourceID, slide.Shapes);
                IShape targetShape = GetShapeWithID(connector.TargetID, slide.Shapes);
                if (sourceShape != null && targetShape != null)
                {
                    int targetShapeConnectionPortIndex = GetConnectionPortIndexBasedOnLevel(targetShape.Description.Split('&')[1]);
                    //Add elbow connector on the slide and connect the end points of connector with specified port positions 0 and 4 of the source and target shapes
                    IConnector connectorShape = slide.Shapes.AddConnector(ConnectorType.Elbow, sourceShape, 2, targetShape, targetShapeConnectionPortIndex);
                    //Adds a connector id.
                    connectorShape.Description = connector.Id;
                    //Apply connector line color.
                    connectorShape.LineFormat.Fill.FillType = FillType.Solid;
                    connectorShape.LineFormat.Fill.SolidFill.Color = ColorObject.Black;
                }
            }

            //Save the PowerPoint Presentation
            pptxDoc.Save("Diagram.pptx");
            //Closes the Presentation
            pptxDoc.Close();

            return null;
        }

        /// <summary>
        /// Gets a shape object with corresponding shape ID.
        /// </summary>
        /// <param name="id">Represents the id of shape.</param>
        /// <param name="shapes">Represents a shapes collection.</param>
        /// <returns>Returns shape object with corresponding shape ID.</returns>
        private IShape GetShapeWithID(string id, IShapes shapes)
        {
            foreach (IShape shape in shapes)
            {
                if (shape.Description.Split('&')[0] == id)
                    return shape;
            }
            return null;
        }
        /// <summary>
        /// Gets a connection port index of target shape based on its level.
        /// </summary>
        /// <param name="level">Represents a level of shape.</param>
        /// <returns>Returns a connection port index of target shape based on its level.</returns>
        private int GetConnectionPortIndexBasedOnLevel(string level)
        {
            switch (level)
            {
                case "level2":
                case "level4":
                    return 0;

                case "level3":
                    return 3;
                
                case "level5":
                default:
                    return 1;
            }
        }
        /// <summary>
        /// Gets a shape color based on its level.
        /// </summary>
        /// <param name="level">Represent a level of shape.</param>
        /// <returns>Returns a shape color based on its level.</returns>
        private string GetShapeColorBasedOnLevel(string level)
        {
            switch (level)
            {
                case "level1":
                case "level2":
                case "level3":
                    return "71AF17";

                case "level4":
                    return "1859B7";

                case "level5":
                default:
                    return "2E95D8";
            }
        }
    }
    public class OrganizationalDetails
    {
        public string Id { get; set; }
        public string Role { get; set; }
        public string Color { get; set; }
        public string Manager { get; set; }
        public string ChartType { get; set; }
        public string Level { get; set; }

        public OrganizationalDetails(string id, string role, string color, string manager, string chartType, string level)
        {
            this.Id = id;
            this.Role = role;
            this.Color = color;
            this.Manager = manager;
            this.ChartType = chartType;
            this.Level = level;
        }

        public static List<OrganizationalDetails> GetData()
        {
            List<OrganizationalDetails> organizationaldetails = new List<OrganizationalDetails>();
            organizationaldetails.Add(new OrganizationalDetails("parent", "Board", "#71AF17", "", "", "level1"));
            organizationaldetails.Add(new OrganizationalDetails("1", "General Manager", "#71AF17", "parent", "right", "level2"));
             organizationaldetails.Add(new OrganizationalDetails("2", "Human Resource Manager", "#1859B7", "1", "right", "level4"));
            organizationaldetails.Add(new OrganizationalDetails("3", "Trainers", "#2E95D8", "2", "", "level5"));
            organizationaldetails.Add(new OrganizationalDetails("4", "Recruiting Team", "#2E95D8", "2", "", "level5"));
            organizationaldetails.Add(new OrganizationalDetails("6", "Design Manager", "#1859B7", "1", "right", "level4"));
            organizationaldetails.Add(new OrganizationalDetails("7", "Design Supervisor", "#2E95D8", "6", "", "level5"));
            organizationaldetails.Add(new OrganizationalDetails("8", "Development Supervisor", "#2E95D8", "6", "", "level5"));
            organizationaldetails.Add(new OrganizationalDetails("9", "Drafting Supervisor", "#2E95D8", "6", "", "level5"));
            organizationaldetails.Add(new OrganizationalDetails("10", "Operations Manager", "#1859B7", "1", "right", "level4"));
            organizationaldetails.Add(new OrganizationalDetails("11", "Statistics Department", "#2E95D8", "10", "", "level5"));
             
            return organizationaldetails;
        }
    }

}

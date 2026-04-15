using System.ComponentModel.DataAnnotations;


namespace Angular_Diagram_MSSQL.Server.Data
{
    /// <summary>
    /// Represents a node in the layout hierarchy used by the diagram.
    /// </summary>
    public class LayoutNode
    {
        /// <summary>
        /// Gets or sets the unique identifier for the layout node.
        /// </summary>
        /// <remarks>
        /// This property serves as the primary key for the node.
        /// </remarks>
        [Key]
        public string Id { get; set; } = null!;

        /// <summary>
        /// Gets or sets the identifier of the parent node.
        /// </summary>
        /// <remarks>
        /// A null value indicates that this node is a root-level node.
        /// </remarks>
        public string? ParentId { get; set; }

        /// <summary>
        /// Gets or sets the role associated with the layout node.
        /// </summary>
        /// <remarks>
        /// This value determines the responsibility or classification of the node
        /// within the diagram.
        /// </remarks>
        public string Role { get; set; } = null!;
    }
}


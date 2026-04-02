namespace React_Diagram_MSSQL.Server.Data
{
    public class LayoutNode
    {
        public string Id { get; set; } = null!;
        public string? ParentId { get; set; }
        public string Role { get; set; } = null!;
    }
}

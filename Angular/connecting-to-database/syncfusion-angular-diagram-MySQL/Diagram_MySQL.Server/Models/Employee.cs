using LinqToDB.Mapping;

namespace DIAGRAM_MySQL.Server.Models
{
    [Table("employees")]
    public class Employee
    {
        [PrimaryKey, Identity]
        public int? Id { get; set; }
        
        [Column, NotNull]
        public string Name { get; set; }

        [Column]
        public int? ParentId { get; set; }
    }
}

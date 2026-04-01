-- Create the DiagramDb database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'DiagramDb')
BEGIN
    CREATE DATABASE DiagramDb;
END
GO

-- Use the DiagramDb database
USE DiagramDb;
GO

-- Create the LayoutNodes table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LayoutNodes')
BEGIN
    CREATE TABLE dbo.LayoutNodes (
        Id NVARCHAR(50) PRIMARY KEY NOT NULL,
        ParentId NVARCHAR(50) NULL,
        Role NVARCHAR(255) NOT NULL
    );
END
GO

-- Insert sample data (organizational structure)
TRUNCATE TABLE dbo.LayoutNodes;
GO

INSERT INTO dbo.LayoutNodes (Id, ParentId, Role) VALUES
('1', NULL, 'CEO'),
('2', '1', 'Vice President'),
('3', '1', 'Director'),
('4', '2', 'Manager'),
('5', '2', 'Supervisor'),
('6', '3', 'Team Lead'),
('7', '3', 'Developer'),
('8', '4', 'Analyst'),
('9', '5', 'Coordinator');
GO

-- Verify the data
SELECT * FROM dbo.LayoutNodes ORDER BY Id;

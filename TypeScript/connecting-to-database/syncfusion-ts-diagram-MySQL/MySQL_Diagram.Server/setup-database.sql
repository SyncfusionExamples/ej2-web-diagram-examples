-- 1. Create Database
CREATE DATABASE IF NOT EXISTS diagramdb;

-- 2. Use Database
USE diagramdb;

-- 3. Drop table if exists (safe re-run)
DROP TABLE IF EXISTS employees;

-- 4. Create Employees Table
CREATE TABLE employees (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    ParentId INT NULL,
    CONSTRAINT fk_parent
        FOREIGN KEY (ParentId)
        REFERENCES employees(Id)
        ON DELETE CASCADE
);

-- 5. Insert Organization Data
-- Hierarchy Depth: CEO → Manager → Lead → Senior Engineer → Engineer

INSERT INTO employees (Name, ParentId) VALUES
-- Level 1
('CEO', NULL),

-- Level 2
('Manager A', 1),
('Manager B', 1),

-- Level 3
('Lead A1', 2),
('Lead B1', 3),

-- Level 4
('Senior Engineer A1-1', 4),
('Senior Engineer B1-1', 5),

-- Level 5
('Engineer A1-1-1', 6),
('Engineer A1-1-2', 6),
('Engineer B1-1-1', 7),
('Engineer B1-1-2', 7);

-- 6. Verify Data
SELECT Id, Name, ParentId
FROM employees
ORDER BY Id;
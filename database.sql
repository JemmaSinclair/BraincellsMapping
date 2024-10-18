-- Create the minecraft_mapping database (if it doesn't already exist)
CREATE DATABASE IF NOT EXISTS minecraft_mapping;
USE minecraft_mapping;

-- Table for storing assets such as subway stations, train stations, conduits
CREATE TABLE assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    type ENUM('subway', 'train', 'conduit') NOT NULL,
    status ENUM('completed', 'under-construction', 'planned') NOT NULL,
    x_coord INT NOT NULL,
    y_coord INT NOT NULL,
    z_coord INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing tunnels/roads, connecting two points (X, Y, Z coordinates)
CREATE TABLE tunnels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    type ENUM('subway', 'train') NOT NULL,
    x1_coord INT NOT NULL,
    y1_coord INT NOT NULL,
    z1_coord INT NOT NULL,
    x2_coord INT NOT NULL,
    y2_coord INT NOT NULL,
    z2_coord INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Insert sample data into assets table
INSERT INTO assets (label, type, status, x_coord, y_coord, z_coord, description)
VALUES 
('Subway Station A', 'subway', 'completed', 150, 200, 10, 'Main subway station in city center.'),
('Train Station B', 'train', 'under-construction', 250, 150, 20, 'Major train station being built.'),
('Conduit Access C', 'conduit', 'planned', 350, 300, 15, 'Conduit system access planned for future.');


-- Optional: Insert sample data into tunnels table
INSERT INTO tunnels (label, type, x1_coord, y1_coord, z1_coord, x2_coord, y2_coord, z2_coord, description)
VALUES 
('Subway Tunnel 1', 'subway', 120, 120, 10, 320, 320, 20, 'Subway tunnel connecting stations A and B.'),
('Train Tunnel 1', 'train', 280, 180, 15, 400, 300, 25, 'Train tunnel between two main train hubs.');

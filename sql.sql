-- Create database
CREATE DATABASE chatdb;
USE chatdb;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Groups table
CREATE TABLE groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  owner_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Group Members
CREATE TABLE group_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('owner', 'member') DEFAULT 'member',
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (group_id, user_id) -- prevents duplicate membership
);

-- Messages table
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  receiver_id INT NULL, -- for private chat
  group_id INT NULL,    -- for group chat
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- Indexes for faster lookups
CREATE INDEX idx_receiver ON messages(receiver_id);
CREATE INDEX idx_group ON messages(group_id);


-- Insert test users
INSERT INTO users (username, password)
VALUES
  ('alice', '$2a$10$abcdef...'), -- bcrypt hashed password
  ('bob',   '$2a$10$abcdef...');

-- Create a group owned by Alice
INSERT INTO groups (name, owner_id) VALUES ('React Devs', 1);

-- Add Alice (owner) + Bob (member)
INSERT INTO group_members (group_id, user_id, role)
VALUES (1, 1, 'owner'), (1, 2, 'member');

-- Insert a sample private message (Alice -> Bob)
INSERT INTO messages (user_id, receiver_id, message)
VALUES (1, 2, 'Hey Bob!');

-- Insert a sample group message
INSERT INTO messages (user_id, group_id, message)
VALUES (2, 1, 'Hi team, excited to learn React!');

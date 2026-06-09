-- ============================================================
-- GYM WEBSITE - MySQL Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS gym_website;
USE gym_website;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gym Images Table
CREATE TABLE IF NOT EXISTS gym_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_path VARCHAR(255) NOT NULL,
  caption VARCHAR(200),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gym Timings Table
CREATE TABLE IF NOT EXISTS gym_timings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  day ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL UNIQUE,
  open_time TIME,
  close_time TIME,
  is_closed TINYINT(1) DEFAULT 0
);

-- ============================================================
-- Seed Data
-- ============================================================

-- Default timings
INSERT INTO gym_timings (day, open_time, close_time, is_closed) VALUES
('Monday',    '06:00:00', '22:00:00', 0),
('Tuesday',   '06:00:00', '22:00:00', 0),
('Wednesday', '06:00:00', '22:00:00', 0),
('Thursday',  '06:00:00', '22:00:00', 0),
('Friday',    '06:00:00', '22:00:00', 0),
('Saturday',  '06:00:00', '22:00:00', 0),
('Sunday',    NULL,       NULL,       1)
ON DUPLICATE KEY UPDATE day=day;

-- Default admin account (password: Admin@123)
-- Password hash generated with bcrypt rounds=10
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@gymwebsite.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'admin')
ON DUPLICATE KEY UPDATE email=email;

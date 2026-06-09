-- =============================================================
-- GYM WEBSITE DATABASE SCHEMA
-- =============================================================

CREATE DATABASE IF NOT EXISTS gym_db;
USE gym_db;

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GYM IMAGES TABLE
CREATE TABLE IF NOT EXISTS gym_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_path VARCHAR(500) NOT NULL,
  caption VARCHAR(200),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GYM TIMINGS TABLE
CREATE TABLE IF NOT EXISTS gym_timings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  day VARCHAR(20) NOT NULL UNIQUE,
  open_time TIME,
  close_time TIME,
  is_closed TINYINT(1) DEFAULT 0
);

-- =============================================================
-- SEED DATA
-- =============================================================

-- Default Admin user (password: Admin@123 — change after first login)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@2n.com', 'pass123', 'admin');

-- Default gym timings
INSERT INTO gym_timings (day, open_time, close_time, is_closed) VALUES
('Monday',    '06:00:00', '22:00:00', 0),
('Tuesday',   '06:00:00', '22:00:00', 0),
('Wednesday', '06:00:00', '22:00:00', 0),
('Thursday',  '06:00:00', '22:00:00', 0),
('Friday',    '06:00:00', '22:00:00', 0),
('Saturday',  '06:00:00', '22:00:00', 0),
('Sunday',    NULL,       NULL,       1);

-- Placeholder gallery images
INSERT INTO gym_images (image_path, caption) VALUES
('/uploads/gym1.jpg', 'Main Workout Floor'),
('/uploads/gym2.jpg', 'Cardio Zone'),
('/uploads/gym3.jpg', 'Free Weights Area'),
('/uploads/gym4.jpg', 'Yoga & Stretching'),
('/uploads/gym5.jpg', 'Cycling Studio'),
('/uploads/gym6.jpg', 'Locker Rooms');

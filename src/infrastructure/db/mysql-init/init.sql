CREATE DATABASE IF NOT EXISTS tandas_db;
USE tandas_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) DEFAULT 'user',
    active BOOLEAN DEFAULT TRUE,
    failed_attempts INT DEFAULT 0,
    created_at DATETIME
);

CREATE TABLE IF NOT EXISTS tandas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contribution_amount DECIMAL(10,2) NOT NULL,
    payment_frequency VARCHAR(50) NOT NULL,
    total_members INT NOT NULL,
    delay_tolerance_days INT DEFAULT 0,
    penalty_per_day DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) NOT NULL,
    creator_id INT NOT NULL,
    created_at DATETIME,
    FOREIGN KEY (creator_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS invitations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tanda_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    FOREIGN KEY (tanda_id) REFERENCES tandas(id)
);

CREATE TABLE IF NOT EXISTS participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tanda_id INT NOT NULL,
    turn INT DEFAULT 0,
    already_paid BOOLEAN DEFAULT FALSE,
    expelled BOOLEAN DEFAULT FALSE,
    created_at DATETIME,
    UNIQUE(user_id, tanda_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (tanda_id) REFERENCES tandas(id)
);

CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id INT NOT NULL,
    period INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    due_date DATETIME NOT NULL,
    payment_date DATETIME,
    penalty DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (participant_id) REFERENCES participants(id)
);
CREATE DATABASE IF NOT EXISTS tandas_db_new;
USE tandas_db_new;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) DEFAULT 'user',
    active BOOLEAN DEFAULT TRUE,
    failed_attempts INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_users_email (email)
);

CREATE TABLE IF NOT EXISTS tandas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contribution_amount DECIMAL(10,2) NOT NULL,
    payment_frequency ENUM('weekly','biweekly','monthly') NOT NULL,
    total_members INT NOT NULL,
    delay_tolerance_days INT DEFAULT 0,
    penalty_per_day DECIMAL(10,2) DEFAULT 0,
    status ENUM('created','in_progress','finished') NOT NULL DEFAULT 'created',
    creator_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    start_date DATETIME,
    CONSTRAINT fk_tandas_creator
        FOREIGN KEY (creator_id) REFERENCES users(id),
    INDEX idx_tandas_creator (creator_id),
    INDEX idx_tandas_status (status)
);

CREATE TABLE IF NOT EXISTS invitations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tanda_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    status ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
    token VARCHAR(255) NOT NULL,
    CONSTRAINT uq_invitations_token UNIQUE (token),
    CONSTRAINT fk_invitations_tanda
        FOREIGN KEY (tanda_id)
        REFERENCES tandas(id)
        ON DELETE CASCADE,
    INDEX idx_invitations_tanda (tanda_id),
    INDEX idx_invitations_email (email)
);

CREATE TABLE IF NOT EXISTS participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tanda_id INT NOT NULL,
    turn INT DEFAULT 0,
    already_paid BOOLEAN DEFAULT FALSE,
    expelled BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_participant_user_tanda UNIQUE (user_id, tanda_id),
    CONSTRAINT fk_participants_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_participants_tanda
        FOREIGN KEY (tanda_id)
        REFERENCES tandas(id)
        ON DELETE CASCADE,
    INDEX idx_participants_tanda (tanda_id),
    INDEX idx_participants_user (user_id)
);

CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id INT NOT NULL,
    period INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending','paid','late') NOT NULL DEFAULT 'pending',
    due_date DATETIME NOT NULL,
    payment_date DATETIME,
    penalty DECIMAL(10,2) DEFAULT 0,
    CONSTRAINT fk_payments_participant
        FOREIGN KEY (participant_id)
        REFERENCES participants(id)
        ON DELETE CASCADE,
    INDEX idx_payments_participant (participant_id),
    INDEX idx_payments_status (status),
    INDEX idx_payments_period (period)
);
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER'
);

CREATE TABLE IF NOT EXISTS prescriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prescription_date DATE NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    patient_age INT NOT NULL,
    patient_gender VARCHAR(50) NOT NULL,
    diagnosis TEXT,
    medicines TEXT,
    next_visit_date DATE,
    created_at DATE DEFAULT CURRENT_DATE
);
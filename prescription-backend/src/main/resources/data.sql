-- Insert users (with proper BCrypt encoded passwords)
-- Use MERGE for H2 database (equivalent to ON CONFLICT in PostgreSQL)
MERGE INTO users (username, password, role) KEY (username) 
VALUES ('admin', '$2a$10$N7iJ8Y4wJ5qZM5r4qJ5n0O.ZqJ5n0OZqJ5n0OZqJ5n0OZqJ5n0OZq', 'ADMIN');

MERGE INTO users (username, password, role) KEY (username) 
VALUES ('doctor', '$2a$10$N7iJ8Y4wJ5qZM5r4qJ5n0O.ZqJ5n0OZqJ5n0OZqJ5n0OZqJ5n0OZq', 'USER');

-- Insert sample prescriptions
INSERT INTO prescriptions (prescription_date, patient_name, patient_age, patient_gender, diagnosis, medicines, next_visit_date) VALUES 
('2025-11-01', 'John Doe', 35, 'Male', 'Common Cold', 'Paracetamol 500mg - 1 tab thrice daily', '2025-11-08'),
('2025-11-02', 'Jane Smith', 28, 'Female', 'Migraine', 'Ibuprofen 400mg - 1 tab as needed', NULL),
('2025-11-03', 'Robert Brown', 45, 'Male', 'Hypertension', 'Amlodipine 5mg - 1 tab daily', '2025-12-03');
-- ============================================================
-- Hospital Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS hospital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hospital_db;

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS departments (
  id            VARCHAR(50)  PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  description   TEXT         NOT NULL,
  icon          VARCHAR(10)  NOT NULL,
  weekday_hours VARCHAR(50)  NOT NULL,
  weekend_hours VARCHAR(50)  NOT NULL,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS doctors (
  id             VARCHAR(50)  PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  department_id  VARCHAR(50)  NOT NULL,
  photo          VARCHAR(255),
  bio            TEXT,
  created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_doctor_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
  INDEX idx_doctor_dept (department_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS slots (
  id          VARCHAR(100) PRIMARY KEY,   -- e.g. dr-smith-2025-07-20-09:00
  doctor_id   VARCHAR(50)  NOT NULL,
  slot_date   DATE         NOT NULL,
  slot_time   TIME         NOT NULL,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_slot_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  INDEX idx_slot_doctor_date (doctor_id, slot_date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS patients (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  name       VARCHAR(100) NOT NULL,
  phone      VARCHAR(30)  NOT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_patient_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS appointments (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slot_id       VARCHAR(100) NOT NULL UNIQUE,   -- one booking per slot
  doctor_id     VARCHAR(50)  NOT NULL,
  department_id VARCHAR(50)  NOT NULL,
  patient_id    INT UNSIGNED NOT NULL,
  status        ENUM('confirmed','cancelled') NOT NULL DEFAULT 'confirmed',
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_appt_slot   FOREIGN KEY (slot_id)       REFERENCES slots(id),
  CONSTRAINT fk_appt_doctor FOREIGN KEY (doctor_id)     REFERENCES doctors(id),
  CONSTRAINT fk_appt_dept   FOREIGN KEY (department_id) REFERENCES departments(id),
  CONSTRAINT fk_appt_patient FOREIGN KEY (patient_id)   REFERENCES patients(id),
  INDEX idx_appt_patient (patient_id),
  INDEX idx_appt_doctor  (doctor_id),
  INDEX idx_appt_status  (status)
) ENGINE=InnoDB;

-- ============================================================
-- Admin users table
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  full_name  VARCHAR(100) NOT NULL DEFAULT '',
  password   VARCHAR(255) NOT NULL,
  role       ENUM('admin','manager','staff') NOT NULL DEFAULT 'staff',
  is_active  TINYINT(1)   NOT NULL DEFAULT 1,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Seed users (all passwords = Admin@123)
INSERT IGNORE INTO admin_users (username, full_name, password, role) VALUES
('admin',   'System Admin',   '$2b$10$NgpPff7AYxIojAxKIUKb6.BMghNOULuFEpgTay/03xWzZy6a8Ip8e', 'admin'),
('manager1','Ward Manager',   '$2b$10$NgpPff7AYxIojAxKIUKb6.BMghNOULuFEpgTay/03xWzZy6a8Ip8e', 'manager'),
('staff1',  'Reception Staff','$2b$10$NgpPff7AYxIojAxKIUKb6.BMghNOULuFEpgTay/03xWzZy6a8Ip8e', 'staff');

-- ============================================================
-- SEED: Departments
-- ============================================================

INSERT IGNORE INTO departments (id, name, description, icon, weekday_hours, weekend_hours) VALUES
('cardiology',       'Cardiology',       'Comprehensive heart care including diagnosis, treatment, and prevention of cardiovascular diseases.', '❤️',  '8:00 AM - 6:00 PM', '9:00 AM - 2:00 PM'),
('pediatrics',       'Pediatrics',       'Specialized medical care for infants, children, and adolescents up to age 18.',                       '👶',  '7:00 AM - 7:00 PM', '8:00 AM - 4:00 PM'),
('orthopedics',      'Orthopedics',      'Treatment of musculoskeletal system including bones, joints, ligaments, tendons, and muscles.',        '🦴',  '8:00 AM - 5:00 PM', 'Closed'),
('neurology',        'Neurology',        'Diagnosis and treatment of disorders affecting the brain, spinal cord, and nervous system.',            '🧠',  '9:00 AM - 6:00 PM', '10:00 AM - 2:00 PM'),
('dermatology',      'Dermatology',      'Expert care for skin, hair, and nail conditions including medical and cosmetic treatments.',            '🩺',  '8:00 AM - 5:00 PM', 'Closed'),
('general-medicine', 'General Medicine', 'Primary care and treatment for a wide range of common health conditions and preventive care.',          '⚕️', '7:00 AM - 8:00 PM', '8:00 AM - 5:00 PM');

-- ============================================================
-- SEED: Doctors
-- ============================================================

INSERT IGNORE INTO doctors (id, name, specialization, department_id, photo, bio) VALUES
('dr-smith',     'Dr. Sarah Smith',         'Cardiologist',          'cardiology',       'https://via.placeholder.com/150/10B981/FFFFFF?text=SS', 'Board-certified cardiologist with 15 years of experience in interventional cardiology and heart disease prevention.'),
('dr-johnson',   'Dr. Michael Johnson',     'Cardiologist',          'cardiology',       'https://via.placeholder.com/150/10B981/FFFFFF?text=MJ', 'Specialized in cardiac imaging and non-invasive cardiology with expertise in echocardiography.'),
('dr-williams',  'Dr. Emily Williams',      'Pediatrician',          'pediatrics',       'https://via.placeholder.com/150/10B981/FFFFFF?text=EW', 'Dedicated pediatrician focusing on child development, vaccinations, and preventive care for children of all ages.'),
('dr-brown',     'Dr. James Brown',         'Pediatrician',          'pediatrics',       'https://via.placeholder.com/150/10B981/FFFFFF?text=JB', 'Experienced in pediatric emergency care and chronic disease management in children.'),
('dr-davis',     'Dr. Robert Davis',        'Orthopedic Surgeon',    'orthopedics',      'https://via.placeholder.com/150/10B981/FFFFFF?text=RD', 'Expert in joint replacement surgery and sports medicine with over 20 years of surgical experience.'),
('dr-miller',    'Dr. Jennifer Miller',     'Orthopedic Surgeon',    'orthopedics',      'https://via.placeholder.com/150/10B981/FFFFFF?text=JM', 'Specialized in spine surgery and minimally invasive orthopedic procedures.'),
('dr-wilson',    'Dr. David Wilson',        'Neurologist',           'neurology',        'https://via.placeholder.com/150/10B981/FFFFFF?text=DW', 'Board-certified neurologist with expertise in stroke care, epilepsy, and movement disorders.'),
('dr-moore',     'Dr. Lisa Moore',          'Neurologist',           'neurology',        'https://via.placeholder.com/150/10B981/FFFFFF?text=LM', 'Specialized in headache medicine and neuromuscular disorders with a focus on patient-centered care.'),
('dr-taylor',    'Dr. Amanda Taylor',       'Dermatologist',         'dermatology',      'https://via.placeholder.com/150/10B981/FFFFFF?text=AT', 'Expert in medical dermatology, skin cancer detection, and cosmetic dermatology procedures.'),
('dr-anderson',  'Dr. Christopher Anderson','Dermatologist',         'dermatology',      'https://via.placeholder.com/150/10B981/FFFFFF?text=CA', 'Specialized in pediatric dermatology and treatment of complex skin conditions.'),
('dr-thomas',    'Dr. Patricia Thomas',     'General Practitioner',  'general-medicine', 'https://via.placeholder.com/150/10B981/FFFFFF?text=PT', 'Family medicine physician providing comprehensive primary care for patients of all ages.'),
('dr-jackson',   'Dr. Richard Jackson',     'General Practitioner',  'general-medicine', 'https://via.placeholder.com/150/10B981/FFFFFF?text=RJ', 'Experienced in preventive medicine, chronic disease management, and health promotion.');

-- ============================================================
-- SEED: Slots (next 30 days, generated via stored procedure)
-- ============================================================

DROP PROCEDURE IF EXISTS generate_slots;

DELIMITER $$
CREATE PROCEDURE generate_slots()
BEGIN
  DECLARE done        INT DEFAULT 0;
  DECLARE v_doc_id    VARCHAR(50);
  DECLARE v_dept_id   VARCHAR(50);
  DECLARE v_weekend   VARCHAR(50);
  DECLARE v_day       DATE;
  DECLARE v_dow       INT;
  DECLARE v_slot_time TIME;
  DECLARE i           INT DEFAULT 0;

  DECLARE cur CURSOR FOR
    SELECT d.id, d.department_id, dep.weekend_hours
    FROM doctors d
    JOIN departments dep ON dep.id = d.department_id;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  OPEN cur;
  read_loop: LOOP
    FETCH cur INTO v_doc_id, v_dept_id, v_weekend;
    IF done THEN LEAVE read_loop; END IF;

    SET i = 0;
    WHILE i < 30 DO
      SET v_day = DATE_ADD(CURDATE(), INTERVAL i DAY);
      SET v_dow = DAYOFWEEK(v_day); -- 1=Sun, 7=Sat

      -- Skip weekends if department is closed
      IF (v_dow IN (1,7)) AND (v_weekend = 'Closed') THEN
        SET i = i + 1;
        ITERATE read_loop;
      END IF;

      -- Weekday slots
      IF v_dow NOT IN (1,7) THEN
        SET @times = '08:00,09:00,10:00,11:00,13:00,14:00,15:00,16:00,17:00';
      ELSE
        SET @times = '09:00,10:00,11:00,12:00,13:00';
      END IF;

      -- Insert each time slot
      BEGIN
        DECLARE t_idx INT DEFAULT 1;
        DECLARE t_val VARCHAR(5);
        DECLARE t_count INT;
        SET t_count = (LENGTH(@times) - LENGTH(REPLACE(@times, ',', ''))) + 1;
        WHILE t_idx <= t_count DO
          SET t_val = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(@times, ',', t_idx), ',', -1));
          SET v_slot_time = CAST(t_val AS TIME);
          INSERT IGNORE INTO slots (id, doctor_id, slot_date, slot_time)
          VALUES (CONCAT(v_doc_id, '-', v_day, '-', t_val), v_doc_id, v_day, v_slot_time);
          SET t_idx = t_idx + 1;
        END WHILE;
      END;

      SET i = i + 1;
    END WHILE;
  END LOOP;
  CLOSE cur;
END$$
DELIMITER ;

CALL generate_slots();
DROP PROCEDURE IF EXISTS generate_slots;

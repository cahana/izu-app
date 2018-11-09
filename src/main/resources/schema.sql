-- Tenure application database source script.

-- Uncomment the following, if needed...
--   DROP DATABASE IF EXISTS tenure;
--   COMMIT;
--   CREATE DATABASE tenure DEFAULT CHARACTER SET utf8;
--   GRANT ALL ON tenure.* TO tenure@'localhost' IDENTIFIED BY 'tenure';
--   GRANT ALL ON tenure.* TO tenure@'127.0.0.1' IDENTIFIED BY 'tenure';
--   COMMIT;


-- Enable USE statement, if needed.
--     Choices for Tenure App include:
--         tenureci
--         tenuredev
--         tenuretrn
--         tenuretst
--         tenureprd
--
-- USE tenure;

-- Disable foreign key constraints.
SET FOREIGN_KEY_CHECKS=0;

--
-- Drop all the tables.
--

DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS vital_statistics;
DROP TABLE IF EXISTS type;
DROP TABLE IF EXISTS person_type;

-- Re-enabled foreign key constraints.
SET FOREIGN_KEY_CHECKS=1;

--
-- Create tables.
--

CREATE TABLE person (
    id INT NOT NULL auto_increment,
    first_name varchar(50),
    last_name varchar(50) NOT NULL,
    email varchar(100) NOT NULL,
    primary key(id),
    UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE vital_statistics (
    id INT NOT NULL auto_increment,
    person_id INT NOT NULL,
    height_feet INT NOT NULL,
    height_inches INT NOT NULL,
    weight decimal(3,2) NOT NULL,
    bust INT NOT NULL,
    waist INT NOT NULL,
    hips INT NOT NULL,
    primary key(id),
    FOREIGN KEY (person_id) REFERENCES person(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE type (
    id varchar(20) NOT NULL,
    description varchar(200),
    primary key(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE person_type (
    person_id INT NOT NULL,
    type_id varchar(20) NOT NULL,
    UNIQUE  KEY (person_id, type_id),
    FOREIGN KEY (person_id) REFERENCES person(id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES type(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

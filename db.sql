CREATE DATABASE solarDB;

CREATE TABLE student (
    id VARCHAR(255) PRIMARY KEY,
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    username VARCHAR(100) UNIQUE,
    password VARCHAR(200),
     email VARCHAR(200) UNIQUE,
    role VARCHAR(50),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE (id)
);

DELETE FROM users;

SELECT * FROM users;

DROP TABLE users;
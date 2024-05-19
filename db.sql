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
    otp VARCHAR(10),
    skill VARCHAR(200),
    phone VARCHAR(50),
    profileimage TEXT,
    coverimage TEXT,
    facebook TEXT,
    twitter TEXT,
    linkedin TEXT,
    website TEXT,
    github TEXT,
    bio TEXT,
    UNIQUE (id)
);

CREATE TABLE courses (
    id VARCHAR(255) PRIMARY KEY,
    title TEXT,
    categories TEXT,
    details TEXT,
    QNA BOOLEAN,
    resourses TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    level VARCHAR(30),
    limited VARCHAR(30),
    author TEXT,
    image TEXT,
    UNIQUE (id)
);

DELETE FROM student;

SELECT * FROM student;

DROP TABLE student;
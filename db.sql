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
    status VARCHAR(20),
    price VARCHAR(30),
    title TEXT,
    categories TEXT,
    details TEXT,
    QNA BOOLEAN,
    resourses TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    level VARCHAR(30),
    studentlimit VARCHAR(30),
    author TEXT,
    image TEXT,
    authorId VARCHAR(255),
    UNIQUE (id)
);

CREATE TABLE enroll (
    id VARCHAR(255) PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    studentId VARCHAR(200),
    studentName VARCHAR(200),
    studentEmail VARCHAR(200),
    courseId VARCHAR(200),
    courseTitle TEXT,
    coursePrice VARCHAR(30),
    complete VARCHAR(20),
    UNIQUE (id)
);

CREATE TABLE wishlist (
    id VARCHAR(255) PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    courseId VARCHAR(200),
    authorId VARCHAR(200),
    authorName VARCHAR(200),
    courseTitle TEXT,
    category TEXT,
    rating VARCHAR(20),
    complete VARCHAR(20),
    UNIQUE (id)
);

ALTER TABLE enroll
ADD COLUMN complete VARCHAR(20);

DELETE FROM student;

SELECT * FROM student;

DROP TABLE courses;
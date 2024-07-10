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

CREATE TABLE categories (
    id VARCHAR(255) PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    authorId VARCHAR(200),
    icone TEXT,
    Title TEXT,
    UNIQUE (id)
);

CREATE TABLE announcement (
    id VARCHAR(255) PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    course_name Text,
    Title TEXT,
    summary TEXT,
    UNIQUE (id)
);

CREATE TABLE blog (
    id VARCHAR(255) PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    author_name Text,
    Title TEXT,
    category TEXT,
    image TEXT,
    description TEXT,
    tags TEXT,
    UNIQUE (id)
);



ALTER TABLE announcement
ADD COLUMN status VARCHAR(20);

DELETE FROM student;

SELECT * FROM student;

DROP TABLE courses;


npx prisma migrate dev --name create_user_schema


-- course data structer 
{
  "id": "623tu263er2763erfcd632",
  "authorId": "text",
  "title": "text",
  "about": "html text",
  "max_student": "number",
  "difficulty_level": "text",
  "public_course": "boolean",
  "QNA": "boolean",
  "category": "text",
  "price": {
    "type": "Paid/free",
    "regular": 1000,
    "discounted": 800
  },
  "thumbnail": "https://sldlk.jpg",
  "intro_video": "https://sldlk.jpg",
  "course_builder": [
    {
      "topic_name": "text",
      "topic_summery": "text",
      "lesson": [
        {
          "lesson_name": "text",
          "lesson_content": "html text",
          "lesson_image": "https://sldlk.jpg",
          "lesson_video": "https://sldlk.jpg",
          "video_time": "text",
          "lesson_attechments": [
            "https://example.com/attachment1.jpg",
            "https://example.com/attachment2.jpg"
          ]
        },
        {
          "lesson_name": "text",
          "lesson_content": "html text",
          "lesson_image": "https://sldlk.jpg",
          "lesson_video": "https://sldlk.jpg",
          "video_time": "text",
          "lesson_attechments": [
            "https://example.com/attachment1.jpg",
            "https://example.com/attachment2.jpg"
          ]
        }
      ],
      "quiz": [
        {
          "quiz_name": "text",
          "quiz_summery": "text",
          "quiz_question": [
            {
              "question": "text",
              "question_type": "text",
              "answer_required": "boolean",
              "point": "number",
              "description": "text",
              "answer": "text"
            },
            {
              "question": "text",
              "question_type": "text",
              "answer_required": "boolean",
              "point": "number",
              "description": "text",
              "answer": "text"
            }
          ],
          "quiz_settings": {
            "time_limit": "number",
            "quiz_feedback": "text",
            "attempts_allowed": "number",
            "passing_grade": "number",
            "max_question": "number",
            "advance_settings": {
              "auto_start": "boolean",
              "question_layout": "text",
              "random_order": "text",
              "hide_question_number": "boolean",
              "short_answer_characters": "number",
              "essay_question_answer_limit": "boolean"
            }
          }
        }
      ],
      "assignments": {
        "title": "text",
        "summary": "text",
        "attachments": "text",
        "time_limit": "text",
        "total_point": "number",
        "minimum_pass_point": "number",
        "allow_upload": "number",
        "maximum_file_size": "number"
      }
    },
    {
      "topic_name": "text",
      "topic_summery": "text",
      "lesson": [
        {
          "lesson_name": "text",
          "lesson_content": "html text",
          "lesson_image": "https://sldlk.jpg",
          "lesson_video": "https://sldlk.jpg",
          "video_time": "text",
          "lesson_attechments": [
            "https://example.com/attachment1.jpg",
            "https://example.com/attachment2.jpg"
          ]
        },
        {
          "lesson_name": "text",
          "lesson_content": "html text",
          "lesson_image": "https://sldlk.jpg",
          "lesson_video": "https://sldlk.jpg",
          "video_time": "text",
          "lesson_attechments": [
            "https://example.com/attachment1.jpg",
            "https://example.com/attachment2.jpg"
          ]
        }
      ],
      "quiz": [
        {
          "quiz_name": "text",
          "quiz_summery": "text",
          "quiz_question": [
            {
              "question": "text",
              "question_type": "text",
              "answer_required": "boolean",
              "point": "number",
              "description": "text",
              "answer": "text"
            },
            {
              "question": "text",
              "question_type": "text",
              "answer_required": "boolean",
              "point": "number",
              "description": "text",
              "answer": "text"
            }
          ],
          "quiz_settings": {
            "time_limit": "number",
            "quiz_feedback": "text",
            "attempts_allowed": "number",
            "passing_grade": "number",
            "max_question": "number",
            "advance_settings": {
              "auto_start": "boolean",
              "question_layout": "text",
              "random_order": "text",
              "hide_question_number": "boolean",
              "short_answer_characters": "number",
              "essay_question_answer_limit": "boolean"
            }
          }
        }
      ],
      "assignments": {
        "title": "text",
        "summary": "text",
        "attachments": "text",
        "time_limit": "text",
        "total_point": "number",
        "minimum_pass_point": "number",
        "allow_upload": "number",
        "maximum_file_size": "number"
      }
    }
  ],
  "instructors": [
    {
      "name": "Author 1",
      "email": "author1@example.com"
    },
    {
      "name": "Author 2",
      "email": "author2@example.com"
    }
  ],
  "attachments": [
    "https://example.com/attachment1.jpg",
    "https://example.com/attachment2.jpg"
  ],
  "additional_data": {
    "will_learn": "text",
    "target_audience": "text",
    "course_duration": "text",
    "materials": "text",
    "requirements": "text",
    "tags": ["tag1", "tag2"]
  },
  "course_prerequisites": ["course1", "course2"],
  "certificate_template": "text"
}
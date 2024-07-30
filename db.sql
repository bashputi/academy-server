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
  "title": "Introduction to Programming",
  "about": "Learn the basics of programming with this comprehensive course.",
  "authorId": "cly10ew8n0000145ylto2efzn",
  "maxStudent": 50,
  "difficultyLevel": "Beginner",
  "publicCourse": true,
  "QNA": true,
  "category": "Programming",
  "price": [
    {
      "type": "Paid",
      "regular": 100,
      "discounted": 80
    }
  ],
  "thumbnail": "https://example.com/thumbnail.jpg",
  "introVideo": "https://example.com/intro_video.mp4",
  "courseBuilder": [
    {
      "topicName": "Introduction",
      "topicSummery": "Introduction to the course",
      "lessons": [
        {
          "lessonName": "Variables and Data Types",
          "lessonContent": "<p>Learn about variables, strings, numbers, and booleans.</p>",
          "lessonImage": "https://example.com/lesson1.jpg",
          "lessonVideo": "https://example.com/lesson1.mp4",
          "videoTime": "10:00",
          "lessonAttachments": [
            {
              "url": "https://example.com/attachment1.pdf"
            },
            {
              "url": "https://example.com/attachment2.pdf"
            }
          ]
        },
        {
          "lessonName": "Control Flow",
          "lessonContent": "<p>Understand if statements, loops, and switch statements.</p>",
          "lessonImage": "https://example.com/lesson2.jpg",
          "lessonVideo": "https://example.com/lesson2.mp4",
          "videoTime": "15:00",
          "lessonAttachments": [
            {
              "url": "https://example.com/attachment3.pdf"
            }
          ]
        }
      ],
      "quizzes": [
        {
          "quizName": "Programming Basics Quiz",
          "quizSummery": "Test your knowledge of basic programming concepts.",
          "quizQuestions": [
            {
              "question": "What is a variable?",
              "questionType": "Multiple Choice",
              "answerRequired": true,
              "point": 10,
              "description": "Define what a variable is in programming.",
              "answer": "A variable is a named storage location capable of holding data."
            },
            {
              "question": "What does 'if' statement do?",
              "questionType": "Multiple Choice",
              "answerRequired": true,
              "point": 10,
              "description": "Explain the purpose of 'if' statements in programming.",
              "answer": "'if' statements execute a block of code if a specified condition is true."
            }
          ],
          "quizSettings": {
            "timeLimit": 30,
            "quizFeedback": "Detailed feedback will be provided after quiz completion.",
            "attemptsAllowed": 3,
            "passingGrade": 70,
            "maxQuestion": 10,
            "autoStart": true,
            "questionLayout": "Single Column",
            "randomOrder": "Yes",
            "hideQuestionNumber": false,
            "shortAnswerCharacters": 100,
            "essayQuestionAnswerLimit": false
            
          }
        }
      ],
      "assignment": {
        "title": "Programming Assignment",
        "summary": "Complete the programming assignment to apply what you've learned.",
        "attachments": "Submit your assignment in PDF format.",
        "timeLimit": "7 days",
        "totalPoint": 100,
        "minimumPassPoint": 70,
        "allowUpload": 1,
        "maximumFileSize": 5
      }
    }
  ],
  "instructors": [
    {
      "name": "John Doe",
      "email": "johndoe@example.com"
    }
  ],
  "attachments": [
    {
      "url": "https://example.com/attachment4.pdf"
    }
  ],
  "additionalData": {
    "willLearn": "Basic programming concepts",
    "targetAudience": "Beginners interested in learning programming",
    "courseDuration": "4 weeks",
    "materials": "Slides, exercises, quizzes",
    "requirements": "No prior programming experience required",
    "tags": "Programming, Beginner, Coding"
  },
  "coursePrerequisites": "None",
  "certificateTemplate": "https://example.com/certificate_template.pdf"
}
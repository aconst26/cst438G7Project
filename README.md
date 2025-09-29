# Welcome to Our Trivia Game

[Video Walkthrough]() 

[Github Repo](https://github.com/aconst26/cst438G7Project.git)

## Overview
Our application is a mobile trivia game that challenges users with fun and engaging questions. After signing up and logging in, users are directed to the quiz page where they can choose a category, difficulty level, and question format, either multiple choice or true/false. Each quiz is timed, and once the timer runs out, the quiz is automatically graded. The app also features a Daily Trivia page with a question of the day. If answered correctly, users earn points based on the difficulty level. All earned points are tracked in a leaderboard, allowing users to see how they rank against others based on their quiz and daily trivia performance.

## Introduction
* Communication Management:

   We communicated through Slack and in-person class meetups. Slack was used for daily updates and issue tracking, while meetups were used to discuss progress, troubleshoot issues, and plan upcoming features.
* Initial Stories/Issues Considered:
16 user stories were planned 
* Completed Stories/Issues:
We completed 14 stories

## Team Member Retrospectives
### Anthony Constante
1) Anthony’s Pull Request:

   [Created Signup Page](https://github.com/aconst26/cst438G7Project/pull/12) 

   [Backend Create Account + Database](https://github.com/aconst26/cst438G7Project/pull/21)

   [Created Leaderboards Page](https://github.com/aconst26/cst438G7Project/pull/24)

   [Polished Explore Page and Leaderboards Page](https://github.com/aconst26/cst438G7Project/pull/28) 

2) Anthony’s Github Issues:

   [Leaderboard Page](https://github.com/aconst26/cst438G7Project/issues/2) 

   [Signup Page](https://github.com/aconst26/cst438G7Project/issues/6)

   [Create Database](https://github.com/aconst26/cst438G7Project/issues/9)

   [Special XML Pages if Top 3](https://github.com/aconst26/cst438G7Project/issues/10) 

   [Initial App Setup](https://github.com/aconst26/cst438G7Project/issues/11)

   [Finished Backend for Signup Page](https://github.com/aconst26/cst438G7Project/issues/13)

### What was your role / which stories did you work on

+ What was the biggest challenge?
+ Why was it a challenge?
   + How was the challenge addressed?
+ Favorite / most interesting part of this project
+ If you could do it over, what would you change?
+ What is the most valuable thing you learned?

### Athena Lopez
1) Athena’s Pull Request:

   [Login Page Made](https://github.com/aconst26/cst438G7Project/pull/19)

   [Login Functionality](https://github.com/aconst26/cst438G7Project/pull/22)

   [Daily Trivia Page](https://github.com/aconst26/cst438G7Project/pull/27) 

2) Athena’s Github Issues:

   [Daily Trivia Questions](https://github.com/aconst26/cst438G7Project/issues/1)

   [Login Page](https://github.com/aconst26/cst438G7Project/issues/5)

   [Finished Backend of the Login Page](https://github.com/aconst26/cst438G7Project/issues/20)

### What was your role / which stories did you work on
I was responsible for implementing the login system and the Daily Trivia feature. For login, I validated user input, hashed passwords, authenticated credentials against our SQLite database, and routed users to the quiz page upon success. I also ensured the Sign-Up button redirected properly and stored user info using AsyncStorage. For the Daily Trivia page, I fetched a multiple-choice question from Open Trivia DB, decoded HTML entities, and awarded points based on difficulty. Points were stored in the database, and users were prevented from answering more than once per session.
+ What was the biggest challenge?   Getting the trivia questions from the API to work smoothly with our scoring system and database. I also ran into issues with Android Studio, which made it hard to test the app on my device.
   + Why was it a challenge?
   The API returned encoded HTML entities and inconsistent formats, which made it hard to display questions properly. Connecting the scoring system to the database also took careful testing to make sure everything updated correctly.
   + How was the challenge addressed?
   I used the HTML-entities library to clean up the question text, created a points system based on difficulty, and added retry logic in case the API failed. I also tested different edge cases to make sure the database handled updates correctly. 
+ Favorite / most interesting part of this project:
   Watching the app come together little by little and finally seeing it work as a complete functional app.
+ If you could do it over, what would you change?
   I’d spend more time learning how to write unit tests and use them to catch bugs earlier.
+ What is the most valuable thing you learned?
   I learned how to manage user sessions, connect to external APIs, and update a local database based on user actions. I also saw how important it is to validate input and handle errors carefully.

### William Peltz 
1) Will’s Pull Request:

   [Quiz page step one completed](https://github.com/aconst26/cst438G7Project/pull/17) 

   [Finished Rough Draft of Quiz Page Backend](https://github.com/aconst26/cst438G7Project/pull/23)

   [Completed Quiz Page Functionality with Option Select](https://github.com/aconst26/cst438G7Project/pull/29) 

2) Will’s Github Issues:
   
   [Select Categories for Questions Page](https://github.com/aconst26/cst438G7Project/issues/3)
 
   [Quiz Page](https://github.com/aconst26/cst438G7Project/issues/4)

   [Create Quiz Page with Questions Pulled from API](https://github.com/aconst26/cst438G7Project/issues/14)

   [Add Answer Selection and Quiz Grading with Grade Button and Timer](https://github.com/aconst26/cst438G7Project/issues/15)

   [Get Questions from Selected Criteria from the Previous Page](https://github.com/aconst26/cst438G7Project/issues/16)

### What was your role / which stories did you work on

+ What was the biggest challenge?
+ Why was it a challenge?
   + How was the challenge addressed?
+ Favorite / most interesting part of this project
+ If you could do it over, what would you change?
+ What is the most valuable thing you learned?


## Conclusion
+ How Successful Was the Project?

With this app, we set out to build a trivia game that included a daily question, full quizzes, and a leaderboard. We successfully implemented all core features, fixed major bugs, and delivered a working, user-friendly experience. While there’s always room for improvement, we’re proud of what we accomplished within the time we had.
+ Largest Victory:

Our biggest win was getting all the major features of the quiz page, daily trivia, and leaderboard to work smoothly together. Each part had its own challenges, but seeing them connect and function as one complete app was the most rewarding part of the project. 
+ Final assessment:

The project was a success for the amount of time we had. Despite losing a team member early on, we adapted quickly and worked together to build a fully functional trivia app. Along the way, we gained valuable experience in mobile development, backend integration, and collaborative coding.
